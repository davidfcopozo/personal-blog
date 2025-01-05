import { FormEvent, HTMLAttributes, MouseEvent, ReactNode } from "react";
import { ObjectId } from "mongoose";
import { AxiosError } from "axios";
import { LucideIcon } from "lucide-react";
import { PostType, UserType } from "../types";

export interface CustomBadgeProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  uniQueKey: string | number;
  onRemove?: () => void;
  classes?: string;
}

export interface EditorProps {
  value: string;
  onChange: (content: string) => void;
  handleImageUpload: (file: File) => Promise<string>;
}

export interface NewPostLayoutProps {
  children: ReactNode;
  onSave: (e: FormEvent) => void;
}

export interface NewPostHeaderProps {
  onSave: (e: FormEvent) => void;
}
export interface BlogEditorProps {
  initialPost?: {
    title: string;
    content: string;
    featuredImage: string | null;
    categories?: CategoryInterface[];
    tags?: string[];
  } | null;
  slug?: string;
  isPostLoading?: boolean;
}

export interface InitialPost {
  _id?: ObjectId;
  title: string;
  content: string;
  featuredImage: string | null;
  categories?: CategoryInterface[];
  tags?: string[];
}
export interface UseBlogEditorProps {
  initialPost?: InitialPost | null;
  slug?: string | null;
}

export interface FeatureImageProps {
  imageUrl: string | null;
  temporaryFeatureImage: File | null;
  onUpload: (file: File | null) => void;
}

export interface CommentInterface {
  _id: ObjectId;
  postedBy: ObjectId;
  post: ObjectId;
  parentId?: ObjectId;
  content: string;
  replies: string[];
  likes: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  isReply: boolean;
}

export interface ReplyInterface {
  _id: ObjectId;
  postedBy: ObjectId;
  post: ObjectId;
  content: string;
  parentId: string;
  replies: string[];
  likes: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  isReply: boolean;
}

export interface CategoryInterface {
  _id: ObjectId;
  name: String;
  postedBy: ObjectId;
  slug: String;
  topic: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  usageCount: Number;
}

export interface MutationContext<TData> {
  previousData?: TData;
  newData?: TData;
}

export interface UseMutationRequestProps<TData, TVariables> {
  url: string;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (
    error: AxiosError,
    variables: TVariables,
    context: MutationContext<TData> | undefined
  ) => void;
  onMutate?: (variables: TVariables) => Promise<MutationContext<TData>>;
  onSettled?: (
    data: TData | undefined,
    error: AxiosError | null,
    variables: TVariables,
    context: MutationContext<TData> | undefined
  ) => void;
}

export interface CommentEditorProps {
  onSubmit: (newItem: any) => void;
  onCancel?: () => void;
  onChange: (e: string) => void;
  placeholder?: string;
  maxHeight?: number;
  showCancelButton: boolean;
  value: string;
  commentMutationStatus: string;
}

export interface NestedCommentProps {
  comment: CommentInterface;
  post: any;
  level?: number;
  onMaxNestingReached?: () => void;
}

export interface UseBulkFetchProps {
  ids: string[];
  key: string;
  dependantItem?: boolean;
  url: string;
}

export interface EngagementButtonProps {
  icon: LucideIcon;
  count?: number;
  label: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  extraClasses?: string;
  iconStyles?: string;
  activeColor?: string;
  isActivated?: boolean;
  horizontalCount?: boolean;
}

export interface BlogPostProps {
  slug?: string;
  handleLikeClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  handleBookmarkClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  liked?: boolean;
  bookmarked?: boolean;
  amountOfBookmarks?: number;
  amountOfLikes?: number;
  post?: PostType;
}

export interface SocialMediaConfig {
  icon: LucideIcon;
  getUrl: (username: string) => string;
  label: string;
}

export interface AuthorPanelProps {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatar: string;
  bio: string;
  website: string;
  title: string;
  socialMedia: UserType["socialMediaProfiles"];
  handleFollowToggle: () => void;
  isFollowed: boolean;
  isPending: boolean;
}
