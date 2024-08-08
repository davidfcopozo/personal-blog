import Post from "../models/postModel";

import { Response, NextFunction } from "express";
import { RequestWithUserInfo } from "../typings/models/user";
import { NotFound } from "../errors/index";
import { PostType } from "../typings/types";
import mongoose from "mongoose";

export const visitsCounter = async (
  req: RequestWithUserInfo | any,
  _res: Response,
  next: NextFunction
) => {
  const { slugOrId } = req.params;

  try {
    let post: PostType | null;

    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      post = await Post.findById(slugOrId).populate("postedBy");
    } else {
      post = await Post.findOne({ slug: slugOrId }).populate("postedBy");
    }

    if (post && post?.postedBy?.toString() !== req.user?.userId) {
      await Post.findByIdAndUpdate(
        post._id,
        { $inc: { visits: 1 } },
        { new: true }
      );
    }

    if (!post) {
      throw new NotFound("Post not found");
    }

    next();
  } catch (err) {
    next(err);
  }
};
