import { /* Request, */ Response, NextFunction } from "express";
const Post = require("../models/PostModel");
import { StatusCodes } from "http-status-codes";
import { IRequestWithUserInfo } from "../interfaces/models/user";
import { NotFound } from "../errors/not-found";
/* 
import Crypto from "crypto";
*/

const createPost = async (req: IRequestWithUserInfo, res: Response) => {
  /* 
  const { title, content, image, userId } = req.body; 
  const { userId } = req.user;   
  */

  await Post.create(req.body);

  res.status(StatusCodes.OK).json({ msg: "post sent" });
};

const getAllPosts = async (
  req: IRequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.user;
  userId;
  /* "648dce371dca718fb662f5ba" */
  const posts = await Post.find({ postedBy: userId }).sort("createdAt");

  try {
    if (posts.length < 1) {
      throw new Error("Posts not found");
    }

    res.status(StatusCodes.OK).json({ posts, count: posts.length });
  } catch (err: any) {
    next(new NotFound(err));
  }
};

const getPost = (/* req: Request, res: Response, next: NextFunction*/) => {
  console.log("A single post");
};

const updatePost = (/* req: Request, res: Response, next: NextFunction*/) => {
  console.log("Update  post");
};

const deletePost = async (
  req: IRequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.user;
  const { id } = req.params;

  const post = await Post.findOneAndRemove({ _id: id, postedBy: userId });

  try {
    if (!post) {
      throw new Error(`No post found with id ${id}`);
    }

    res
      .status(StatusCodes.OK)
      .json({ msg: `Post has been successfully deleted` });
  } catch (err: any) {
    next(new NotFound(err));
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
};
