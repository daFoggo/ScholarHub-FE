import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  achievementService,
  type IAchievementDTO,
} from "../services/achievement-service";
import type { IAchievement } from "../utils/types";

export const achievementKeys = {
  all: ["achievement"] as const,
  lists: () => [...achievementKeys.all, "list"] as const,
  list: () => [...achievementKeys.lists(), "list"] as const,
  details: () => [...achievementKeys.all, "detail"] as const,
  detail: (id: string) => [...achievementKeys.details(), id] as const,
};

export const useGetAchievement = () => {
  return useQuery({
    queryKey: achievementKeys.list(),
    queryFn: async () => {
      const response = await achievementService.getAchievement();
      return response.payload;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const usePostAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IAchievementDTO) =>
      achievementService.postAchievement(data),
    onSuccess: (newScholarship) => {
      // Update the cache with the new scholarship data
      queryClient.setQueryData(
        achievementKeys.detail(newScholarship.payload[0]?.id || ""),
        newScholarship
      );

      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: achievementKeys.lists(),
      });
    },
  });
};

export const usePutAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IAchievement) => achievementService.putAchievement(data),
    onSuccess: (newScholarship) => {
      // Update the cache with the new scholarship data
      queryClient.setQueryData(
        achievementKeys.detail(newScholarship.payload[0]?.id || ""),
        newScholarship
      );

      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: achievementKeys.lists(),
      });
    },
  });
};

export const useDeleteAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => achievementService.deleteAchievement(id),
    onSuccess: () => {
      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: achievementKeys.lists(),
      });
    },
  });
};
