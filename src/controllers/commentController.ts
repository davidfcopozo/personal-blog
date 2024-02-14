import Comment from "../models/commentModel";
import Post from "../models/postModel";

import { NextFunction, Response } from "express";
import { RequestWithUserInfo } from "../typings/models/user";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../errors/not-found";
import { BadRequest } from "../errors/bad-request";
import { CommentType, PostType } from "../typings/types";

export const createComment = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  try {
    const post: PostType = await Post.findById(postId);

    if (!post) {
      throw new NotFound("The post you're trying to comment on does not exist");
    }

    const comment = await Comment.create({
      ...req.body,
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
    body: { commentId },
    params: { id: postId },
    user: { userId },
  } = req;

  try {
    const post: PostType = await Post.findById(postId);
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

    // Remove comment from the post's comment's array property
    const result = await Post.updateOne(
      { _id: post._id },
      { $pull: { comments: `${commentId}` } },
      { new: true }
    );

    //If the comment id has been removed from the post's comment array, also remove it from the comment document
    if (result.modifiedCount === 1) {
      await Comment.deleteOne({
        _id: commentId,
        postedBy: userId,
      });
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
    const post: PostType = await Post.findById(postId);
    const comment: CommentType = await Comment.findById({
      _id: commentId,
      postedBy: userId,
    });

    if (!comment) {
      throw new NotFound("No comments found");
    }

    if (!post?._id.equals(comment?.post)) {
      throw new BadRequest("This comment does not belong to this post");
    }

    const isLiked = comment.likes?.filter((like) => like.toString() === userId);

    if (isLiked?.length! < 1) {
      // Add like to the comment's likes array property
      const result = await Comment.updateOne(
        { _id: comment._id },
        { $addToSet: { likes: `${userId}` } },
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
        { $pull: { likes: `${userId}` } },
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
