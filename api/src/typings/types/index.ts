import { CommentInterface } from "../models/comment";
import { PostInterface } from "../models/post";
import { UserInterface } from "../models/user";

export type FieldsToUpdateType = { [key: string]: string };
export type UserType = UserInterface | null;
export type PostType = PostInterface | null;
export type CommentType = CommentInterface | null;
