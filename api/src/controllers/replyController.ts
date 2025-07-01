import Comment from "../models/commentModel";
import Post from "../models/postModel";

import { NextFunction, Response } from "express";
import { RequestWithUserInfo } from "../typings/models/user";
import { StatusCodes } from "http-status-codes";
import { BadRequest, NotFound } from "../errors/index";
import { PostType, CommentType } from "../typings/types";
import { sanitizeContent } from "../utils/sanitize-content";
import { AnalyticsService } from "../utils/analyticsService";

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

    const replies = comment?.replies;

    if (!replies?.length) {
      throw new NotFound("No replies on this comment yet");
    }

    res.status(StatusCodes.OK).json({ success: true, data: replies });
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
    user,
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

    const reply = await Comment.findById(commentReply)
      .populate("likesCount")
      .populate("postedBy", "username avatar");

    if (!reply) {
      throw new NotFound("This comment doesn't exist or has been deleted.");
    }

    let replyWithInteractions = (reply as any).toJSON();
    if (user?.userId) {
      const isLiked = await AnalyticsService.hasUserLikedComment(
        replyId,
        user.userId
      );
      replyWithInteractions = {
        ...replyWithInteractions,
        isLiked,
      };
    } else {
      replyWithInteractions = {
        ...replyWithInteractions,
        isLiked: false,
      };
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
