import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  publicationService,
  type IPublicationDTO,
} from "../services/publication-service";
import type { IPublication } from "../utils/types";

export const publicationKeys = {
  all: ["publication"] as const,
  lists: () => [...publicationKeys.all, "list"] as const,
  details: () => [...publicationKeys.all, "detail"] as const,
  detail: (id: string) => [...publicationKeys.details(), id] as const,
};

export const useGetPublication = () => {
  return useQuery({
    queryKey: publicationKeys.lists(),
    queryFn: async () => {
      const response = await publicationService.getPublication();
      return response.payload;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const usePostPublication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IPublicationDTO) =>
      publicationService.postPublication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: publicationKeys.lists(),
      });
      toast.success("Publication added successfully!");
    },
    onError: () => {
      toast.error("Failed to add publication");
    },
  });
};

export const usePutPublication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IPublication) => publicationService.putPublication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: publicationKeys.lists(),
      });
      toast.success("Publication updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update publication");
    },
  });
};

export const useDeletePublication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => publicationService.deletePublication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: publicationKeys.lists(),
      });
      toast.success("Publication deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete publication");
    },
  });
};