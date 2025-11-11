import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  educationService,
  type IEducationDTO,
} from "../services/education-service";
import type { IEducation } from "../utils/types";

export const educationKeys = {
  all: ["education"] as const,
  lists: () => [...educationKeys.all, "list"] as const,
  list: () => [...educationKeys.lists(), "list"] as const,
  details: () => [...educationKeys.all, "detail"] as const,
  detail: (id: string) => [...educationKeys.details(), id] as const,
};

export const useGetEducation = () => {
  return useQuery({
    queryKey: educationKeys.list(),
    queryFn: async () => {
      const response = await educationService.getEducation();
      return response.payload;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const usePostEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IEducationDTO) => educationService.postEducation(data),
    onSuccess: (newScholarship) => {
      // Update the cache with the new scholarship data
      queryClient.setQueryData(
        educationKeys.detail(newScholarship.payload[0]?.id || ""),
        newScholarship
      );

      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: educationKeys.lists(),
      });
    },
  });
};

export const usePutEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IEducation) => educationService.putEducation(data),
    onSuccess: (newScholarship) => {
      // Update the cache with the new scholarship data
      queryClient.setQueryData(
        educationKeys.detail(newScholarship.payload[0]?.id || ""),
        newScholarship
      );

      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: educationKeys.lists(),
      });
    },
  });
};

export const useDeleteEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => educationService.deleteEducation(id),
    onSuccess: () => {
      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: educationKeys.lists(),
      });
    },
  });
};
