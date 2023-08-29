import Comment from "../models/commentModel";
import Post from "../models/postModel";

import { NextFunction, Response } from "express";
import { RequestWithUserInfo } from "../typings/models/user";
import { StatusCodes } from "http-status-codes";
import { BadRequest, NotFound } from "../errors/index";
import { PostType, CommentType } from "../typings/types";

export const createReply = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    user: { userId },
    params: { id: postId },
    body: { commentId },
  } = req;

  try {
    const post: PostType = await Post.findById(postId);
    const comment: CommentType = await Comment.findById(commentId);

    if (!post) {
      throw new NotFound("The post you're trying to comment on does not exist");
    }

    const comments = post?.comments;

    if (!comments) {
      throw new NotFound("No comments on this post yet");
    }

    if (!post?._id.equals(`${comment?.post}`)) {
      throw new BadRequest("Something went wrong");
    }

    const reply = await Comment.create({
      ...req.body,
      postedBy: userId,
      post: postId,
    });

    if (!reply) {
      throw new BadRequest("Something went wrong");
    }

    const result = await Comment.updateOne(
      { _id: comment?._id },
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

export const getReplies = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { postId, commentId },
  } = req;

  try {
    /*   await Reply.deleteMany();
    await Comment.deleteMany(); */
    const comment: CommentType = await Comment.findById(commentId);
    const post: PostType = await Post.findById(postId);

    if (!post?._id.equals(`${comment?.post}`)) {
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

export const getReplyById = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { commentId, replyId },
    params: { id: postId },
  } = req;

  try {
    const comment: CommentType = await Comment.findById(commentId);
    const post: PostType = await Post.findById(postId);

    //Check if the comment this reply belong to exist
    if (!comment) {
      throw new NotFound("This comment doesn't exist or has been deleted.");
    }

    //Get the reply by filtering comment's replies
    const commentReply = comment.replies?.filter((reply) =>
      reply.equals(replyId)
    );

    //Make sure to get the comments and replies of the posts they belong to
    if (!post?._id.equals(comment?.post)) {
      throw new BadRequest("Something went wrong");
    }

    //Check if the given reply exist
    if (!commentReply?.length) {
      throw new NotFound("This comment does not exist or has been deleted");
    }

    //Get the given reply
    const reply = await Comment.findById(commentReply);

    //Check if the given reply exist within the comments
    if (!reply) {
      throw new NotFound("This comment doesn't exist or has been deleted.");
    }

    res.status(StatusCodes.OK).json({ success: true, data: reply });
  } catch (error) {
    next(error);
  }
};

export const deleteReplyById = async (
  req: RequestWithUserInfo | any,
  res: Response,
  next: NextFunction
) => {
  const {
    body: { commentId, replyId },
    params: { id: postId },
    user: { userId },
  } = req;

  try {
    const post: PostType = await Post.findById(postId);
    const comment: CommentType = await Comment.findOne({
      _id: commentId,
      postedBy: userId,
    });

    if (!comment) {
      throw new NotFound("his comment doesn't exist or has been deleted.");
    }

    //Get the reply by filtering comment's replies
    const commentReply = comment.replies?.filter((reply) =>
      reply.equals(replyId)
    );

    //Make sure to get the comments and replies of the posts they belong to
    if (!post?._id.equals(comment?.post)) {
      throw new BadRequest("Something went wrong");
    }

    //Check if the given reply exist
    if (!commentReply?.length) {
      throw new NotFound("This comment does not exist or has been deleted");
    }

    // Remove comment from the comment's replies array property
    const result = await Comment.updateOne(
      { _id: comment._id },
      { $pull: { replies: `${commentReply}` } },
      { new: true }
    );

    //If the comment id has been removed from the comment's replies array, also remove it from the comment collection
    if (result.modifiedCount === 1) {
      await Comment.deleteOne({
        _id: replyId,
        postedBy: userId,
      });
      res
        .status(StatusCodes.OK)
        .json({ success: true, msg: "Comment has been successfully deleted." });
    } else {
      throw new BadRequest("Something went wrong, please try again!");
    }
  } catch (error) {
    next(error);
  }
};
