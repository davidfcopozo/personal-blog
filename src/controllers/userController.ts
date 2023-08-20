const User = require("../models/userModel");

import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestWithUserInfo } from "../interfaces/models/user";
import { BadRequest, NotFound } from "../errors/index";
import { User } from "../interfaces/models/user";
import { isValidUsername } from "../utils/validators";

const sensitiveDataToExclude =
  "-password -verificationToken -passwordVerificationToken";

type FieldsToUpdate = { [key: string]: string };

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

const updateUserById = async (
  req: RequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    body: { firstName, lastName, avatar, bio, title, username },
  } = req;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFound("User not found");
    }

    let fields: FieldsToUpdate = {
      firstName,
      lastName,
      avatar,
      bio,
      title,
      username,
    };
    let fieldsToUpdate: FieldsToUpdate = {};

    // Add key-value pair tp the fieldsToUpdate object only if they have a value
    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        if (fields[key]) {
          fieldsToUpdate[key] = fields[key];
        }
      }
    }

    if (Object.values(fieldsToUpdate).length < 1) {
      throw new BadRequest("Please provide the fields to update");
    }

    if (fieldsToUpdate.username && !isValidUsername(fieldsToUpdate.username)) {
      throw new BadRequest("Invalid username, please provide a valid one");
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).select(sensitiveDataToExclude);

    if (!updatedUser._id) {
      throw new Error("Something went wrong, please try again later");
    }

    res.status(StatusCodes.OK).json({ success: true, data: updatedUser });
  } catch (err) {
    return next(err);
  }
};

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
  updateUserById,
};
