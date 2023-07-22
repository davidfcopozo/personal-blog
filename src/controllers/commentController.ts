const Comment = require("../models/commentModel");
const Post = require("../models/PostModel");

import { NextFunction, Response } from "express";
import { IRequestWithUserInfo } from "../interfaces/models/user";
import { StatusCodes } from "http-status-codes";

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

const getComments = async () => {
  console.log("All comments");
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
