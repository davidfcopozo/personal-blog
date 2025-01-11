import { BuiltInProviderType } from "next-auth/providers/index";
import { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { PostInterface } from "../../../../api/src/typings/models/post";
import { UserInterface } from "../../../../api/src/typings/models/user";
import { TopicInterface } from "../../../../api/src/typings/models/topic";
import { CategoryInterface } from "../../../../api/src/typings/models/category";
import { Date } from "mongoose";
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

export interface SocialMediaProfiles {
  x?: string;
  instagram?: string;
  github?: string;
  linkedIn?: string;
  dribble?: string;
}

export type UserType = Omit<UserInterface, "socialMediaProfiles"> & {
  socialMediaProfiles: SocialMediaProfiles;
};

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
  formData: InputFieldsProps;
  handleFieldChange: (field: keyof InputFieldsProps, value: any) => void;
  isPending: boolean;
};

export type SocialsFormProps = {
  formData: InputFieldsProps;
  handleSocialMediaChange: (
    platform: keyof UserType["socialMediaProfiles"],
    value: string
  ) => void;
  handleFieldChange: (field: keyof InputFieldsProps, value: any) => void;
};

export type SkillsInterestsProps<T> = {
  items: T[];
  setItems: Dispatch<SetStateAction<T[]>>;
  label: string;
  placeholder: string;
  fetchUrl: string;
};

export type SingleInterestType = TopicInterface;
export type SingleSkillType = CategoryInterface;

export type InputFieldsProps = Omit<
  Partial<UserType>,
  "technologies" | "topicsOfInterest"
> & {
  skills: SingleSkillType[];
  interests: SingleInterestType[];
};

export type IconProps = {
  h?: string;
  w?: string;
  fill?: string;
  stroke?: string;
  classes?: string;
};

export type CategoriesProps = {
  setCategories: Dispatch<SetStateAction<CategoryInterface[]>>;
  categories: CategoryInterface[] | [];
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
