import { FormEvent, HTMLAttributes, ReactNode } from "react";
import { ObjectId } from "mongoose";

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
    categories?: ObjectId[];
    tags?: string[];
  } | null;
  slug?: string;
}

export interface InitialPost {
  title: string;
  content: string;
  featuredImage: string | null;
  categories?: ObjectId[];
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
  content: string;
  replies: string[];
  likes: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
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
