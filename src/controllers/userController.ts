const User = require("../models/userModel");

import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestWithUserInfo } from "../interfaces/models/user";
import { BadRequest, NotFound, Unauthenticated } from "../errors/index";
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

    res
      .status(StatusCodes.CREATED)
      .json({ success: true, data: users, amount: users.length });
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

const deleteUserById = async (
  req: RequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    params: { id },
  } = req;

  if (userId !== id) {
    throw new Unauthenticated("Your not authorized to perform this action");
  }

  let user = await User.findOneAndRemove({ _id: id });

  try {
    if (!user) {
      throw new Error(`No user found with id ${id}`);
    }

    res
      .status(StatusCodes.OK)
      .json({ msg: `User has been successfully deleted` });
  } catch (err: any) {
    return next(new NotFound(err));
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
