import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { SITE_CONFIG } from "@/configs/site";
import { BACKEND_IP } from "@/utils/endpoints";
import { useLocation } from "@tanstack/react-router";
import {
  Calendar,
  CopySlash,
  Edit,
  Forward,
  Heart,
  MoreHorizontal,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useGetPersonal } from "../hooks/use-personal";
import { useGetProfileStats } from "../hooks/use-profile-stats";
import type { IProfileHeaderProps } from "../utils/types";
import { FollowListModal } from "./follow-list-modal";
import { ImageUploadOverlay } from "./image-upload-overlay";
export const ProfileHeader = ({
  userData,
  isCurrentUser = false,
  userId,
  createdAt,
}: IProfileHeaderProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followModal, setFollowModal] = useState<{
    isOpen: boolean;
    type: "followers" | "following";
    title: string;
  }>({
    isOpen: false,
    type: "followers",
    title: "",
  });
  const location = useLocation();
  const { data, isLoading } = useGetPersonal();

  const { data: profileStats, isLoading: statsLoading } = useGetProfileStats(
    userId || ""
  );

  const fullName = data?.first_name
    ? `${data.first_name}${data.middle_name ? ` ${data.middle_name}` : ""} ${
        data.last_name
      }`
    : "User";

  const avatarUrl = userData?.avatar;
  const bannerUrl = userData?.banner;

  const getImageUrl = (path: string | undefined) => {
    if (!path) return "/placeholder.svg";
    if (path.startsWith("http")) return path;
    const fullUrl = `${BACKEND_IP}/${path}`;
    return fullUrl;
  };

  const handleShowFollowers = () => {
    setFollowModal({
      isOpen: true,
      type: "followers",
      title: "Followers",
    });
  };

  const handleShowFollowing = () => {
    setFollowModal({
      isOpen: true,
      type: "following",
      title: "Following",
    });
  };

  const handleCloseModal = () => {
    setFollowModal((prev) => ({ ...prev, isOpen: false }));
  };

  if (isLoading || statsLoading) {
    return <ProfileHeaderSkeleton isCurrentUser={isCurrentUser || false} />;
  }

  return (
    <Card className="pt-0 w-full">
      {/* Banner with Upload Overlay */}
      <ImageUploadOverlay
        mediaType="banner"
        isCurrentUser={isCurrentUser}
        className="relative rounded-t-xl w-full h-48 overflow-hidden"
      >
        <LazyLoadImage
          src={getImageUrl(bannerUrl)}
          alt="Profile banner"
          className="absolute inset-0 dark:brightness-[0.8] w-full h-full object-cover"
        />
      </ImageUploadOverlay>

      <CardContent>
        <div className="relative">
          {/* Avatar with Upload Overlay */}
          <div className="-top-16 left-4 sm:left-6 absolute rounded-full ring-4 ring-background">
            <ImageUploadOverlay
              mediaType="avatar"
              isCurrentUser={isCurrentUser}
              className="rounded-full"
            >
              <Avatar className="size-32 shrink-0">
                <AvatarImage
                  src={getImageUrl(avatarUrl)}
                  alt={fullName}
                  className="rounded-full w-full h-full object-cover"
                />
                <AvatarFallback className="font-bold text-4xl">
                  {fullName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </ImageUploadOverlay>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {!isCurrentUser && (
              <Button
                variant={isFollowing ? "outline" : "default"}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                <Heart className="size-4" />
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
            {isCurrentUser && (
              <Button variant="outline" size="icon">
                <Edit className="size-4" />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(
                      SITE_CONFIG.url + location.href
                    )
                  }
                >
                  Share profile
                  <Forward className="ml-auto size-3.5" />
                </DropdownMenuItem>
                {!isCurrentUser && (
                  <>
                    <DropdownMenuItem>
                      Block user
                      <CopySlash className="ml-auto size-3.5" />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Report
                      <TriangleAlert className="ml-auto size-3.5" />
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-6">
            <div className="flex md:flex-row flex-col md:justify-between md:items-start gap-4">
              <div className="space-y-2">
                <h1 className="font-bold text-2xl">{fullName}</h1>
                <div className="flex sm:flex-row flex-col sm:items-center gap-1 sm:gap-3 text-muted-foreground">
                  <Badge className="w-fit">{data?.job_title}</Badge>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-3 md:text-right">
                <div className="flex gap-4 text-sm">
                  <div
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={handleShowFollowers}
                  >
                    <span className="font-bold">
                      {(profileStats?.followers_count || 0).toLocaleString()}
                    </span>{" "}
                    Followers
                  </div>
                  <div
                    className="hover:text-foreground transition-colors cursor-pointer"
                    onClick={handleShowFollowing}
                  >
                    <span className="font-bold">
                      {(profileStats?.following_count || 0).toLocaleString()}
                    </span>{" "}
                    Following
                  </div>
                </div>

                {createdAt && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Calendar className="size-4" />
                    <span>
                      Joined since{" "}
                      {new Date(createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <FollowListModal
        isOpen={followModal.isOpen}
        onClose={handleCloseModal}
        userId={userId || ""}
        type={followModal.type}
        title={followModal.title}
      />
    </Card>
  );
};

const ProfileHeaderSkeleton = ({
  isCurrentUser,
}: {
  isCurrentUser: boolean;
}) => {
  return (
    <Card className="pt-0 w-full">
      <div className="relative w-full h-48 overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-t-xl w-full h-full" />
      </div>

      <CardContent>
        <div className="relative">
          <div className="-top-16 left-4 sm:left-6 absolute rounded-full ring-4 ring-background">
            <Skeleton className="rounded-full size-32" />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {!isCurrentUser && <Skeleton className="w-24 h-10" />}
            {isCurrentUser && <Skeleton className="w-10 h-10" />}
            <Skeleton className="w-10 h-10" />
          </div>

          <div className="mt-6">
            <div className="flex md:flex-row flex-col md:justify-between md:items-start gap-4">
              <div className="space-y-2">
                <Skeleton className="w-48 h-8" />
                <div className="flex sm:flex-row flex-col sm:items-center gap-1 sm:gap-3">
                  <Skeleton className="w-32 h-6" />
                </div>
              </div>

              <div className="flex flex-col items-end space-y-3 md:text-right">
                <div className="flex gap-4 text-sm">
                  <div>
                    <Skeleton className="w-20 h-4" />
                  </div>
                  <div>
                    <Skeleton className="w-20 h-4" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Skeleton className="size-4" />
                  <Skeleton className="w-32 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
