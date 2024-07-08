import { BuiltInProviderType } from "next-auth/providers/index";
import { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { PostInterface } from "../../../../api/src/typings/models/post";
import { Date, ObjectId } from "mongoose";
import { UserInterface } from "../../../../api/src/typings/models/user";

export type UseRefType = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
> | null;

export type BlogPostProps = {
  post: PostInterface & { createdAt?: Date };
};
