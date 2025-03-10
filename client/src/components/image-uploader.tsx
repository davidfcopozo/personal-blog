import { AlertCircle, Upload, X } from "lucide-react";
import { useState, useCallback, useRef } from "react";
/* import { useDropzone } from "react-dropzone"; */
import { Button } from "./ui/button";
import { ImageFile, UploadProgress } from "@/typings/interfaces";

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  /*  children: React.ReactNode; */
}

export function ImageUploader({
  onUpload /* , children */,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  /*   const [images, setImages] = useState<ImageFile[]>([]); */
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // const processFile = useCallback((file: File) => {
  //   const id = Math.random().toString(36).substring(7);
  //   // Validate file type
  //   const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  //   if (!allowedTypes.includes(file.type)) {
  //     setUploads((prev) => [
  //       ...prev,
  //       {
  //         id,
  //         progress: 0,
  //         status: "error",
  //         error: "Invalid file type",
  //       },
  //     ]);
  //     return;
  //   }

  //   // Validate file size (5MB limit)
  //   if (file.size > 5 * 1024 * 1024) {
  //     setUploads((prev) => [
  //       ...prev,
  //       {
  //         id,
  //         progress: 0,
  //         status: "error",
  //         error: "File too large (max 5MB)",
  //       },
  //     ]);
  //     return;
  //   }

  //   // Simulate upload progress
  //   setUploads((prev) => [...prev, { id, progress: 0, status: "uploading" }]);

  //   const img = new Image();
  //   const objectUrl = URL.createObjectURL(file);

  //   img.onload = () => {
  //     // Simulate upload with progress
  //     let progress = 0;
  //     const interval = setInterval(() => {
  //       progress += 10;
  //       setUploads((prev) =>
  //         prev.map((u) => (u.id === id ? { ...u, progress } : u))
  //       );

  //       if (progress >= 100) {
  //         clearInterval(interval);
  //         setUploads((prev) =>
  //           prev.map((u) => (u.id === id ? { ...u, status: "success" } : u))
  //         );

  //         setImages((prev) => [
  //           ...prev,
  //           {
  //             id,
  //             url: objectUrl,
  //             name: file.name,
  //             size: file.size,
  //             type: file.type,
  //             dimensions: {
  //               width: img.width,
  //               height: img.height,
  //             },
  //             uploadedAt: new Date(),
  //             title: file.name.split(".")[0], // Default title from filename
  //             altText: "", // Empty alt text by default
  //             tags: [], // Empty tags array by default
  //           },
  //         ]);
  //       }
  //     }, 200);
  //   };

  //   img.src = objectUrl;
  // }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      Array.from(e.dataTransfer.files).forEach((file) => onUpload([file]));
    },
    [onUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        Array.from(e.target.files).forEach((file) => onUpload([file]));
      }
    },
    [onUpload]
  );

  const handleDelete = useCallback(
    (image: ImageFile) => {
      // Since onUpload only accepts File[], we should emit an empty array for deletion
      onUpload([]);
      if (selectedImage?.id === image.id) {
        setSelectedImage(null);
      }
    },
    [selectedImage, onUpload]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const copyImageUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <div>
      {/* 
      {isOpen && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center transition-colors relative
        ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        ${
          uploads.some((u) => u.status === "uploading")
            ? "opacity-50 pointer-events-none"
            : ""
        }
        `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Button
            variant={"ghost"}
            onClick={onClick}
            className="absolute top-2 right-2"
          >
            <X className="h-6 w-6" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg mb-2">Drag and drop your images here</p>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Choose Files
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Supported formats: JPG, PNG, GIF (max 5MB)
          </p>
        </div>
      )} */}
      {/* {children} */}
      {/* Upload progress */}
      {uploads
        .filter((u) => u.status === "uploading" || u.status === "error")
        .map((upload) => (
          <div key={upload.id} className="mb-4 bg-gray-50 rounded-lg p-4">
            {upload.status === "uploading" ? (
              <div>
                <div className="flex justify-between mb-2">
                  <span>Uploading...</span>
                  <span>{upload.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center text-red-500">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{upload.error}</span>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
