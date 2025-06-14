import { useQuery } from "@tanstack/react-query";
import { STALE_TIME, GC_TIME } from "@/utils/constants";
import { profileStatsService } from "../services/profile-stats-services";

export const useGetProfileStats = (userId: string) => {
  return useQuery({
    queryKey: ["profile", "stats", userId],
    queryFn: () => profileStatsService.getProfileStats(userId),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!userId,
  });
}; 