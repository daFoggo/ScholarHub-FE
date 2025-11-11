import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  experienceService,
  type IExperienceDTO,
} from "../services/experience-service";
import type { IExperience } from "../utils/types";

export const experienceKeys = {
  all: ["experience"] as const,
  lists: () => [...experienceKeys.all, "list"] as const,
  list: () => [...experienceKeys.lists(), "list"] as const,
  details: () => [...experienceKeys.all, "detail"] as const,
  detail: (id: string) => [...experienceKeys.details(), id] as const,
};

export const useGetExperience = () => {
  return useQuery({
    queryKey: experienceKeys.list(),
    queryFn: async () => {
      const response = await experienceService.getExperience();
      return response.payload;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const usePostExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IExperienceDTO) =>
      experienceService.postExperience(data),
    onSuccess: (newScholarship) => {
      // Update the cache with the new scholarship data
      queryClient.setQueryData(
        experienceKeys.detail(newScholarship.payload[0]?.id || ""),
        newScholarship
      );

      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: experienceKeys.lists(),
      });
    },
  });
};

export const usePutExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IExperience) => experienceService.putExperience(data),
    onSuccess: (newScholarship) => {
      // Update the cache with the new scholarship data
      queryClient.setQueryData(
        experienceKeys.detail(newScholarship.payload[0]?.id || ""),
        newScholarship
      );

      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: experienceKeys.lists(),
      });
    },
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => experienceService.deleteExperience(id),
    onSuccess: () => {
      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: experienceKeys.lists(),
      });
    },
  });
};
