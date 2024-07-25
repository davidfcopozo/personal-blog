import { FormEvent } from "react";
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
  editorRef: React.RefObject<ExtendedEditor>;
  onSave: (data: { title: string; content: string }) => void;
}

export interface CustomBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
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
  children: React.ReactNode;
  onSave: (e: React.FormEvent) => void;
}

export interface NewPostHeaderProps {
  onSave: (e: FormEvent) => void;
}
