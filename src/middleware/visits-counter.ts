import Post from "../models/postModel";

import { Response, NextFunction } from "express";
import { RequestWithUserInfo } from "../typings/models/user";
import { NotFound } from "../errors/index";
import { PostType } from "../typings/types";

export const visitsCounter = async (
  req: RequestWithUserInfo | any,
  _res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const post: PostType = await Post.findByIdAndUpdate(
      id,
      { $inc: { visits: 1 } },
      { new: true }
    );

    if (!post) {
      throw new NotFound("Post not found");
    }

    next();
  } catch (err) {
    next(err);
  }
};
