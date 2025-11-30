import { useState } from "react";
import type { IComment } from "../utils/types";
import { useCreateComment, useToggleCommentReaction } from "./use-comment";
import { personalKeys } from "@/features/user_profile/hooks/use-personal";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCommentForm = (postId: string) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const createCommentMutation = useCreateComment();
  const toggleReactionMutation = useToggleCommentReaction();

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await createCommentMutation.mutateAsync({
        postId,
        data: { content: newComment },
      });
      setNewComment("");

      // Refresh balance and show toast
      queryClient.invalidateQueries({ queryKey: personalKeys.all });

      const message = response.message || "Comment added! Reward received.";
      toast.success(message);
    } catch (err) {
      console.error("Error creating comment:", err);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      await toggleReactionMutation.mutateAsync({
        postId,
        commentId,
        reactionType: "like",
      });
    } catch (err) {
      console.error("Error liking comment:", err);
      throw err;
    }
  };

  const handleReply = (comment: IComment) => {
    setReplyingTo(comment.id);
    setReplyContent(`@${comment.author?.name} `);
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !replyingTo) return;

    try {
      const response = await createCommentMutation.mutateAsync({
        postId,
        data: {
          content: replyContent,
          parent_id: replyingTo,
        },
      });
      setReplyContent("");
      setReplyingTo(null);

      // Refresh balance and show toast
      queryClient.invalidateQueries({ queryKey: personalKeys.all });

      const message = response.message || "Reply added! Reward received.";
      toast.success(message);
    } catch (err) {
      console.error("Error creating reply:", err);
      throw err;
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyContent("");
  };

  const handleCommentKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const handleReplyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitReply();
    }
    if (e.key === "Escape") {
      handleCancelReply();
    }
  };

  const resetForm = () => {
    setNewComment("");
    setReplyContent("");
    setReplyingTo(null);
  };

  return {
    newComment,
    setNewComment,
    replyingTo,
    replyContent,
    setReplyContent,

    createCommentMutation,
    toggleReactionMutation,

    handleAddComment,
    handleLikeComment,
    handleReply,
    handleSubmitReply,
    handleCancelReply,
    handleCommentKeyDown,
    handleReplyKeyDown,

    resetForm,

    isCreatingComment: createCommentMutation.isPending,
    isTogglingReaction: toggleReactionMutation.isPending,
    canSubmitComment:
      newComment.trim().length > 0 && !createCommentMutation.isPending,
    canSubmitReply:
      replyContent.trim().length > 0 && !createCommentMutation.isPending,
  };
};
