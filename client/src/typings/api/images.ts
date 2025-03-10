import { ImageInterface } from "../interfaces";

export interface ImageUploadResponse {
  success: boolean;
  data: ImageInterface;
  message?: string;
}

export interface ImageDeleteResponse {
  success: boolean;
  message: string;
}

export interface ImageUpdateResponse {
  success: boolean;
  data: ImageInterface;
}

export interface ImagesListResponse {
  success: boolean;
  data: ImageInterface[];
}

export interface ImageUploadPayload {
  images: Omit<ImageInterface, "id"> & { hash: string };
}

export interface ImageDeletePayload {
  imageId: string;
}

export interface ImageUpdatePayload {
  imageId: string;
  updates: Partial<ImageInterface>;
}
