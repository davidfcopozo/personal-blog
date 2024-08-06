import Post from "../models/postModel";

import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestWithUserInfo } from "../typings/models/user";
import { NotFound, BadRequest, Unauthenticated } from "../errors/index";
import { PostType, UserType } from "../typings/types";
import { slugValidator } from "../utils/validators";
import User from "../models/userModel";
import mongoose from "mongoose";

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

    if (!slugValidator(slug)) {
      throw new BadRequest(
        "Slug should contain only letters, numbers, or hyphens and should not start or end with a hyphen"
      );
    }

    const existingSlug = await Post.findOne({
      slug,
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    }

    const post: PostType = await Post.create({
      ...req.body,
      postedBy: userId,
      slug: slug,
    });

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

export const getPostBySlug = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { slug },
  } = req;

  try {
    const post: PostType | null = await Post.findOne({ slug }).populate(
      "postedBy"
    );

    if (!post) {
      throw new NotFound("Post not found");
    }

    res.status(StatusCodes.OK).json({ success: true, data: post });
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
    const post: PostType | null = (await Post.findById(postId)) as PostType;

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

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post: PostType = await Post.findById(postId).session(session);
    const user: UserType = await User.findById(userId).session(session);

    if (!post) {
      throw new NotFound("This post doesn't exist or has been deleted");
    }

    if (!user) {
      throw new Unauthenticated("Unauthenticated: No token provided");
    }

    const isLiked = user?.likes?.filter((like) => like.toString() === postId);

    if (isLiked?.length! < 1) {
      // Add like to the post's likes array property
      const postResult = await Post.updateOne(
        { _id: post._id },
        { $addToSet: { likes: `${userId}` } },
        { session }
      );
      const userResult = await User.updateOne(
        { _id: user._id },
        { $addToSet: { likes: `${postId}` } },
        { session }
      );

      await session.commitTransaction();

      if (postResult.modifiedCount === 1 && userResult.modifiedCount === 1) {
        res
          .status(StatusCodes.OK)
          .json({ success: true, msg: "You've liked this post." });
      } else {
        await session.abortTransaction();
        throw new BadRequest("Something went wrong, please try again!");
      }
    } else {
      // Remove like from the post's likes array property
      const postResult = await Post.updateOne(
        { _id: post._id },
        { $pull: { likes: `${userId}` } },
        { new: true }
      );

      const userResult = await User.updateOne(
        { _id: user._id },
        { $pull: { likes: `${postId}` } },
        { new: true }
      );

      await session.commitTransaction();

      if (postResult.modifiedCount === 1 && userResult.modifiedCount === 1) {
        res.status(StatusCodes.OK).json({
          success: true,
          msg: "You've disliked this post.",
        });
      } else {
        await session.abortTransaction();
        throw new BadRequest("Something went wrong, please try again!");
      }
    }
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
};

export const toggleBookmark = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { postId },
    user: { userId },
  } = req;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const post: PostType = await Post.findById(postId).session(session);
    const user: UserType = await User.findById(userId).session(session);

    if (!post) {
      throw new NotFound("This post doesn't exist or has been deleted");
    }

    if (!user) {
      throw new Unauthenticated("Unauthenticated: No token provided");
    }

    const isBookmarked = user?.bookmarks?.filter(
      (bookmark) => bookmark.toString() === postId
    );

    if (isBookmarked?.length! < 1) {
      // Add bookmark to the post's likes array property
      const postResult = await Post.updateOne(
        { _id: post._id },
        { $addToSet: { bookmarks: `${userId}` } },
        { session }
      );
      const userResult = await User.updateOne(
        { _id: user._id },
        { $addToSet: { bookmarks: `${postId}` } },
        { session }
      );

      await session.commitTransaction();

      if (postResult.modifiedCount === 1 && userResult.modifiedCount === 1) {
        res
          .status(StatusCodes.OK)
          .json({ success: true, msg: "You've bookmarked this post." });
      } else {
        throw new BadRequest("Something went wrong, please try again!");
      }
    } else {
      // Remove bookmark from the post's likes array property
      const postResult = await Post.updateOne(
        { _id: post._id },
        { $pull: { bookmarks: `${userId}` } },
        { new: true }
      );

      const userResult = await User.updateOne(
        { _id: user._id },
        { $pull: { bookmarks: `${postId}` } },
        { new: true }
      );

      await session.commitTransaction();

      if (postResult.modifiedCount === 1 && userResult.modifiedCount === 1) {
        res.status(StatusCodes.OK).json({
          success: true,
          msg: "You've unbookmarked this post.",
        });
      } else {
        await session.abortTransaction();
        throw new BadRequest("Something went wrong, please try again!");
      }
    }
  } catch (error) {
    next(error);
  }
};
