import User from "../models/userModel";
import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { MongooseId, RequestWithUserInfo } from "../typings/models/user";
import { BadRequest, NotFound, Unauthenticated } from "../errors/index";
import { isValidUsername, validateImageUrl } from "../utils/validators";
import { UserType } from "../typings/types";
import mongoose from "mongoose";
import { CategoryInterface } from "../typings/models/category";
import { TopicInterface } from "../typings/models/topic";
import Topic from "../models/topicModel";
import Category from "../models/categoryModel";
import Image from "../models/imageModel";
import { DuplicatedResource } from "../errors/duplicated-resource";
import { NotificationService } from "../utils/notificationService";

const sensitiveDataToExclude = process.env.SENSITIVE_DATA_TO_EXCLUDE;

export const getUsers = async (
  _req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const users: UserType[] = await User.find()
      .select(sensitiveDataToExclude as string)
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
    user: { userId: currentUserId } = { userId: null },
    headers,
  } = req;

  const headerUserId =
    headers["x-user-id"] || headers["X-User-ID"] || headers["X-User-Id"];

  try {
    const user: UserType = await User.findById(userId)
      .populate("technologies")
      .populate("topicsOfInterest")
      .select(sensitiveDataToExclude as string)
      .lean();

    if (!user) {
      throw new NotFound("User not found");
    }

    // Add isFollowed property for the requesting user
    const requestingUserId = currentUserId || headerUserId;

    if (requestingUserId) {
      // Check if the current user is following this user
      const currentUser = await User.findById(requestingUserId)
        .select("following")
        .lean();

      if (currentUser && currentUser.following) {
        const isFollowed = (currentUser.following as any[]).some(
          (id: any) => id.toString() === user._id.toString()
        );

        (user as any).isFollowed = isFollowed;
      } else {
        (user as any).isFollowed = false;
      }
    } else {
      (user as any).isFollowed = false;
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
    user: { userId: currentUserId } = { userId: null },
    headers,
  } = req;

  const headerUserId =
    headers["x-user-id"] || headers["X-User-ID"] || headers["X-User-Id"];

  try {
    if (!isValidUsername(username)) {
      throw new BadRequest("Invalid username");
    }

    const user: UserType = await User.findOne({ username })
      .populate("technologies")
      .populate("topicsOfInterest")
      .select(sensitiveDataToExclude as string)
      .lean();

    if (!user) {
      throw new NotFound("User not found");
    }

    const requestingUserId = currentUserId || headerUserId;

    if (requestingUserId) {
      const currentUser = await User.findById(requestingUserId)
        .select("following")
        .lean();

      if (currentUser && currentUser.following) {
        const isFollowed = (currentUser.following as any[]).some(
          (id: any) => id.toString() === user._id.toString()
        );

        (user as any).isFollowed = isFollowed;
      } else {
        (user as any).isFollowed = false;
      }
    } else {
      (user as any).isFollowed = false;
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
      locale,
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

    // Extract IDs
    let interestsIds = interests?.map(
      (interest: TopicInterface) => interest._id
    );
    let skillsIds = skills?.map((skill: CategoryInterface) => skill._id);

    // Validate interests if provided
    if (interestsIds?.length > 0) {
      const validInterests = await Topic.find({
        _id: { $in: interestsIds },
      }).select("_id");

      const foundInterestIds = validInterests.map((interest) =>
        interest._id.toString()
      );

      const invalidInterestIds: MongooseId[] = interestsIds.filter(
        (id: MongooseId): boolean => !foundInterestIds.includes(id.toString())
      );

      if (invalidInterestIds.length > 0) {
        throw new BadRequest(
          `Invalid interest categories: ${invalidInterestIds.join(", ")}`
        );
      }
    }

    // Validate skills if provided
    if (skillsIds?.length > 0) {
      const validSkills = await Category.find({
        _id: { $in: skillsIds },
      }).select("_id");

      const foundSkillIds = validSkills.map((skill) => skill._id.toString());
      const invalidSkillIds = skillsIds.filter(
        (id: string | mongoose.Types.ObjectId) =>
          !foundSkillIds.includes(id.toString())
      );

      if (invalidSkillIds.length > 0) {
        throw new BadRequest(
          `Invalid skill topics: ${invalidSkillIds.join(", ")}`
        );
      }
    }

    let fieldsToUpdate: Partial<UserType> = {};

    if (firstName !== undefined) fieldsToUpdate.firstName = firstName;
    if (lastName !== undefined) fieldsToUpdate.lastName = lastName;
    if (avatar !== undefined) fieldsToUpdate.avatar = avatar;
    if (bio !== undefined) fieldsToUpdate.bio = bio;
    if (title !== undefined) fieldsToUpdate.title = title;
    if (username !== undefined) fieldsToUpdate.username = username;
    if (website !== undefined) fieldsToUpdate.website = website;
    if (locale !== undefined) fieldsToUpdate.locale = locale;
    if (socialMediaProfiles !== undefined)
      fieldsToUpdate.socialMediaProfiles = socialMediaProfiles;
    if (skillsIds !== undefined) fieldsToUpdate.technologies = skillsIds;
    if (interestsIds !== undefined)
      fieldsToUpdate.topicsOfInterest = interestsIds;

    const updatedUser: UserType = await User.findOneAndUpdate(
      { _id: user.role === "admin" ? userIdParam : userId },
      fieldsToUpdate,
      { new: true, runValidators: true }
    )
      .select(sensitiveDataToExclude as string)
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

    // Get notification service and emit events
    const notificationService: NotificationService = req.app.get(
      "notificationService"
    );

    if (notificationService) {
      await notificationService.emitFollowUpdate(
        userToFollowId,
        userId,
        !isFollowing
      );

      if (!isFollowing) {
        await notificationService.createFollowNotification(
          userToFollowId,
          userId
        );
      }
    } else {
      console.error(`❌ NotificationService not available in toggleFollowUser`);
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

export const getImagesByUserId = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    params: { id },
    user: { userId },
  } = req;

  try {
    if (id !== userId.toString()) {
      throw new Unauthenticated("You're not authorized to perform this action");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFound("User not found");
    }

    const images = await Image.find({ postedBy: id });

    if (!images) {
      throw new NotFound("No images found");
    }

    res
      .status(StatusCodes.OK)
      .json({ success: true, data: images, count: images.length });
  } catch (error) {
    return next(error);
  }
};

export const uploadImages = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    body,
    params: { id },
  } = req;

  try {
    const user: UserType = await User.findById(userId);

    if (!user) {
      throw new NotFound("User not found");
    }

    if (user._id.toString() !== id) {
      throw new Unauthenticated("You're not authorized to perform this action");
    }

    const imageData = body.images || body.image;

    if (!imageData) {
      throw new BadRequest("No image data provided");
    }

    const imagesArray = Array.isArray(imageData) ? imageData : [imageData];

    const newImages = [];

    for (const image of imagesArray) {
      const validUrl = validateImageUrl(image.url);

      if (!validUrl) {
        throw new BadRequest("Invalid image URL");
      }

      const existingImage = await Image.findOne({
        postedBy: user._id,
        hash: image.hash,
      });

      if (existingImage) {
        throw new DuplicatedResource(`Duplicate image detected: ${image.name}`);
      }

      const newImage = await Image.create({
        name: image.name,
        title: image.title || image.name?.split(".")[0] || "",
        url: image.url,
        altText: image.altText || "",
        tags: image.tags || [],
        hash: image.hash,
        postedBy: user._id,
        size: image.size,
        type: image.type,
        dimensions: image.dimensions,
        createdAt: image.createdAt || new Date(),
      });

      newImages.push(newImage);
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: newImages.length === 1 ? newImages[0] : newImages,
    });
  } catch (err) {
    return next(err);
  }
};

