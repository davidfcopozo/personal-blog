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
}
