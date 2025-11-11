import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  certificationService,
  type ICertificationDTO,
} from "../services/certification-service";
import type { ICertification } from "../utils/types";

export const certificationKeys = {
  all: ["certification"] as const,
  lists: () => [...certificationKeys.all, "list"] as const,
  list: () => [...certificationKeys.lists(), "list"] as const,
  details: () => [...certificationKeys.all, "detail"] as const,
  detail: (id: string) => [...certificationKeys.details(), id] as const,
};

export const useGetCertification = () => {
  return useQuery({
    queryKey: certificationKeys.list(),
    queryFn: async () => {
      const response = await certificationService.getCertification();
      return response.payload;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const usePostCertification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICertificationDTO) =>
      certificationService.postCertification(data),
    onSuccess: (newScholarship) => {
      // Update the cache with the new scholarship data
      queryClient.setQueryData(
        certificationKeys.detail(newScholarship.payload[0]?.id || ""),
        newScholarship
      );

      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: certificationKeys.lists(),
      });
    },
  });
};

export const usePutCertification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICertification) =>
      certificationService.putCertification(data),
    onSuccess: (newScholarship) => {
      // Update the cache with the new scholarship data
      queryClient.setQueryData(
        certificationKeys.detail(newScholarship.payload[0]?.id || ""),
        newScholarship
      );

      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: certificationKeys.lists(),
      });
    },
  });
};

export const useDeleteCertification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => certificationService.deleteCertification(id),
    onSuccess: () => {
      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: certificationKeys.lists(),
      });
    },
  });
};
