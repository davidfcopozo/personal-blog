import User from "../models/userModel";
import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestWithUserInfo } from "../typings/models/user";
import { BadRequest, NotFound, Unauthenticated } from "../errors/index";
import { isValidUsername } from "../utils/validators";
import { UserType } from "../typings/types";
import mongoose from "mongoose";
import { CategoryInterface } from "../typings/models/category";
import { TopicInterface } from "../typings/models/topic";

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
      skills,
      interests,
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

    let interestsIds = interests?.map(
      (interest: CategoryInterface) => interest._id
    );
    let skillsIds = skills?.map((skill: TopicInterface) => skill._id);

    // Construct fields to update
    let fieldsToUpdate: Partial<UserType> = {
      firstName,
      lastName,
      avatar,
      bio,
      title,
      username,
      website,
      socialMediaProfiles,
      technologies: skillsIds,
      topicsOfInterest: interestsIds,
    };

    const updatedUser: UserType = await User.findOneAndUpdate(
      { _id: user.role === "admin" ? userIdParam : userId },
      fieldsToUpdate,
      { new: true, runValidators: true }
    )
      .select("-password -verificationToken")
      .lean();

    if (!updatedUser) {
      throw new Error("Failed to update user profile.");
    }

    res.status(StatusCodes.OK).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
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
