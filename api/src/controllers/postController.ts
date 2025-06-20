import Post from "../models/postModel";
import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestWithUserInfo } from "../typings/models/user";
import { NotFound, BadRequest, Unauthenticated } from "../errors/index";
import { PostType, UserType } from "../typings/types";
import { slugValidator } from "../utils/validators";
import User from "../models/userModel";
import mongoose from "mongoose";
import { sanitizeContent } from "../utils/sanitize-content";
import { CategoryInterface } from "../typings/models/category";
import Category from "../models/categoryModel";

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

    const sanitizedContent = sanitizeContent(req.body.content);

    const existingSlug = await Post.findOne({
      slug,
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    }

    const newTags = req.body.tags || [];
    const newCategories = req.body.categories || [];
    const uniqueTags = [...new Set(newTags)];
    const uniqueCategories = [...new Set(newCategories)];

    const post: PostType = await Post.create({
      ...req.body,
      content: sanitizedContent,
      postedBy: userId,
      tags: uniqueTags,
      categories: uniqueCategories,
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
  const posts: PostType[] = await Post.find({ status: "published" })
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

export const getPostBySlugOrId = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const { slugOrId } = req.params;
  try {
    let post: PostType | null;

    // Only find published posts for public access
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      post = await Post.findOne({
        _id: slugOrId,
        status: "published",
      }).populate("postedBy");
    } else {
      post = await Post.findOne({
        slug: slugOrId,
        status: "published",
      }).populate("postedBy");
    }

    if (!post) {
      throw new NotFound("Post not found");
    }

    res.status(StatusCodes.OK).json({ success: true, data: post });
  } catch (err) {
    return next(err);
  }
};

export const getPostsByCategory = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const { category } = req.params;
  try {
    const cat = (await Category.findOne({
      slug: category,
    }).populate("postedBy")) as CategoryInterface | null;

    if (!cat) {
      throw new NotFound("Category not found");
    }

    const posts: PostType[] = await Post.find({
      categories: cat._id,
      status: "published", // Only show published posts
    }).populate("postedBy");

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
    const sanitizedContent = sanitizeContent(req.body.content);
    const oldPostTags = oldPost.tags || [];
    const newTags = req.body.tags || [];
    const oldPostCategories = oldPost.categories || [];
    const newCategories = req.body.categories || [];
    const uniqueTags = [...new Set([...oldPostTags, ...newTags])];
    const uniqueCategories = [
      ...new Set([...oldPostCategories, ...newCategories]),
    ];

    const post: PostType = await Post.findOneAndUpdate(
      { _id: postId, postedBy: userId },
      {
        ...req.body,
        tags: uniqueTags,
        categories: uniqueCategories,
        content: sanitizedContent,
      },
      { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json({ success: true, data: post });
  } catch (err) {
    return next(err);
  }
};

export const updatePostBySlugOrId = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    params: { slugOrId },
  } = req;

  try {
    const oldPost = await Post.findOne({
      $or: [{ slug: slugOrId }, { _id: slugOrId }],
    });

    if (!oldPost) {
      throw new NotFound("Post not found");
    }

    if (oldPost.postedBy.toString() !== userId) {
      throw new Unauthenticated("You are not authorized to update this post");
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      throw new BadRequest(
        "Nothing to update. Please provide the data to be updated"
      );
    }
    const {
      title,
      content,
      slug,
      coverImage,
      bookmarks,
      comments,
      status,
      tags,
      categories,
    } = req.body;

    // Initialize update operations
    const updateOperations: any = {};

    // Handle regular fields only if they are provided
    const setFields: any = {};
    if (title !== undefined) setFields.title = title;
    if (content !== undefined) setFields.content = sanitizeContent(content);
    if (slug !== undefined) setFields.slug = slug;
    if (bookmarks !== undefined) setFields.bookmarks = bookmarks;
    if (comments !== undefined) setFields.comments = comments;
    if (status !== undefined) setFields.status = status;

    if (coverImage !== undefined) {
      setFields.coverImage = coverImage || process.env.DEFAULT_POST_IMAGE;
    }

    // Only add $set if there are fields to set
    if (Object.keys(setFields).length > 0) {
      updateOperations.$set = setFields;
    }

    // Handle tags and categories only if they are provided
    if (Array.isArray(tags)) {
      updateOperations.$set = {
        ...updateOperations.$set,
        tags: tags,
      };
    }

    if (Array.isArray(categories)) {
      updateOperations.$set = {
        ...updateOperations.$set,
        categories: categories,
      };
    }

    // Perform a single atomic update
    const updatedPost = await Post.findOneAndUpdate(
      { _id: oldPost._id, postedBy: userId },
      updateOperations,
      {
        new: true,
        runValidators: true,
      }
    ).populate("postedBy");

    if (!updatedPost) {
      throw new NotFound("Post could not be updated");
    }

    res.status(StatusCodes.OK).json({ success: true, data: updatedPost });
  } catch (err) {
    return next(err);
  }
};

