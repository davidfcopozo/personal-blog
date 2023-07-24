const Comment = require("../models/commentModel");
const Post = require("../models/PostModel");

import { NextFunction, Response } from "express";
import { IRequestWithUserInfo } from "../interfaces/models/user";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../errors/not-found";

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

const getAComment = async () => {
  console.log("A single comments");
};

const deleteComment = async () => {
  console.log("Delete comment");
};

module.exports = {
  createComment,
  getComments,
  getAComment,
  deleteComment,
};
