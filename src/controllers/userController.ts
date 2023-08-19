const User = require("../models/userModel");

import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestWithUserInfo } from "../interfaces/models/user";
import { NotFound /* BadRequest */ } from "../errors/index";
import { User } from "../interfaces/models/user";

const sensitiveDataToExclude =
  "-password -verificationToken -passwordVerificationToken";

const getUsers = async (
  _req: RequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  try {
    const users: User[] = await User.find().select(sensitiveDataToExclude);

    if (!users) {
      throw new NotFound("Users not found");
    }

    res.status(StatusCodes.CREATED).json({ success: true, data: users });
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (
  req: RequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { id: commentId },
  } = req;

  try {
    const user: User = await User.findById(commentId).select(
      sensitiveDataToExclude
    );

    if (!user) {
      throw new Error("User not found");
    }

    res.status(StatusCodes.OK).json({ success: true, data: user });
  } catch (err: any) {
    return next(new NotFound(err));
  }
};

// const updateUserById = async (
//   req: RequestWithUserInfo,
//   res: Response,
//   next: NextFunction
// ) => {
//   const {
//     user: { userId },
//     body: { name, image, bio, title },
//   } = req;

//   try {
//     const user: User = await User.findOneAndUpdate({ _id: userId }, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!post) {
//       throw new Error("Post not found");
//     }

//     res.status(StatusCodes.OK).json({ success: true, post });
//   } catch (err: any) {
//     return next(err);
//   }
// };

// const deletePostById = async (
//   req: RequestWithUserInfo,
//   res: Response,
//   next: NextFunction
// ) => {
//   const {
//     user: { userId },
//     params: { id: postId },
//   } = req;

//   const post = await Post.findOneAndRemove({ _id: postId, postedBy: userId });

//   try {
//     if (!post) {
//       throw new Error(`No post found with id ${postId}`);
//     }

//     res
//       .status(StatusCodes.OK)
//       .json({ msg: `Post has been successfully deleted` });
//   } catch (err: any) {
//     return next(new NotFound(err));
//   }
// };

// const toggleLike = async (
//   req: RequestWithUserInfo,
//   res: Response,
//   next: NextFunction
// ) => {
//   const {
//     body: { postId },
//     user: { userId },
//   } = req;

//   try {
//     const post: Post = await Post.findById(postId);

//     if (!post) {
//       throw new NotFound("This post doesn't exist or has been deleted");
//     }

//     const isLiked = post?.likes?.filter((like) => like.toString() === userId);

//     if (isLiked?.length! < 1) {
//       // Add like to the post's likes array property
//       const result = await Post.updateOne(
//         { _id: post._id },
//         { $addToSet: { likes: `${userId}` } },
//         { new: true }
//       );

//       if (result.modifiedCount === 1) {
//         res
//           .status(StatusCodes.OK)
//           .json({ success: true, msg: "You've liked this post." });
//       } else {
//         throw new BadRequest("Something went wrong, please try again!");
//       }
//     } else {
//       // Remove like from the post's likes array property
//       const result = await Post.updateOne(
//         { _id: post._id },
//         { $pull: { likes: `${userId}` } },
//         { new: true }
//       );

//       if (result.modifiedCount === 1) {
//         res.status(StatusCodes.OK).json({
//           success: true,
//           msg: "You've disliked this post.",
//         });
//       } else {
//         throw new BadRequest("Something went wrong, please try again!");
//       }
//     }
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  getUsers,
  getUserById,
};
