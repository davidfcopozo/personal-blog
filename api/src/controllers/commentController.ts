import Comment from "../models/commentModel";
import Post from "../models/postModel";

import { NextFunction, Response } from "express";
import { RequestWithUserInfo } from "../typings/models/user";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../errors/not-found";
import { BadRequest } from "../errors/bad-request";
import { CommentType, PostMongooseType, PostType } from "../typings/types";
import { sanitizeContent } from "../utils/sanitize-content";

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
    const post: PostType = await Post.findById(postId);

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
      res.status(StatusCodes.CREATED).json({ success: true, data: comment });
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
    body: { postId },
  } = req;

  try {
    /*   await Post.deleteMany();
    await Comment.deleteMany(); */
    const post: PostType = await Post.findById(postId);

    if (!post) {
      throw new NotFound("This post doesn't exist");
    }

    const comments = post?.comments?.length;

    if (!comments) {
      throw new NotFound("No comments on this post");
    }

    res.status(StatusCodes.OK).json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

export const getCommentById = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { id: commentId },
  } = req;

  try {
    const comment: CommentType = await Comment.findById(commentId);

    if (!comment) {
      throw new NotFound("No comments found");
    }

    res.status(StatusCodes.OK).json({ success: true, data: comment });
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

    // Collect all nested reply IDs
    const allNestedReplyIds = await collectNestedReplyIds(commentId);

    // Remove comment from the post's comments array
    const result = await Post.updateOne(
      { _id: post._id },
      { $pull: { comments: commentId } },
      { new: true }
    );

    if (result.modifiedCount === 1) {
      // Delete the main comment
      await Comment.deleteOne({
        _id: commentId,
        postedBy: userId,
      });

      // Delete all nested replies
      if (allNestedReplyIds.length > 0) {
        await Comment.deleteMany({
          _id: { $in: [...allNestedReplyIds, commentId] },
        });
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
    });

    if (!comment) {
      throw new NotFound("No comments found");
    }

    //If post's id is not equal to the post id the comment bolongs to, throw an error
    if (!post?._id.equals(comment?.post)) {
      throw new BadRequest("This comment does not belong to this post");
    }

    const isLiked = comment.likes?.filter((like) => like.toString() === userId);

    if (isLiked?.length! < 1) {
      // Add like to the comment's likes array property
      const result = await Comment.updateOne(
        { _id: comment._id },
        { $addToSet: { likes: userId } },
        { new: true }
      );

      //If the comment id has been removed from the post's comment array, also remove it from the comment document
      if (result.modifiedCount === 1) {
        res
          .status(StatusCodes.OK)
          .json({ success: true, msg: "You've liked this comment." });
      } else {
        throw new BadRequest("Something went wrong, please try again!");
      }
    } else {
      // Remove like from the comment's likes array property
      const result = await Comment.updateOne(
        { _id: comment._id },
        { $pull: { likes: userId } },
        { new: true }
      );

      if (result.modifiedCount === 1) {
        res.status(StatusCodes.OK).json({
          success: true,
          msg: "You've disliked this comment.",
        });
      } else {
        throw new BadRequest("Something went wrong, please try again!");
      }
    }
  } catch (error) {
    next(error);
  }
};