export const updateImage = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    body: { image },
    params: { id },
  } = req;

  try {
    const { _id: imageId, title, altText, tags } = image;

    if (!title && !altText && !tags) {
      throw new BadRequest("No fields to update were provided");
    }

    const user: UserType = await User.findById(userId);

    if (!user) {
      throw new NotFound("User not found");
    }

    if (user._id.toString() !== id) {
      throw new Unauthenticated("You're not authorized to perform this action");
    }

    const existingImage = await Image.findOne({
      postedBy: user._id,
      _id: imageId,
    });

    if (!existingImage) {
      throw new NotFound("Image not found");
    }

    if (existingImage.postedBy.toString() !== user._id.toString()) {
      throw new Unauthenticated("You're not authorized to update this image");
    }

    const updatedImage = await Image.findOneAndUpdate(
      { _id: imageId },
      { title, altText, tags },
      { new: true }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: updatedImage,
    });
  } catch (err) {
    return next(err);
  }
};

export const deleteImages = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    params: { id, imageId },
  } = req;

  try {
    const user: UserType = await User.findById(userId);

    if (!user) {
      throw new NotFound("User not found");
    }

    if (user._id.toString() !== id) {
      throw new Unauthenticated("You're not authorized to perform this action");
    }

    const imageToDelete = await Image.findById(`${imageId}`);

    if (!imageToDelete) {
      throw new NotFound("Image not found");
    }

    if (imageToDelete.postedBy.toString() !== user._id.toString()) {
      throw new Unauthenticated("You're not authorized to delete this image");
    }

    await Image.deleteOne({ _id: imageId });

    res
      .status(StatusCodes.OK)
      .json({ success: true, data: "Image deleted successfully" });
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

export const updateUserLocale = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    body: { locale },
  } = req;

  try {
    // Validate locale
    if (!locale || !["en", "es"].includes(locale)) {
      throw new BadRequest("Invalid locale. Supported locales: en, es");
    }

    const user: UserType = await User.findById(userId);

    if (!user) {
      throw new NotFound("User not found");
    }

    const updatedUser: UserType = await User.findOneAndUpdate(
      { _id: userId },
      { locale },
      { new: true, runValidators: true }
    )
      .select("-password -verificationToken -passwordVerificationToken")
      .lean();

    if (!updatedUser) {
      throw new NotFound("User not found");
    }

    res.status(StatusCodes.OK).json({
      user: updatedUser,
      msg: "Locale updated successfully",
    });
  } catch (err) {
    return next(err);
  }
};
