import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  onUpload: (file: File) => Promise<{ url: string; key: string }>;
  onSuccess?: (result: { url: string; key: string }) => void;
  maxSize?: number; // in MB
  accept?: string;
  label?: string;
  multiple?: boolean;
}

export function ImageUpload({
  onUpload,
  onSuccess,
  maxSize = 10,
  accept = "image/*",
  label = "Upload Image",
  multiple = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      const result = await onUpload(file);
      toast.success("Image uploaded successfully!");
      onSuccess?.(result);
      setPreview(null);
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      await processFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const file = files[0];
      await processFile(file);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="block"
          disabled={isUploading}
        />

        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg object-cover"
            />
            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPreview(null)}
                disabled={isUploading}
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-blue-500" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Uploading...
                </p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Drag and drop or click to select
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Max size: {maxSize}MB
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label="Upload file"
        />
      </div>
    </div>
  );
}
