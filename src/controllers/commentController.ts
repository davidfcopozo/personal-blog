const Comment = require("../models/commentModel");
const Post = require("../models/PostModel");

import { NextFunction, Response } from "express";
import { RequestWithUserInfo } from "../interfaces/models/user";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../errors/not-found";
import { BadRequest } from "../errors/bad-request";
import { Comment } from "../interfaces/models/comment";
import { Post } from "../interfaces/models/post";

const createComment = async (
  req: RequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  try {
    const comment: Comment = await Comment.create({
      ...req.body,
      postedBy: userId,
      post: postId,
    });

    const post = await Post.findById(postId);

    if (!post) {
      throw new NotFound("The post you're trying to comment on does not exist");
    }

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

const getComments = async (
  req: RequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { postId },
  } = req;

  try {
    /*   await Post.deleteMany();
    await Comment.deleteMany(); */
    const post: Post = await Post.findById(postId);

    if (!post) {
      throw new NotFound("This post doesn't exist");
    }

    const comments = post?.comments;

    if (!comments) {
      throw new NotFound("No comments on this post");
    }

    res.status(StatusCodes.OK).json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

const getCommentById = async (
  req: RequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { commentId },
  } = req;

  try {
    const comment: Comment = await Comment.findById(commentId);

    if (!comment) {
      throw new NotFound("No comments found");
    }

    res.status(StatusCodes.OK).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

const deleteCommentById = async (
  req: RequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { commentId },
    params: { id: postId },
    user: { userId },
  } = req;

  try {
    const post: Post = await Post.findById(postId);
    const comment: Comment = await Comment.findOne({
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

const toggleLike = async (
  req: RequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { commentId },
    params: { id: postId },
    user: { userId },
  } = req;

  try {
    const post: Post = await Post.findById(postId);
    const comment: Comment = await Comment.findById({
      _id: commentId,
      postedBy: userId,
    });

    if (!comment) {
      throw new NotFound("No comments found");
    }

    if (!post?._id.equals(comment?.post)) {
      throw new BadRequest("Something went wrong");
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

module.exports = {
  createComment,
  getComments,
  getCommentById,
  deleteCommentById,
  toggleLike,
};
