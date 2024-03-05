import Post from "../models/postModel";

import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestWithUserInfo } from "../typings/models/user";
import { NotFound, BadRequest, Unauthenticated } from "../errors/index";
import { PostType } from "../typings/types";

export const createPost = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.user;
  try {
    if (!req.body.title && !req.body.content) {
      throw new BadRequest("Title and content are required");
    }

    let slug = req.body.slug
      ? req.body.slug.toLowerCase().split(" ").join("-")
      : req.body.title.toLowerCase().split(" ").join("-");


    res.status(StatusCodes.CREATED).json({ success: true, data: post });
  } catch (err) {
    return next(err);
  }
};

export const getAllPosts = async (
  _: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const posts: PostType[] = await Post.find()
    .populate("postedBy")
    .sort("createdAt");

  try {
    if (posts.length < 1) {
      throw new NotFound("Posts not found");
    }

    res
      .status(StatusCodes.OK)
      .json({ success: true, data: posts, count: posts.length });
  } catch (err) {
    return next(err);
  }
};

export const getPostById = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { id: postId },
  } = req;

  try {
    const post: PostType = await Post.findById(postId);

    if (!post) {
      throw new NotFound("Post not found");
    }

    res.status(StatusCodes.OK).json({ success: true, data: post });
  } catch (err) {
    return next(err);
  }
};

export const updatePostById = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  try {
    const oldPost: PostType = await Post.findById(postId);

    if (!oldPost) {
      throw new NotFound("Post not found");
    }

    if (oldPost && oldPost?.postedBy?.toString() !== userId) {
      throw new Unauthenticated("You are not authorized to update this post");
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      throw new BadRequest(
        "Nothing to update. Please provide the data to be updated"
      );
    }

    const post: PostType = await Post.findOneAndUpdate(
      { _id: postId, postedBy: userId },
      req.body,
      { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json({ success: true, data: post });
  } catch (err) {
    return next(err);
  }
};

export const deletePostById = async (
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
      throw new NotFound(`No post found with id ${postId}`);
    }

    if (post && post?.postedBy?.toString() !== userId) {
      throw new Unauthenticated("Unauthorized: No token provided");
    }

    await Post.findOneAndRemove({
      _id: postId,
      postedBy: userId,
    });

    res
      .status(StatusCodes.OK)
      .json({ success: true, msg: `Post has been successfully deleted` });
  } catch (err) {
    return next(err);
  }
};

export const toggleLike = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { postId },
    user: { userId },
  } = req;

  try {
    const post: PostType = await Post.findById(postId);

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
