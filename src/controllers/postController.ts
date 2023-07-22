import { Response, NextFunction } from "express";
const Post = require("../models/PostModel");
import { StatusCodes } from "http-status-codes";
import { IRequestWithUserInfo } from "../interfaces/models/user";
import { NotFound } from "../errors/not-found";
import { Unauthenticated } from "../errors/unauthenticated";

const createPost = async (
  req: IRequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.user;
  try {
    await Post.create({ ...req.body, postedBy: userId });

    res.status(StatusCodes.CREATED).json({ msg: "Post created" });
  } catch (err: any) {
    return next(new NotFound(err));
  }
};

const getAllPosts = async (
  _: IRequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const posts = await Post.find().populate("postedBy").sort("createdAt");

  try {
    if (posts.length < 1) {
      throw new Error("Posts not found");
    }

    res.status(StatusCodes.OK).json({ posts, count: posts.length });
  } catch (err: any) {
    return next(new NotFound(err));
  }
};

const getPost = async (
  req: IRequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  try {
    const post = await Post.findOne({ _id: postId, postedBy: userId });

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.postedBy !== userId) {
      throw new Unauthenticated(
        "You're not authorized, please sign in or create an account"
      );
    }

    res.status(StatusCodes.OK).json({ success: true, data: post });
  } catch (err: any) {
    return next(new NotFound(err));
  }
};

const updatePost = async (
  req: IRequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  try {
    const post = await Post.findOneAndUpdate(
      { _id: postId, postedBy: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!post) {
      throw new Error("Post not found");
    }

    res.status(StatusCodes.OK).json({ success: true, post });
  } catch (err: any) {
    return next(err);
  }
};

const deletePost = async (
  req: IRequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  const post = await Post.findOneAndRemove({ _id: postId, postedBy: userId });

  try {
    if (!post) {
      throw new Error(`No post found with id ${postId}`);
    }

    res
      .status(StatusCodes.OK)
      .json({ msg: `Post has been successfully deleted` });
  } catch (err: any) {
    return next(new NotFound(err));
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
};
