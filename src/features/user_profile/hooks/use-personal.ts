import { GC_TIME, STALE_TIME } from "@/utils/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  personalService,
  type IPersonalDTO,
} from "../services/personal-service";

export const personalKeys = {
  all: ["personal"] as const,
  lists: () => [...personalKeys.all, "list"] as const,
  list: () => [...personalKeys.lists(), "list"] as const,
  details: () => [...personalKeys.all, "detail"] as const,
  detail: (id: string) => [...personalKeys.details(), id] as const,
};

export const useGetPersonal = () => {
  return useQuery({
    queryKey: personalKeys.list(),
    queryFn: async () => {
      const response = await personalService.getPersonal();
      return response.payload;
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  });
};

export const usePostPersonal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IPersonalDTO) => personalService.postPersonal(data),
    onSuccess: (newPersonal) => {
      queryClient.setQueryData(
        personalKeys.detail(newPersonal.payload.contact_email || ""),
        newPersonal
      );

      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: personalKeys.lists(),
      });
    },
  });
};

export const usePutPersonal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IPersonalDTO) => personalService.putPersonal(data),
    onSuccess: (newPersonal) => {
      queryClient.setQueryData(
        personalKeys.detail(newPersonal.payload.contact_email || ""),
        newPersonal
      );

      // Invalidate the list query to ensure it reflects the new data
      queryClient.invalidateQueries({
        queryKey: personalKeys.lists(),
      });
    },
  });
};

export const useCreateWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => personalService.createWallet(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: personalKeys.all,
      });
      toast.success("Wallet created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create wallet");
    },
  });
};
