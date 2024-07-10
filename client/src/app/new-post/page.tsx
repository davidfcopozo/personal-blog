  const [content, setContent] = useState("");

  const handleContentChange = (data: { title: string; content: string }) => {
    try {
      setContent(data.content);
    } catch (error) {
      console.error("Failed to auto-save:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting blog post with content:", content);
  };

