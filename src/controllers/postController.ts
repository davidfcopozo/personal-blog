const Post = require("../models/postModel");

import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestWithUserInfo } from "../interfaces/models/user";
import { NotFound, BadRequest } from "../errors/index";
import { Post } from "../interfaces/models/post";

const createPost = async (
  req: RequestWithUserInfo,
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
  _: RequestWithUserInfo,
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

const getPostById = async (
  req: RequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { id: postId },
  } = req;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    res.status(StatusCodes.OK).json({ success: true, data: post });
  } catch (err: any) {
    return next(new NotFound(err));
  }
};

const updatePostById = async (
  req: RequestWithUserInfo,
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

const deletePostById = async (
  req: RequestWithUserInfo,
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

const toggleLike = async (
  req: RequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { postId },
    user: { userId },
  } = req;

  try {
    const post: Post = await Post.findById(postId);

    if (!post) {
      throw new NotFound("This post doesn't exist or has been deleted");
    }

    const isLiked = post?.likes?.filter((like) => like.toString() === userId);

    if (isLiked?.length! < 1) {
      // Add like to the post's likes array property
      const result = await Post.updateOne(
        { _id: post._id },
        { $addToSet: { likes: `${userId}` } },
        { new: true }
      );

      if (result.modifiedCount === 1) {
        res
          .status(StatusCodes.OK)
          .json({ success: true, msg: "You've liked this post." });
      } else {
        throw new BadRequest("Something went wrong, please try again!");
      }
    } else {
      // Remove like from the post's likes array property
      const result = await Post.updateOne(
        { _id: post._id },
        { $pull: { likes: `${userId}` } },
        { new: true }
      );

      if (result.modifiedCount === 1) {
        res.status(StatusCodes.OK).json({
          success: true,
          msg: "You've disliked this post.",
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
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
  toggleLike,
};
