import { BuiltInProviderType } from "next-auth/providers/index";
import { ClientSafeProvider, LiteralUnion } from "next-auth/react";

export type UseRefType = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
> | null;
