import bannerMock from "@/assets/images/banner_mock.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetPersonal, type IUserProfile } from "@/features/user_profile";
import type { IUser } from "@/types/user";
import { BACKEND_IP } from "@/utils/endpoints";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Bookmark,
  GraduationCap,
  Navigation,
  Users,
} from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useGetSavedPostsCount } from "../hooks/use-community";

const MiniProfile = ({
  userData,
  profile,
  onShowSavedPosts,
  currentView,
}: {
  userData: IUser;
  profile: IUserProfile;
  onShowSavedPosts: () => void;
  currentView: "feed" | "saved";
}) => {
  const navigate = useNavigate();
  const { data: personalData} = useGetPersonal();

  const {
    data: savedPostsCount = 0,
    isLoading: savedCountLoading,
    error: savedCountError,
  } = useGetSavedPostsCount();

  const navigationItems = [
    {
      icon: <Bookmark className="size-4" />,
      label: "Saved Posts",
      onClick: onShowSavedPosts,
      count: savedPostsCount,
      active: currentView === "saved",
      loading: savedCountLoading,
    },
    {
      icon: <Users className="size-4" />,
      label: "Groups",
      onClick: () => {},
      active: false,
      loading: false,
    },
    {
      icon: <GraduationCap className="size-4" />,
      label: "My Scholarships",
      onClick: () => {},
      active: false,
      loading: false,
    },
  ];

  const getImageUrl = (path: string | undefined) => {
    if (!path) return "/placeholder.svg";
    if (path.startsWith("http")) return path;
    const fullUrl = `${BACKEND_IP}/${path}`;
    return fullUrl;
  };

  const fullName = personalData
    ? `${personalData.first_name}${
        personalData.middle_name ? ` ${personalData.middle_name}` : ""
      } ${personalData.last_name}`
    : "User";

  const avatarUrl = userData?.avatar;
  const bannerUrl = userData?.banner;

  return (
    <div className="flex flex-col gap-3 w-full">
      <Card className="shadow-sm pt-0 border border-muted-foreground/20 overflow-hidden">
        <div className="relative">
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-background h-24 sm:h-28">
            {bannerMock && (
              <LazyLoadImage
                src={getImageUrl(bannerUrl)}
                alt="Profile banner"
                className="absolute inset-0 dark:brightness-[0.8] w-full h-full object-cover"
              />
            )}
          </div>
          <div className="bottom-0 left-4 absolute translate-y-1/2 transform">
            <div className="border-4 border-mute rounded-full overflow-hidden">
              <Avatar className="size-20 shrink-0">
                <AvatarImage
                  src={getImageUrl(avatarUrl)}
                  alt={fullName}
                  className="rounded-full w-full h-full object-cover"
                />
                <AvatarFallback className="font-bold text-4xl">
                  {fullName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        <CardContent className="pt-6">
          <div className="flex flex-col">
            <p className="font-semibold text-xl">
              {profile.first_name}
              {profile.middle_name ? ` ${profile.middle_name} ` : " "}
              {profile.last_name}
            </p>
            <div className="flex sm:flex-row flex-col sm:items-center gap-1 sm:gap-3 text-muted-foreground">
              <Badge className="w-fit">{profile.job_title}</Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() =>
              navigate({ to: "/profile/$userId", params: { userId: "1" } })
            }
          >
            View Profile
            <ArrowUpRight className="size-4" />
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-sm border border-muted-foreground/20">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Navigation className="size-4" />
            Quick Navigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="space-y-0.5">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                disabled={item.loading}
                className={`group flex items-center justify-between hover:bg-muted/80 px-2 py-1.5 rounded-md font-medium text-sm transition-all w-full text-left disabled:opacity-50 disabled:cursor-not-allowed ${
                  item.active ? "bg-muted text-primary" : ""
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-muted-foreground group-hover:text-foreground transition-colors ${
                      item.active ? "text-primary" : ""
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="transition-transform group-hover:translate-x-0.5">
                    {item.label}
                  </span>
                </div>
                {item.loading ? (
                  <div className="border-primary border-b-2 rounded-full w-3 h-3 animate-spin"></div>
                ) : item.count && item.count > 0 ? (
                  <Badge variant="secondary" className="text-xs">
                    {item.count}
                  </Badge>
                ) : null}
              </button>
            ))}
          </nav>

          {savedCountError && (
            <div className="mt-2 text-red-500 text-xs">
              {savedCountError instanceof Error
                ? savedCountError.message
                : "Không thể tải số lượng bài đã lưu"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MiniProfile;
