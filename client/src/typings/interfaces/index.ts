export interface BlogEditorProps {
  initialValue: string;
  onSave: (data: { title: string; content: string }) => void;
}
