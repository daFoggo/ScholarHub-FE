import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  scholarshipMatchingService,
  type IScholarshipMatchingDTO,
  type IScholarshipMatchingResponse,
} from "../services/scholarship-matching";
import { personalKeys } from "@/features/user_profile/hooks/use-personal";
import { toast } from "sonner";

export const scholarshipMatchingKeys = {
  all: ["scholarship-matching"] as const,
  detail: (id: string) => [...scholarshipMatchingKeys.all, id] as const,
};

export const usePostScholarshipMatching = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IScholarshipMatchingDTO) =>
      scholarshipMatchingService.postScholarshipMatching(data),
    onSuccess: (response: IScholarshipMatchingResponse, variables) => {
      queryClient.setQueryData(
        scholarshipMatchingKeys.detail(variables.id),
        response.payload.evaluate
      );

      queryClient.invalidateQueries({
        queryKey: scholarshipMatchingKeys.all,
      });

      // Refresh balance to reflect SPT deduction
      queryClient.invalidateQueries({ queryKey: personalKeys.all });

      // Show success notification with SPT cost
      const message = response.message || "Match analysis completed!";
      toast.success(message);
    },
    onError: (error) => {
      console.error("Error fetching scholarship matching:", error);
    },
  });
};