export const deletePostBySlugOrId = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    params: { slugOrId },
  } = req;

  try {
    const post = await Post.findOne({
      $or: [{ slug: slugOrId }, { _id: slugOrId }],
    });

    if (!post) {
      throw new NotFound(`No post found with slug or id ${slugOrId}`);
    }

    if (post.postedBy.toString() !== userId) {
      throw new Unauthenticated("You are not authorized to delete this post");
    }

    await Post.findOneAndRemove({
      _id: post._id,
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
        { $addToSet: { likes: userId } },
        { session }
      );
      const userResult = await User.updateOne(
        { _id: user._id },
        { $addToSet: { likes: postId } },
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
        { $pull: { likes: userId } },
        { new: true }
      );

      const userResult = await User.updateOne(
        { _id: user._id },
        { $pull: { likes: postId } },
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
        { $addToSet: { bookmarks: userId } },
        { session }
      );
      const userResult = await User.updateOne(
        { _id: user._id },
        { $addToSet: { bookmarks: postId } },
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
        { $pull: { bookmarks: userId } },
        { new: true }
      );

      const userResult = await User.updateOne(
        { _id: user._id },
        { $pull: { bookmarks: postId } },
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

/**
 * Preview a post - allows post owners to view their own posts regardless of status
 * This includes drafts, published, and unpublished posts
 */
export const previewPost = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const { slugOrId } = req.params;
  const { userId } = req.user;

  try {
    let post: PostType | null;

    // Find post by slug or ID
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      post = await Post.findById(slugOrId).populate("postedBy");
    } else {
      post = await Post.findOne({ slug: slugOrId }).populate("postedBy");
    }

    if (!post) {
      throw new NotFound("Post not found");
    } // Check if the user is the owner of the post
    // Handle both populated and non-populated postedBy field
    const postOwnerId =
      (post.postedBy as any)?._id?.toString() || post.postedBy.toString();

    if (postOwnerId !== userId) {
      throw new Unauthenticated("You are not authorized to preview this post");
    }

    // Return the post regardless of its status (draft, published, unpublished)
    // since the owner should be able to preview their own content
    res.status(StatusCodes.OK).json({
      success: true,
      data: post,
      isPreview: true,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Get user's own posts - returns all posts created by the authenticated user
 * Supports optional status filtering via query parameter
 */
export const getUserPosts = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.user;
  const { status } = req.query; // Optional filter by status

  try {
    let query: any = { postedBy: userId };

    // Add status filter if provided
    if (status && ["draft", "published", "unpublished"].includes(status)) {
      query.status = status;
    }

    const posts: PostType[] = await Post.find(query)
      .populate("postedBy")
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(StatusCodes.OK).json({
      success: true,
      data: posts,
      count: posts.length,
    });
  } catch (err) {
    return next(err);
  }
};
