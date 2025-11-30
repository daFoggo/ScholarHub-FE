import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  IPostScholarshipDTO,
  IUpdateScholarshipDTO,
} from "../services/scholarship-management";
import { scholarshipManagementServices } from "../services/scholarship-management";
import { personalKeys } from "@/features/user_profile/hooks/use-personal";

export const scholarshipManagementKeys = {
  all: ["scholarshipManagement"] as const,
  lists: () => [...scholarshipManagementKeys.all, "list"] as const,
  myList: () => [...scholarshipManagementKeys.lists(), "me"] as const,
  details: () => [...scholarshipManagementKeys.all, "detail"] as const,
  detail: (id: string) => [...scholarshipManagementKeys.details(), id] as const,
};

export const useGetMyScholarships = () => {
  return useQuery({
    queryKey: scholarshipManagementKeys.myList(),
    queryFn: async () => {
      const response = await scholarshipManagementServices.getMyScholarships();
      return response.payload.scholarships;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const useCreateScholarship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IPostScholarshipDTO) =>
      scholarshipManagementServices.createScholarship(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: scholarshipManagementKeys.myList(),
      });
      // Refresh balance and show toast
      queryClient.invalidateQueries({ queryKey: personalKeys.all });

      // Use API message which may include reward amount
      const message = data.message || "Scholarship published! Reward received.";
      toast.success(message + " 🎉");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create scholarship");
    },
  });
};

export const useUpdateScholarship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IUpdateScholarshipDTO) =>
      scholarshipManagementServices.updateScholarship(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: scholarshipManagementKeys.myList(),
      });
      queryClient.invalidateQueries({
        queryKey: scholarshipManagementKeys.detail(variables.id),
      });
      toast.success(data.message || "Scholarship updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update scholarship");
    },
  });
};

export const useDeleteScholarship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      scholarshipManagementServices.deleteScholarship(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: scholarshipManagementKeys.myList(),
      });
      toast.success(data.message || "Scholarship deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete scholarship");
    },
  });
};
