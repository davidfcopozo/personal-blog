import { FormEvent, HTMLAttributes, MouseEvent, ReactNode } from "react";
import { AxiosError } from "axios";
import { LucideIcon } from "lucide-react";
import { PostType, UserType } from "../types";

export interface BaseDocument {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInterface extends BaseDocument {
  name: String;
  postedBy: string;
  slug: String;
  topic: string;
  usageCount: Number;
}

export interface SocialMediaProfilesInterface {
  x?: string;
  instagram?: string;
  github?: string;
  linkedIn?: string;
  dribble?: string;
}

export interface PostInterface extends BaseDocument {
  _id: string;
  title: string;
  content: string;
  slug: string;
  postedBy: string;
  featuredImage?: string;
  likes?: string[];
  bookmarks?: string[];
  tags?: string[];
  categories?: CategoryInterface[];
  visits?: number;
  comments?: string[];
  status: "draft" | "published" | "unpublished";
}

export interface TopicInterface extends BaseDocument {
  name: String;
  postedBy: string;
  description: String;
}

export interface UserInterface extends BaseDocument {
  firstName: String;
  lastName: String;
  email: String;
  password: String;
  username: String;
  website?: String;
  bio?: String;
  title?: String;
  role: String;
  verificationToken?: String;
  verified?: Boolean;
  verifiedAt?: Date;
  accessToken: String | null;
  passwordVerificationToken: String | null;
  passwordTokenExpirationDate: Date | null;
  bookmarks?: string[];
  likes?: string[];
  avatar?: String;
  provider: String;
  topicsOfInterest?: TopicInterface[];
  technologies?: CategoryInterface[];
  socialMediaProfiles?: SocialMediaProfilesInterface;
  isOnboarded: Boolean;
  following?: string[];
  followers?: string[];
}

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
  _id?: string;
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
  _id: string;
  postedBy: string;
  post: string;
  parentId?: string;
  content: string;
  replies: string[];
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
  isReply: boolean;
}

export interface ReplyInterface {
  _id: string;
  postedBy: string;
  post: string;
  content: string;
  parentId: string;
  replies: string[];
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
  isReply: boolean;
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
  _id: string;
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
