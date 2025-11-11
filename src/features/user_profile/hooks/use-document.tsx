import { uploadService } from "@/features/community/services/upload";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { documentService } from "../services/document-service";
import type { IDocument } from "../utils/types";

export const documentSchema = z.object({
  id: z.string(),
  type: z.enum(["resume", "cover_letter", "other"]),
  file_name: z.string().optional(),
  file_path: z.string().optional(),
  uploaded_at: z.string().optional(),
});

export type DocumentFormValues = z.infer<typeof documentSchema>;

// Hook để lấy documents
export const useGetDocuments = () => {
  return useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const response = await documentService.getDocuments();
      if (response.success) {
        return response.payload || [];
      }
      throw new Error(response.message);
    },
  });
};

// Hook để tạo document
export const usePostDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      type: "resume" | "cover_letter" | "other";
      file_path: string;
      file_name?: string;
    }) => {
      const response = await documentService.createDocument(data);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Create document successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Create document failed!");
    },
  });
};

// Hook để cập nhật document
export const usePutDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      type?: "resume" | "cover_letter" | "other";
      file_path?: string;
      file_name?: string;
    }) => {
      const response = await documentService.updateDocument(data);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Cập nhật tài liệu thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Cập nhật tài liệu thất bại!");
    },
  });
};

// Hook để xóa document
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await documentService.deleteDocument(id);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Xóa tài liệu thành công!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Xóa tài liệu thất bại!");
    },
  });
};

// Hook để upload file
export const useUploadDocument = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const response = await uploadService.uploadFile(file);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.payload;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Upload file thất bại!");
    },
  });
};

// Form hook với upload integration
export function useDocumentForm(
  onSubmit: (values: IDocument) => void,
  onCancel: () => void,
  initialValues?: IDocument
) {
  const [documentFiles, setDocumentFiles] = useState<File[]>();
  const uploadDocumentMutation = useUploadDocument();

  const form = useForm<DocumentFormValues>({
    defaultValues: initialValues || {
      id: crypto.randomUUID(),
      type: "resume",
      file_name: "",
      file_path: "",
      uploaded_at: new Date().toISOString(),
    },
  });

  const handleDocumentFileChange = (files: File[]) => {
    setDocumentFiles(files);
    if (files.length > 0) {
      const file = files[0];
      form.setValue("file_name", file.name);
    }
  };

  const resetForm = () => {
    form.reset({
      id: crypto.randomUUID(),
      type: "resume",
      file_name: "",
      file_path: "",
      uploaded_at: new Date().toISOString(),
    });
    setDocumentFiles(undefined);
    onCancel();
  };

  const submitForm = async (values: DocumentFormValues) => {
    try {
      // Upload file trước nếu có
      if (documentFiles && documentFiles.length > 0) {
        const uploadResult = await uploadDocumentMutation.mutateAsync(
          documentFiles[0]
        );
        values.file_path = uploadResult.file_url;
        values.file_name = uploadResult.file_name;
      }

      onSubmit(values as IDocument);
      resetForm();
    } catch (error) {
      console.error("Submit form error:", error);
    }
  };

  return {
    form,
    documentFiles,
    handleDocumentFileChange,
    resetForm,
    submitForm,
    isUploading: uploadDocumentMutation.isPending,
  };
}
