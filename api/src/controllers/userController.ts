import User from "../models/userModel";
import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestWithUserInfo } from "../typings/models/user";
import { BadRequest, NotFound, Unauthenticated } from "../errors/index";
import { isValidUsername, websiteValidator } from "../utils/validators";
import { SocialMediaProfiles, UserType } from "../typings/types";
import mongoose from "mongoose";

const sensitiveDataToExclude =
  "-password -verificationToken -passwordVerificationToken";

export const getUsers = async (
  _req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const users: UserType[] = await User.find()
      .select(sensitiveDataToExclude)
      .lean();

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
    params: { id: userId },
  } = req;

  try {
    const user: UserType = await User.findById(userId)
      .select(sensitiveDataToExclude)
      .lean();

    if (!user) {
      throw new NotFound("User not found");
    }

    res.status(StatusCodes.OK).json({ success: true, data: user });
  } catch (err) {
    return next(err);
  }
};

export const getUserByUsername = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { username },
  } = req;

  try {
    if (!isValidUsername(username)) {
      throw new BadRequest("Invalid username");
    }

    const user: UserType = await User.findOne({ username })
      .select(sensitiveDataToExclude)
      .lean();

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
    body: {
      firstName,
      lastName,
      avatar,
      bio,
      title,
      username,
      website,
      socialMediaProfiles,
    },
  } = req;

  try {
    const user: UserType = await User.findById(userId);

    if (!user) {
      throw new NotFound("User not found");
    }

    if (user.role !== "admin" && userId !== userIdParam) {
      throw new Unauthenticated("You're not authorized to perform this action");
    }

    // Deep merge function for social media profiles with handle validation
    const deepMergeSocialMediaProfiles = (
      existing: SocialMediaProfiles,
      updates: SocialMediaProfiles
    ) => {
      const merged = { ...existing };
      for (const [key, value] of Object.entries(updates)) {
        if (value === null) {
          delete merged[key as keyof SocialMediaProfiles];
        } else if (typeof value === "object" && !Array.isArray(value)) {
          merged[key as keyof SocialMediaProfiles] = value as string;
        } else {
          // Validate the handle using isValidUsername
          if (!isValidUsername(value as string)) {
            throw new BadRequest(`Invalid social media handle for ${key}`);
          }
          merged[key as keyof SocialMediaProfiles] = value as string;
        }
      }
      return merged;
    };

    let updatedSocialMediaProfiles;
    try {
      updatedSocialMediaProfiles = deepMergeSocialMediaProfiles(
        (user.socialMediaProfiles as SocialMediaProfiles) || {},
        socialMediaProfiles || {}
      );
    } catch (error) {
      if (error instanceof BadRequest) {
        throw error;
      }
      throw new BadRequest("Invalid social media profiles");
    }

    let fields: Partial<UserType> = {
      firstName,
      lastName,
      avatar,
      bio,
      title,
      username,
      website,
      socialMediaProfiles: updatedSocialMediaProfiles,
    };
    let fieldsToUpdate: Partial<UserType> = {};

    // Add key-value pair to the fieldsToUpdate object only if they have a value
    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        const typedKey = key as keyof UserType;
        if (fields[typedKey] !== undefined) {
          fieldsToUpdate[typedKey] = fields[
            typedKey
          ] as UserType[keyof UserType];
        }
      }
    }

    if (Object.keys(fieldsToUpdate).length < 1) {
      throw new BadRequest("Please provide the fields to update");
    }

    if (
      fieldsToUpdate.username &&
      !isValidUsername(fieldsToUpdate.username as string)
    ) {
      throw new BadRequest("Invalid username, please provide a valid one");
    }

    if (
      fieldsToUpdate.website &&
      !websiteValidator(fieldsToUpdate.website as string)
    ) {
      throw new BadRequest("Invalid URL, please provide a valid one");
    }

    const updatedUser: UserType = await User.findOneAndUpdate(
      { _id: user.role === "admin" ? userIdParam : userId },
      fieldsToUpdate,
      { new: true, runValidators: true }
    )
      .select(sensitiveDataToExclude)
      .lean();

    if (!updatedUser?._id) {
      throw new Error("Something went wrong, please try again later");
    }

    res.status(StatusCodes.OK).json({ success: true, data: updatedUser });
  } catch (err) {
    return next(err);
  }
};

export const toggleFollowUser = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId } = req.user;
    const { id: userToFollowId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userToFollowId)) {
      throw new BadRequest("Invalid user ID");
    }

    const userToFollow = await User.findById(userToFollowId).session(session);

    if (!userToFollow) throw new NotFound("User not found");

    if (userId === userToFollowId) {
      throw new BadRequest("You can't follow/unfollow yourself");
    }

    const user = await User.findById(userId).session(session);
    if (!user) throw new Unauthenticated("You need to be logged in");

    const isFollowing =
      user.following?.some((id) => id.toString() === userToFollowId) || false;
    const operation = isFollowing ? "$pull" : "$addToSet";
    const status = isFollowing ? StatusCodes.OK : StatusCodes.CREATED;
    const message = isFollowing
      ? "You've unfollowed this user"
      : "You're now following this user";

    const [updateFollowing, updateFollowers] = await Promise.all([
      User.updateOne(
        { _id: userId },
        { [operation]: { following: userToFollowId } },
        { session }
      ),
      User.updateOne(
        { _id: userToFollowId },
        { [operation]: { followers: userId } },
        { session }
      ),
    ]);

    if (
      updateFollowing.modifiedCount !== 1 ||
      updateFollowers.modifiedCount !== 1
    ) {
      throw new BadRequest("Failed to update following status");
    }

    await session.commitTransaction();
    res.status(status).json({ success: true, msg: message });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
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
