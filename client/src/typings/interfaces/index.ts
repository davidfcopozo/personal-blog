import { Editor } from "tinymce";

export interface BlogEditorProps {
  onSave: (
    e: React.FormEvent,
    data: { title: string; content: string }
  ) => void;
}

export interface ExtendedEditor extends Editor {
  dom: any;
  iframeElement: HTMLIFrameElement; // Assuming iframeElement is of type HTMLIFrameElement
  editorUpload: {
    blobCache: {
      create: (id: string, file: File, base64: string) => any;
      add: (blobInfo: any) => void;
    };
  };
}

}
