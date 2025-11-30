import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { scholarshipSearchServices } from "../services/scholarship-search";
import { personalKeys } from "@/features/user_profile/hooks/use-personal";

export const scholarshipSearchKeys = {
  all: ["scholarshipSearch"] as const,
  lists: () => [...scholarshipSearchKeys.all, "list"] as const,
  list: (filters: any) =>
    [
      ...scholarshipSearchKeys.lists(),
      {
        ...filters,
      },
    ] as const,
  details: () => [...scholarshipSearchKeys.all, "detail"] as const,
  detail: (id: string) => [...scholarshipSearchKeys.details(), id] as const,
};

export const useSearchScholarships = (query: string) => {
  return useQuery({
    queryKey: scholarshipSearchKeys.list({ query }),
    queryFn: async () => {
      const response = await scholarshipSearchServices.searchScholarships(
        query
      );
      return response.payload.scholarships;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!query,
  });
};

export const useRecommendScholarships = (params: {
  suggest: boolean;
  limit: number;
  offset: number;
}) => {
  return useQuery({
    queryKey: scholarshipSearchKeys.list(params),
    queryFn: async () => {
      const response = await scholarshipSearchServices.getScholarshipRecommend(
        params
      );
      return response.payload.scholarships;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const useForceRecreateScholarshipRecommend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      scholarshipSearchServices.forceRecreateScholarshipRecommend(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: scholarshipSearchKeys.lists(),
      });
      // Refresh balance to reflect SPT deduction
      queryClient.invalidateQueries({ queryKey: personalKeys.all });

      const message = data.message || "Recommendations updated!";
      toast.success(message);
    },
    onError: (error: any) => {
      const errorStatus = error?.response?.status;

      if (errorStatus === 402) {
        toast.error("Insufficient SPT balance to re-evaluate recommendations.");
      } else if (errorStatus === 400) {
        toast.error(
          "Please create a blockchain wallet before using this service."
        );
      } else {
        toast.error("Failed to update recommendations. Please try again.");
      }
    },
  });
};

export const useScholarshipDetail = (id: string) => {
  return useQuery({
    queryKey: scholarshipSearchKeys.detail(id),
    queryFn: async () => {
      const response = await scholarshipSearchServices.getScholarshipDetail({
        id,
      });
      return response.payload.scholarships;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!id,
  });
};
