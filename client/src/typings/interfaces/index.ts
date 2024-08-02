import { FormEvent, HTMLAttributes, ReactNode, RefObject } from "react";
import { Editor } from "tinymce";

export interface BlogEditorProps {
  onSave: (data: { title: string; content: string }) => void;
}

export interface ExtendedEditor extends Editor {
  dom: any;
  iframeElement: HTMLIFrameElement;
  editorUpload: {
    blobCache: {
      create: (id: string, file: File, base64: string) => any;
      add: (blobInfo: any) => void;
    };
  };
}

export interface UseBlogEditorProps {
  title: string;
  content: string;
  currentImages: string[];
  setCurrentImages: (images: string[]) => void;
  editorRef: RefObject<ExtendedEditor>;
  onSave: (data: { title: string; content: string }) => void;
}

export interface CustomBadgeProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  key: string | number;
  onRemove?: () => void;
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
    featureImage: string | null;
    categories?: string[];
    tags?: string[];
  } | null;
}

export interface InitialPost {
  title: string;
  content: string;
  featureImage: string | null;
  categories?: string[];
  tags?: string[];
}

export interface FeatureImageProps {
  imageUrl: string | null;
  temporaryFeatureImage: File | null;
  onUpload: (file: File | null) => void;
}
