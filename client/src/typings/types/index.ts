import { BuiltInProviderType } from "next-auth/providers/index";
import { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { PostInterface } from "../../../../api/src/typings/models/post";
import { UserInterface } from "../../../../api/src/typings/models/user";
import { TopicInterface } from "../../../../api/src/typings/models/topic";
import { CategoryInterface } from "../../../../api/src/typings/models/category";
import { Date, ObjectId } from "mongoose";
import { CommentInterface } from "../interfaces";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";

export type UseRefType = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
> | null;

export type BlogPostCardProps = {
  post: PostType;
  slug?: string;
  key: string | number;
};

export type UsePostRequestType = {
  url: string;
  onSuccess: (data: any, variables?: any, context?: any) => void;
  onError: (error: any, variables?: any, context?: any) => void;
  onMutate: (data: any, variables?: any, context?: any) => void;
};

export type ExtractImagesFromContentType = (content: string) => string[];
export type DeleteImageFromFirebaseType = (imageUrl: string) => Promise<void>;

export type UserType = UserInterface;

export type PostType = Omit<PostInterface, "postedBy" | "comments"> & {
  postedBy: UserType;
  comments?: string[];
  createdAt?: Date;
};

export type CategoryType = CategoryInterface;

export type CommentSectionPropsType = {
  comments: string[];
  post: PostType;
};

export type CommentProps = {
  key: string | number;
  comment: CommentInterface;
  post: PostType;
};

export type ReplyProps = {
  key: string | number;
  reply: CommentInterface;
  commentId: string;
};

export type CommentFetchType = {
  data: CommentInterface;
  success: boolean;
};

export type AuthContextType = {
  currentUser: any | null;
  isLoading: boolean;
  isUserFetching: boolean;
  isUserLoading: boolean;
  isUserPending: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  socialLogin: (provider: "github" | "google") => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, Error>>;
};

export type PersonalInfoFormProps = {
  currentUser: UserType;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  bio: string;
  setBio: (value: string) => void;
};

export type SocialsFormProps = {
  currentUser: UserType;
  website: string;
  setWebsite: (value: string) => void;
  twitterHandle: string;
  setTwitterHandle: (value: string) => void;
  instagramHandle: string;
  setInstagramHandle: (value: string) => void;
  githubHandle: string;
  setGithubHandle: (value: string) => void;
  linkedinHandle: string;
  setLinkedinHandle: (value: string) => void;
  dribbleHandle: string;
  setDribbleHandle: (value: string) => void;
};

export type InterestFormProps = {
  interests: SingleInterestType[];
  setInterests: Dispatch<SetStateAction<SingleInterestType[]>>;
};

export type SkillsFormProps = {
  skills: SingleSkillType[];
  setSkills: Dispatch<SetStateAction<CategoryInterface[]>>;
};

export type SingleInterestType = TopicInterface;
export type SingleSkillType = CategoryInterface;

export type InputFieldsProps = Omit<
  Partial<UserType>,
  "technologies" | "topicsOfInterest"
> & {
  interests: SingleInterestType[];
  skills: SingleSkillType[];
};

export type IconProps = {
  h?: string;
  w?: string;
  fill?: string;
  stroke?: string;
  classes?: string;
};

export type CategoriesProps = {
  setCategories: Dispatch<SetStateAction<ObjectId[]>>;
  categories: ObjectId[] | [];
};

export type TagsProps = {
  setTags: Dispatch<SetStateAction<string[]>>;
  tags: string[] | [];
};

export type UpdatePostPayload = Partial<PostType>;

export type PostFetchType = {
  data: PostInterface[];
  success: boolean;
  count: number;
};

export type UserFetchType = {
  data: UserType;
  success: boolean;
};
