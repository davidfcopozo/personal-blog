import { BuiltInProviderType } from "next-auth/providers/index";
import { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { PostInterface } from "../../../../api/src/typings/models/post";
import { UserInterface } from "../../../../api/src/typings/models/user";
import { Date } from "mongoose";
import { CommentInterface } from "../interfaces";

export type UseRefType = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
> | null;

export type BlogPostProps = {
  post: PostInterface & { createdAt?: Date };
  slug: string;
};

export type UsePostRequestType = {
  url: string;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
  onMutate: (data: any) => void;
};

export type ExtractImagesFromContentType = (content: string) => string[];
export type DeleteImageFromFirebaseType = (imageUrl: string) => Promise<void>;

export type UserType = UserInterface;

export type CommentSectionPropsType = {
  comments: string[];
};

export type CommentProps = {
  key: string | number;
  comment: CommentInterface;
};

export type ReplyProps = {
  key: string | number;
  reply: CommentInterface;
};

export type CommentFetchType = {
  data: CommentInterface;
  success: boolean;
};
