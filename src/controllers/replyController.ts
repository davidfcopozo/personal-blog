const Comment = require("../models/commentModel");
const Reply = require("../models/ReplyModel");
const Post = require("../models/PostModel");

import { NextFunction, Response } from "express";
import { IRequestWithUserInfo } from "../interfaces/models/user";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../errors/not-found";
import { BadRequest } from "../errors/bad-request";

const createReply = async (
  req: IRequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    params: { id: postId },
    body: { commentId },
  } = req;

  try {
    const post = await Post.findById(postId);
    const comment = await Comment.findOne({
      _id: commentId,
      postedBy: userId,
    });

    if (!post) {
      throw new NotFound("The post you're trying to comment on does not exist");
    }

    const comments = post?.comments;
    const replies = comment?.replies;

    if (!comments) {
      throw new NotFound("No comments on this post yet");
    }

    if (!replies) {
      throw new NotFound("No replies on this comment yet");
    }

    if (!post?._id.equals(comment?.post)) {
      throw new BadRequest("Something went wrong");
    }

    const reply = await Reply.create({
      ...req.body,
      postedBy: userId,
      commentId: commentId,
    });

    if (!reply) {
      throw new BadRequest("Something went wrong");
    }

    const result = await Comment.updateOne(
      { _id: comment._id },
      {
        $addToSet: { replies: reply._id },
      },
      { new: true }
    );

    if (result?.modifiedCount === 1) {
      res.status(StatusCodes.CREATED).json({ success: true, data: reply });
    }
  } catch (error) {
    next(error);
  }
};

const getReplies = async (
  req: IRequestWithUserInfo,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { postId, commentId },
  } = req;

  try {
    /*   await Reply.deleteMany();
    await Comment.deleteMany(); */
    const comment = await Comment.findById(commentId);
    const post = await Post.findById(postId);

    if (!post?._id.equals(comment?.post)) {
      throw new BadRequest("Something went wrong");
    }

    if (!comment) {
      throw new NotFound("This comment doesn't exist or has been deleted.");
    }

    const replies = comment?.replies;

    if (!replies) {
      throw new NotFound("No replies on this comment yet");
    }

    res.status(StatusCodes.OK).json({ success: true, data: replies });
  } catch (error) {
    next(error);
  }
};

// const getAReply = async (
//   req: IRequestWithUserInfo,
//   res: Response,
//   next: NextFunction
// ) => {
//   const {
//     body: { replyId },
//   } = req;

//   try {
//     const reply = await Reply.findById(replyId);

//     if (!reply) {
//       throw new NotFound("No comments found");
//     }

//     res.status(StatusCodes.OK).json({ success: true, data: reply });
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteReply = async (
//   req: IRequestWithUserInfo,
//   res: Response,
//   next: NextFunction
// ) => {
//   const {
//     body: { commentId, replyId },
//     params: { id: postId },
//     user: { userId },
//   } = req;

//   try {
//     const post = await Reply.findById(postId);
//     const comment = await Comment.findOne({
//       _id: commentId,
//       postedBy: userId,
//     });

//     if (!comment) {
//       throw new NotFound("No comments found");
//     }

//     if (!post?._id.equals(comment?.post)) {
//       throw new BadRequest("Something went wrong");
//     }

//     // Remove comment from the post's comment's array property
//     const result = await Reply.updateOne(
//       { _id: comment._id },
//       { $pull: { replies: `${commentId}` } },
//       { new: true }
//     );

//     //If the comment id has been removed from the post's comment array, also remove it from the comment document
//     if (result.modifiedCount === 1) {
//       await comment.deleteOne();
//       res
//         .status(StatusCodes.OK)
//         .json({ success: true, msg: "Comment has been successfully deleted." });
//     } else {
//       throw new BadRequest("Something went wrong, please try again!");
//     }
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  createReply,
  getReplies,
  /*  
  getAReply,
  deleteReply, */
};
