import Comment from "../models/commentModel";
import Post from "../models/postModel";
import User from "../models/userModel";

import { NextFunction, Response } from "express";
import { RequestWithUserInfo } from "../typings/models/user";
import { StatusCodes } from "http-status-codes";
import { BadRequest, NotFound } from "../errors/index";
import { PostType, CommentType } from "../typings/types";
import { sanitizeContent } from "../utils/sanitize-content";
import { AnalyticsService } from "../utils/analyticsService";
import { NotificationService } from "../utils/notificationService";

export const createReply = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    params: { id: postId },
    body: { parentId, content },
  } = req;

  try {
    const post: PostType = await Post.findById(postId);

    if (!post) {
      throw new NotFound("The post you're trying to reply to does not exist");
    }

    const comment: CommentType = await Comment.findById(parentId).populate(
      "postedBy"
    );

    if (!comment) {
      throw new NotFound(
        "The comment you're trying to reply to does not exist"
      );
    }

    const cleanContent = sanitizeContent(content);

    const reply = await Comment.create({
      ...req.body,
      content: cleanContent,
      postedBy: userId,
      post: postId,
      isReply: true,
      parentId: parentId,
    });

    if (!reply) {
      throw new Error("Failed to create reply");
    }

    const result = await Comment.updateOne(
      { _id: comment?._id },
      {
        $addToSet: { replies: reply._id },
      },
      { new: true }
    );

    if (result?.modifiedCount === 1) {
      const notificationService: NotificationService = req.app.get(
        "notificationService"
      );

      if (notificationService) {
        const populatedReply = await Comment.findById(reply._id)
          .populate("postedBy")
          .populate("likesCount");

        if (!populatedReply) {
          throw new NotFound("Failed to populate the new reply");
        }

        const post = await Post.findById(postId);
        if (post?.slug) {
          await notificationService.emitNewReply(
            postId,
            parentId,
            populatedReply,
            post.slug
          );
        }

        // Notify the owner of the comment/reply being replied to (don't notify self)
        const commentOwnerId = (comment.postedBy as any)?._id
          ? (comment.postedBy as any)._id.toString()
          : comment.postedBy.toString();

        if (commentOwnerId !== userId) {
          await notificationService.createReplyNotification(
            commentOwnerId,
            userId,
            postId,
            reply._id.toString()
          );
        }
      }

      // Handle mentions in reply content
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
              reply._id.toString()
            );
          }
        }
      }

      // Record user activity for reply creation
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get("User-Agent");

      AnalyticsService.recordUserActivity({
        userId,
        // Replies are treated as comments in analytics
        action: "comment",
        resourceType: "post",
        resourceId: postId,
        metadata: {
          commentId: reply._id.toString(),
          parentCommentId: parentId,
          isReply: true,
        },
        ipAddress,
        userAgent,
      }).catch((error) => {
        console.error("Error recording reply activity:", error);
      });

      const replyWithAnalytics = await Comment.findById(reply._id)
        .populate("likesCount")
        .populate("postedBy", "username avatar");

      if (!replyWithAnalytics) {
        throw new BadRequest("Failed to create reply with analytics");
      }

      res.status(StatusCodes.CREATED).json({
        success: true,
        data: {
          ...replyWithAnalytics.toJSON(),
          isLiked: false,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getReplies = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { postId, commentId },
  } = req;

  try {
    const comment: CommentType = await Comment.findById(commentId);
    const post: PostType = await Post.findById(postId);

    if (!postId || !commentId) {
      throw new BadRequest("Please provide a post and comment id");
    }

    if (!comment) {
      throw new NotFound("This comment doesn't exist or has been deleted");
    }

    if (!post?._id.equals(`${comment?.post}`)) {
      throw new BadRequest("Something went wrong");
    }

    const replyIds = comment?.replies;

    if (!replyIds?.length) {
      throw new NotFound("No replies on this comment yet");
    }

    const replies = await Comment.find({ _id: { $in: replyIds } })
      .populate("likesCount")
      .populate("postedBy", "username avatar")
      .sort({ createdAt: 1 });

    let repliesWithInteractions = replies.map((reply) =>
      (reply as any).toJSON()
    );

    if (req.userId) {
      // Batch fetch like statuses for all replies to avoid N+1 query problem
      const replyIds = repliesWithInteractions.map((reply) => reply._id);
      const likeStatuses = await AnalyticsService.getUserLikeStatusForComments(
        replyIds,
        req.userId
      );

      // Map the like statuses back to replies
      repliesWithInteractions = repliesWithInteractions.map((reply) => ({
        ...reply,
        isLiked: likeStatuses[reply._id] || false,
      }));
    } else {
      // Ensure isLiked is always present for consistency
      repliesWithInteractions = repliesWithInteractions.map((reply) => ({
        ...reply,
        isLiked: false,
      }));
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: repliesWithInteractions,
      count: repliesWithInteractions.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getReplyById = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { id: postId, commentId, replyId },
  } = req;

  try {
    const comment: CommentType = await Comment.findById(commentId);
    const post: PostType = await Post.findById(postId);

    if (!commentId || !replyId) {
      throw new BadRequest("Please provide a comment and reply id");
    }

    //Get the reply by filtering comment's replies
    const commentReply = comment?.replies?.filter((reply) =>
      reply.equals(replyId)
    );

    //Check if the given reply exist
    if (!commentReply?.length) {
      throw new NotFound("This comment does not exist or has been deleted");
    }

    if (!comment) {
      throw new NotFound("This comment doesn't exist or has been deleted.");
    }

    if (!post?._id.equals(comment?.post)) {
      throw new BadRequest("Something went wrong");
    }

    const replyWithInteractions =
      await AnalyticsService.getUpdatedCommentWithLikes(replyId, req.userId);

    if (!replyWithInteractions) {
      throw new NotFound("This reply doesn't exist or has been deleted.");
    }

    res
      .status(StatusCodes.OK)
      .json({ success: true, data: replyWithInteractions });
  } catch (error) {
    next(error);
  }
};

export const deleteReplyById = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { id: postId, commentId, replyId },
    user: { userId },
  } = req;

  try {
    const post: PostType = await Post.findById(postId);
    const comment: CommentType = await Comment.findOne({
      _id: commentId,
    });
    const reply = await Comment.findById(replyId);

    if (!commentId || !replyId) {
      throw new BadRequest("Please provide a comment and reply id");
    }

    if (!comment) {
      throw new NotFound("This comment doesn't exist or has been deleted");
    }

    if (!reply) {
      throw new NotFound("This reply doesn't exist or has been deleted");
    }

    if (!reply.postedBy.equals(userId)) {
      throw new BadRequest("You can only delete your own replies");
    }

    // Recursively collect all nested reply IDs to delete
    const collectNestedReplyIds = async (
      replyId: string
    ): Promise<string[]> => {
      const reply = await Comment.findById(replyId);
      if (!reply || !reply.replies) return [];

      const nestedReplies: string[] = [];
      for (const childReplyId of reply.replies) {
        nestedReplies.push(childReplyId.toString());
        const childReplies = await collectNestedReplyIds(
          childReplyId.toString()
        );
        nestedReplies.push(...childReplies);
      }

      return nestedReplies;
    };

    const allNestedReplyIds = await collectNestedReplyIds(replyId);

    const commentReply = comment.replies?.filter((reply) =>
      reply.equals(replyId)
    );

    if (!post?._id.equals(comment?.post)) {
      throw new BadRequest("Something went wrong");
    }

    if (!commentReply?.length) {
      throw new NotFound("This comment does not exist or has been deleted");
    }

    // Remove reply from the comment's replies array property
    const result = await Comment.updateOne(
      { _id: comment._id },
      { $pull: { replies: replyId } },
      { new: true }
    );

    // If the reply id has been removed from the comment's replies array, also remove it from the comment collection
    if (result.modifiedCount === 1) {
      await Comment.deleteMany({
        _id: { $in: [...allNestedReplyIds, replyId] },
      });

      // Emit socket event for real-time updates
      const notificationService = req.app.get("notificationService");
      if (notificationService) {
        await notificationService.emitReplyDeleted(
          replyId,
          commentId,
          postId,
          userId,
          [...allNestedReplyIds, replyId]
        );
      }

      res
        .status(StatusCodes.OK)
        .json({ success: true, msg: "Reply has been successfully deleted." });
    } else {
      throw new BadRequest("Something went wrong, please try again!");
    }
  } catch (error) {
    next(error);
  }
};
