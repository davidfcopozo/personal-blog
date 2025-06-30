import Post from "../models/postModel";
import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestWithUserInfo } from "../typings/models/user";
import { NotFound, BadRequest, Unauthenticated } from "../errors/index";
import { PostType } from "../typings/types";
import { slugValidator } from "../utils/validators";
import mongoose from "mongoose";
import { sanitizeContent } from "../utils/sanitize-content";
import { CategoryInterface } from "../typings/models/category";
import Category from "../models/categoryModel";
import { NotificationService } from "../utils/notificationService";
import { AnalyticsService } from "../utils/analyticsService";

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

    const userId = req.user?.userId;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent");
    const referrer = req.get("Referrer");

    AnalyticsService.recordPostView({
      postId: post._id.toString(),
      userId,
      ipAddress,
      userAgent,
      referrer,
      source: referrer ? "referral" : "direct",
    }).catch((error) => {
      console.error("Error recording post view:", error);
    });

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
  // Debug logging
  console.log("🔍 toggleLike Debug Info:");
  console.log("📍 Request body:", req.body);
  console.log("📍 Request params:", req.params);
  console.log("📍 User info:", req.user);

  const {
    body: { postId },
    user: { userId },
  } = req;

  // Additional validation and debugging
  if (!postId) {
    console.log("❌ PostId is missing from request body:", req.body);
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "PostId is required in request body",
      receivedBody: req.body,
    });
  }

  if (!userId) {
    console.log("❌ UserId is missing from request user:", req.user);
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "User authentication required",
    });
  }

  console.log("📍 Extracted - PostId:", postId, "UserId:", userId);

  try {
    const post: PostType = await Post.findById(postId).populate("postedBy");

    if (!post) {
      throw new NotFound("This post doesn't exist or has been deleted");
    }

    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent");

    const result = await AnalyticsService.togglePostLike(
      postId,
      userId,
      ipAddress,
      userAgent
    );

    const notificationService: NotificationService = req.app.get(
      "notificationService"
    );
    const postOwnerId =
      (post.postedBy as any)?._id?.toString() || post.postedBy.toString();

    if (notificationService) {
      console.log(
        "📤 About to emit like update for post:",
        postId,
        "user:",
        userId
      );
      await notificationService.emitLikeUpdate(postId, userId, result.liked);

      if (postOwnerId !== userId && result.liked) {
        await notificationService.createLikeNotification(
          postOwnerId,
          userId,
          postId
        );
      }
    } else {
      console.log("❌ No notification service available");
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: result.liked
        ? "You've liked this post."
        : "You've disliked this post.",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const toggleBookmark = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  // Debug logging
  console.log("🔍 toggleBookmark Debug Info:");
  console.log("📍 Request body:", req.body);
  console.log("📍 Request params:", req.params);
  console.log("📍 User info:", req.user);

  const {
    body: { postId },
    user: { userId },
  } = req;

  // Additional validation and debugging
  if (!postId) {
    console.log("❌ PostId is missing from request body:", req.body);
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "PostId is required in request body",
      receivedBody: req.body,
    });
  }

  if (!userId) {
    console.log("❌ UserId is missing from request user:", req.user);
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "User authentication required",
    });
  }

  console.log("📍 Extracted - PostId:", postId, "UserId:", userId);

  try {
    const post: PostType = await Post.findById(postId).populate("postedBy");

    if (!post) {
      throw new NotFound("This post doesn't exist or has been deleted");
    }

    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent");

    const result = await AnalyticsService.togglePostBookmark(
      postId,
      userId,
      ipAddress,
      userAgent
    );

    const notificationService: NotificationService = req.app.get(
      "notificationService"
    );
    const postOwnerId =
      (post.postedBy as any)?._id?.toString() || post.postedBy.toString();

    if (notificationService) {
      await notificationService.emitBookmarkUpdate(
        postId,
        userId,
        result.bookmarked
      );

      if (postOwnerId !== userId && result.bookmarked) {
        await notificationService.createBookmarkNotification(
          postOwnerId,
          userId,
          postId
        );
      }
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      msg: result.bookmarked
        ? "You've bookmarked this post."
        : "You've unbookmarked this post.",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const previewPost = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const { slugOrId } = req.params;
  const { userId } = req.user;

  try {
    let post: PostType | null;

    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      post = await Post.findById(slugOrId).populate("postedBy");
    } else {
      post = await Post.findOne({ slug: slugOrId }).populate("postedBy");
    }

    if (!post) {
      throw new NotFound("Post not found");
    }

    const postOwnerId =
      (post.postedBy as any)?._id?.toString() || post.postedBy.toString();

    if (postOwnerId !== userId) {
      throw new Unauthenticated("You are not authorized to preview this post");
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: post,
      isPreview: true,
    });
  } catch (err) {
    return next(err);
  }
};

export const getUserPosts = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.user;
  const { status } = req.query;

  try {
    let query: any = { postedBy: userId };

    if (status && ["draft", "published", "unpublished"].includes(status)) {
      query.status = status;
    }

    const posts: PostType[] = await Post.find(query)
      .populate("postedBy")
      .sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
      success: true,
      data: posts,
      count: posts.length,
    });
  } catch (err) {
    return next(err);
  }
};
