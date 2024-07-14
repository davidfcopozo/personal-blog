export interface BlogEditorProps {
  onSave: (
    e: React.FormEvent,
    data: { title: string; content: string }
  ) => void;
}
