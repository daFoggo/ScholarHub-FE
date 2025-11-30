import { useRef, useState } from "react";
import { useCreatePost } from "./use-community";
import { useUploadMultipleFiles } from "./use-upload-file";
import type { IAttachments } from "../utils/types";
import { personalKeys } from "@/features/user_profile/hooks/use-personal";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePostCreator = (onCreatePost?: (post: any) => void) => {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<IAttachments>({
    images: [],
    videos: [],
    files: [],
  });

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPostMutation = useCreatePost();
  const uploadMutation = useUploadMultipleFiles();

  const handleFileUpload = async (
    files: FileList | null,
    type: "image" | "video" | "file"
  ) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    try {
      const results = await uploadMutation.mutateAsync(fileArray);
      const urls = results.map((result) => result.payload.file_url);

      setAttachments((prev) => ({
        ...prev,
        [type === "image" ? "images" : type === "video" ? "videos" : "files"]: [
          ...prev[
            type === "image" ? "images" : type === "video" ? "videos" : "files"
          ],
          ...urls,
        ],
      }));
    } catch (error) {
      alert(`Upload failed: ${error}`);
    }
  };

  const removeAttachment = (
    url: string,
    type: "images" | "videos" | "files"
  ) => {
    setAttachments((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item !== url),
    }));
  };

  const resetForm = () => {
    setContent("");
    setAttachments({ images: [], videos: [], files: [] });
  };

  const handleSubmit = async () => {
    if (
      !content.trim() &&
      attachments.images.length === 0 &&
      attachments.videos.length === 0 &&
      attachments.files.length === 0
    ) {
      return;
    }

    const postData = {
      content: content.trim(),
      image: attachments.images[0] || undefined,
      video: attachments.videos[0] || undefined,
      files: attachments.files.length > 0 ? attachments.files : undefined,
      post_type: "general" as const,
      tags: [],
    };

    try {
      const response = await createPostMutation.mutateAsync(postData);
      resetForm();
      onCreatePost?.(response.payload.post);

      // Refresh balance and show toast
      queryClient.invalidateQueries({ queryKey: personalKeys.all });

      const message = response.message || "Post created! Reward received.";
      toast.success(message);
    } catch (error) {
      alert("Failed to create post");
    }
  };

  const triggerImageUpload = () => imageInputRef.current?.click();
  const triggerVideoUpload = () => videoInputRef.current?.click();
  const triggerFileUpload = () => fileInputRef.current?.click();

  const isDisabled =
    (!content.trim() &&
      attachments.images.length === 0 &&
      attachments.videos.length === 0 &&
      attachments.files.length === 0) ||
    createPostMutation.isPending ||
    uploadMutation.isPending;

  const getButtonText = () => {
    if (createPostMutation.isPending) return "Posting...";
    if (uploadMutation.isPending) return "Uploading...";
    return "Post";
  };

  const isUploading = uploadMutation.isPending;
  const isCreating = createPostMutation.isPending;

  return {
    content,
    setContent,
    attachments,

    imageInputRef,
    videoInputRef,
    fileInputRef,

    handleFileUpload,
    removeAttachment,
    handleSubmit,
    triggerImageUpload,
    triggerVideoUpload,
    triggerFileUpload,
    resetForm,

    isDisabled,
    isUploading,
    isCreating,
    getButtonText,
  };
};
