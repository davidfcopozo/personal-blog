const Comment = require("../models/commentModel");
const Post = require("../models/PostModel");

import { NextFunction, Response } from "express";
import { IRequestWithUserInfo } from "../interfaces/models/user";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../errors/not-found";
import { BadRequest } from "../errors/bad-request";

const createComment = async (
  req: IRequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  try {
    const comment = await Comment.create({
      ...req.body,
      postedBy: userId,
      post: postId,
    });

    await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { comments: comment._id },
      },
      { new: true }
    );

    res.status(StatusCodes.CREATED).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

const getComments = async (
  req: IRequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { postId },
  } = req;

  try {
    const post = await Post.findById(postId);

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

const getAComment = async (
  req: IRequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { id: postId },
    body: { commentId },
  } = req;

  try {
    const post = await Post.findById(postId);
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new NotFound("No comments found");
    }

    if (!post?._id.equals(comment?.post)) {
      throw new BadRequest("Something went wrong");
    }

    res.status(StatusCodes.OK).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (
  req: IRequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { id: commentId },
  } = req;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new NotFound("No comments found");
    }

    res.status(StatusCodes.OK).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getComments,
  getAComment,
  deleteComment,
};
