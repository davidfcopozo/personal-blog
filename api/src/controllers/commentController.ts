import Comment from "../models/commentModel";
import Post from "../models/postModel";
import User from "../models/userModel";

import { NextFunction, Response } from "express";
import { RequestWithUserInfo } from "../typings/models/user";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../errors/not-found";
import { BadRequest } from "../errors/bad-request";
import { CommentType, PostMongooseType, PostType } from "../typings/types";
import { sanitizeContent } from "../utils/sanitize-content";
import { NotificationService } from "../utils/notificationService";
import { AnalyticsService } from "../utils/analyticsService";

export const createComment = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    params: { id: postId },
    body: { content },
  } = req;

  try {
    const post: PostType = await Post.findById(postId).populate("postedBy");

    if (!post) {
      throw new NotFound("The post you're trying to comment on does not exist");
    }

    const cleanContent = sanitizeContent(content);

    const comment = await Comment.create({
      ...req.body,
      content: cleanContent,
      postedBy: userId,
      post: postId,
    });
    const result = await Post.updateOne(
      { _id: postId },
      {
        $addToSet: { comments: comment._id },
      },
      { new: true }
    );
    if (result?.modifiedCount === 1) {
      const notificationService: NotificationService = req.app.get(
        "notificationService"
      );

      if (notificationService) {
        const populatedComment = await Comment.findById(comment._id)
          .populate("postedBy")
          .populate("likesCount");

        if (!populatedComment) {
          throw new NotFound("Failed to populate the new comment");
        }

        await notificationService.emitNewComment(
          postId,
          populatedComment,
          post.slug
        );

        const postOwnerId = (post.postedBy as any)?._id
          ? (post.postedBy as any)._id.toString()
          : post.postedBy.toString();

        if (postOwnerId !== userId) {
          await notificationService.createCommentNotification(
            postOwnerId,
            userId,
            postId,
            comment._id.toString()
          );
        }
      }

      const mentionRegex = /@(\w+)/g;
      const mentions = cleanContent.match(mentionRegex);

      if (mentions && notificationService) {
        const uniqueMentions = [
          ...new Set(mentions.map((mention) => mention.substring(1))),
        ];

        for (const username of uniqueMentions) {
          const mentionedUser = await User.findOne({ username });
          if (mentionedUser && mentionedUser._id.toString() !== userId) {
            await notificationService.createMentionNotification(
              mentionedUser._id,
              userId,
              postId,
              comment._id.toString()
            );
          }
        }
      }

      // Record user activity for comment creation
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get("User-Agent");

      AnalyticsService.recordUserActivity({
        userId,
        action: "comment",
        resourceType: "post",
        resourceId: postId,
        metadata: {
          commentId: comment._id.toString(),
        },
        ipAddress,
        userAgent,
      }).catch((error) => {
        console.error("Error recording comment activity:", error);
      });

      const commentWithAnalytics = await Comment.findById(comment._id)
        .populate("likesCount")
        .populate("postedBy", "username avatar");

      if (!commentWithAnalytics) {
        throw new BadRequest("Failed to create comment with analytics");
      }

      res.status(StatusCodes.CREATED).json({
        success: true,
        data: {
          ...commentWithAnalytics.toJSON(),
          isLiked: false,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getComments = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { postId },
    user,
  } = req;

  try {
    const post: PostType = await Post.findById(postId);

    if (!post) {
      throw new NotFound("This post doesn't exist");
    }

    if (!post?.comments?.length) {
      return res.status(StatusCodes.OK).json({
        success: true,
        data: [],
        message: "No comments on this post",
      });
    }

    const comments = await Comment.find({ post: postId })
      .populate("likesCount")
      .populate("postedBy", "username avatar")
      .populate({
        path: "replies",
        populate: [
          {
            path: "postedBy",
            select: "username avatar",
          },
          {
            path: "likesCount",
          },
        ],
      })
      .sort({ createdAt: -1 });

    let commentsWithInteractions = comments.map((comment) =>
      (comment as any).toJSON()
    );

    if (user?.userId) {
      // Check which comments the user has liked
      commentsWithInteractions = await Promise.all(
        commentsWithInteractions.map(async (comment) => {
          const isLiked = await AnalyticsService.hasUserLikedComment(
            comment._id,
            user.userId
          );
          return {
            ...comment,
            isLiked,
          };
        })
      );
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: commentsWithInteractions,
      count: commentsWithInteractions.length,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCommentById = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { id: commentId },
    user,
  } = req;

  try {
    const comment: CommentType = await Comment.findById(commentId)
      .populate("likesCount")
      .populate("postedBy", "username avatar");

    if (!comment) {
      throw new NotFound("No comments found");
    }

    let commentWithInteractions = (comment as any).toJSON();
    if (user?.userId) {
      const isLiked = await AnalyticsService.hasUserLikedComment(
        commentId,
        user.userId
      );
      commentWithInteractions = {
        ...commentWithInteractions,
        isLiked,
      };
    }

    res
      .status(StatusCodes.OK)
      .json({ success: true, data: commentWithInteractions });
  } catch (error) {
    next(error);
  }
};

export const deleteCommentById = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { id: postId, commentId },
    user: { userId },
  } = req;

  try {
    const post = (await Post.findById(postId)) as PostMongooseType | null;
    if (!post) {
      throw new NotFound("This post doesn't exist");
    }

    const comment: CommentType = await Comment.findOne({
      _id: commentId,
      postedBy: userId,
    });

    if (!comment) {
      throw new NotFound("No comments found");
    }

    if (!post?._id.equals(comment?.post)) {
      throw new BadRequest("Something went wrong");
    }

    // Recursively collect all nested reply IDs to delete
    const collectNestedReplyIds = async (
      commentId: string
    ): Promise<string[]> => {
      const currentComment = await Comment.findById(commentId);
      if (!currentComment || !currentComment.replies) return [];

      const nestedReplies: string[] = [];
      for (const replyId of currentComment.replies) {
        nestedReplies.push(replyId.toString());
        const childReplies = await collectNestedReplyIds(replyId.toString());
        nestedReplies.push(...childReplies);
      }

      return nestedReplies;
    };

    const allNestedReplyIds = await collectNestedReplyIds(commentId);

    // Remove comment from the post's comments array
    const result = await Post.updateOne(
      { _id: post._id },
      { $pull: { comments: commentId } },
      { new: true }
    );
    if (result.modifiedCount === 1) {
      await Comment.deleteOne({
        _id: commentId,
        postedBy: userId,
      });

      if (allNestedReplyIds.length > 0) {
        await Comment.deleteMany({
          _id: { $in: [...allNestedReplyIds, commentId] },
        });
      }

      // Emit socket event for real-time updates
      const notificationService: NotificationService = req.app.get(
        "notificationService"
      );

      if (notificationService) {
        await notificationService.emitCommentDeleted(
          commentId,
          postId,
          userId,
          [...allNestedReplyIds, commentId]
        );
      }

      res
        .status(StatusCodes.OK)
        .json({ success: true, msg: "Comment has been successfully deleted." });
    } else {
      throw new BadRequest("Something went wrong, please try again!");
    }
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { commentId },
    params: { id: postId },
    user: { userId },
  } = req;

  try {
    const post = (await Post.findById(postId)) as PostMongooseType | null;
    const comment: CommentType = await Comment.findById({
      _id: commentId,
    }).populate("postedBy");

    if (!comment) {
      throw new NotFound("No comments found");
    }

    if (!post?._id.equals(comment?.post)) {
      throw new BadRequest("This comment does not belong to this post");
    }

    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent");

    const result = await AnalyticsService.toggleCommentLike(
      commentId,
      userId,
      ipAddress,
      userAgent
    );

    const notificationService: NotificationService = req.app.get(
      "notificationService"
    );

    if (notificationService) {
      await notificationService.emitCommentLikeUpdate(
        commentId,
        userId,
        result.liked
      );

      // Create notification for comment author (if not liking own comment)
      const commentOwnerId = (comment.postedBy as any)?._id
        ? (comment.postedBy as any)._id.toString()
        : comment.postedBy.toString();

      if (commentOwnerId !== userId && result.liked) {
        await notificationService.createCommentLikeNotification(
          commentOwnerId,
          userId,
          postId,
          commentId
        );
      }
    }

    res.status(StatusCodes.OK).json({
      success: true,
      msg: result.liked
        ? "You've liked this comment."
        : "You've disliked this comment.",
      data: {
        ...result,
        commentId,
        userId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCommentById = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { id: postId, commentId },
    user: { userId },
    body: { content },
  } = req;

  try {
    const post = (await Post.findById(postId)) as PostMongooseType | null;
    if (!post) {
      throw new NotFound("This post doesn't exist");
    }

    const comment: CommentType = await Comment.findOne({
      _id: commentId,
      postedBy: userId,
    });

    if (!comment) {
      throw new NotFound(
        "No comments found or you're not authorized to edit this comment"
      );
    }

    if (!post?._id.equals(comment?.post)) {
      throw new BadRequest("This comment does not belong to this post");
    }

    if (!content || content.trim() === "") {
      throw new BadRequest("Comment content cannot be empty");
    }

    const cleanContent = sanitizeContent(content);

    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId, postedBy: userId },
      { content: cleanContent },
      { new: true, runValidators: true }
    );

    if (!updatedComment) {
      throw new BadRequest("Failed to update comment");
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: updatedComment,
      msg: "Comment updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
