import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  referenceService,
  type IReferenceDTO,
} from "../services/references-service";
import type { IReference } from "../utils/types";

export const referenceKeys = {
  all: ["reference"] as const,
  lists: () => [...referenceKeys.all, "list"] as const,
  details: () => [...referenceKeys.all, "detail"] as const,
  detail: (id: string) => [...referenceKeys.details(), id] as const,
};

export const useGetReference = () => {
  return useQuery({
    queryKey: referenceKeys.lists(),
    queryFn: async () => {
      const response = await referenceService.getReference();
      return response.payload;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const usePostReference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IReferenceDTO) => referenceService.postReference(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: referenceKeys.lists(),
      });
      toast.success("Reference created successfully!");
    },
    onError: () => {
      toast.error("Failed to create reference");
    },
  });
};

export const usePutReference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IReference) => referenceService.putReference(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: referenceKeys.lists(),
      });
      toast.success("Reference updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update reference");
    },
  });
};

export const useDeleteReference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => referenceService.deleteReference(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: referenceKeys.lists(),
      });
      toast.success("Reference deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete reference");
    },
  });
};