"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateYouTubeUrl } from "@/utils/blog-editor";

interface VideoInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertVideo: (url: string) => void;
}

export function VideoInsertModal({
  isOpen,
  onClose,
  onInsertVideo,
}: VideoInsertModalProps) {
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [previewId, setPreviewId] = useState("");

  const extractVideoId = (url: string): string => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /m\.youtube\.com\/watch\?v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return "";
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling to parent form

    if (!videoUrl.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    if (!validateYouTubeUrl(videoUrl)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    onInsertVideo(videoUrl);
    handleClose();
  };

  const handleClose = () => {
    setVideoUrl("");
    setError("");
    setPreviewId("");
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    
    if (error) {
      setError("");
    }

    // Update preview if valid URL
    if (validateYouTubeUrl(url)) {
      const videoId = extractVideoId(url);
      setPreviewId(videoId);
    } else {
      setPreviewId("");
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        onPointerDownOutside={(e) => e.stopPropagation()}
        onInteractOutside={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Insert YouTube Video</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="videoUrl">YouTube URL</Label>
              <Input
                id="videoUrl"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={handleInputChange}
                className={error ? "border-destructive" : ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                  }
                }}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div><div className="text-sm text-muted-foreground">
              <p>Supported formats:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
                <li>https://youtu.be/VIDEO_ID</li>
                <li>https://www.youtube.com/embed/VIDEO_ID</li>
              </ul>
            </div>
            
            {/* Video Preview */}
            {previewId && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                  <iframe
                    src={`https://www.youtube.com/embed/${previewId}`}
                    title="Video Preview"
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Insert Video</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
