import User from "../models/userModel";

import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestWithUserInfo } from "../typings/models/user";
import { BadRequest, NotFound, Unauthenticated } from "../errors/index";
import { isValidUsername } from "../utils/validators";
import { UserType, FieldsToUpdateType } from "../typings/types";

const sensitiveDataToExclude =
  "-password -verificationToken -passwordVerificationToken";

export const getUsers = async (
  _req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const users: UserType[] = await User.find().select(sensitiveDataToExclude);

    if (!users) {
      throw new NotFound("Users not found");
    }

    res
      .status(StatusCodes.OK)
      .json({ success: true, data: users, amount: users.length });
  } catch (error) {
    return next(error);
  }
};

export const getUserById = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { id: commentId },
  } = req;

  try {
    const user: UserType = await User.findById(commentId).select(
      sensitiveDataToExclude
    );

    if (!user) {
      throw new NotFound("User not found");
    }

    res.status(StatusCodes.OK).json({ success: true, data: user });
  } catch (err) {
    return next(err);
  }
};

export const updateUserById = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    params: { id: userIdParam },
    body: { firstName, lastName, avatar, bio, title, username },
  } = req;

  try {
    const user: UserType = await User.findById(userId);

    if (!user) {
      throw new NotFound("User not found");
    }

    if (user.role !== "admin" && userId !== userIdParam) {
      throw new Unauthenticated("Your not authorized to perform this action");
    }

    let fields: FieldsToUpdateType = {
      firstName,
      lastName,
      avatar,
      bio,
      title,
      username,
    };
    let fieldsToUpdate: FieldsToUpdateType = {};

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

    const updatedUser: UserType = await User.findOneAndUpdate(
      { _id: user.role === "admin" ? userIdParam : userId },
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).select(sensitiveDataToExclude);

    if (!updatedUser?._id) {
      throw new Error("Something went wrong, please try again later");
    }

    res.status(StatusCodes.OK).json({ success: true, data: updatedUser });
  } catch (err) {
    return next(err);
  }
};

export const deleteUserById = async (
  req: RequestWithUserInfo | any,
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

  let user: UserType = await User.findOneAndRemove({ _id: id });

  try {
    if (!user) {
      throw new NotFound(`No user found with id ${id}`);
    }

    res
      .status(StatusCodes.OK)
      .json({ msg: `User has been successfully deleted` });
  } catch (err) {
    return next(err);
  }
};
