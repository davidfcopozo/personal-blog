import { BuiltInProviderType } from "next-auth/providers/index";
import { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { PostInterface } from "../../../../api/src/typings/models/post";
import { Date } from "mongoose";

export type UseRefType = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
> | null;

export type BlogPostProps = {
  post: PostInterface & { createdAt?: Date };
};
