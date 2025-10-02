import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, UserPlus, Loader2 } from "lucide-react";
import { useGetConnections, useFollowUser } from "../hooks/use-community";
import { toast } from "sonner";

export const NetworkSuggestions = () => {
  const { data: connections = [], isLoading: loading } = useGetConnections();
  const followUserMutation = useFollowUser();

  const handleFollow = async (userId: string, userName: string) => {
    try {
      await followUserMutation.mutateAsync(userId);
      toast.success(`Đã follow ${userName}!`);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi follow user");
      console.error("Follow error:", error);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">People you may know</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[1,2,3].map(i => (
              <div key={i} className="flex gap-3">
                <div className="bg-gray-200 rounded-full size-12"></div>
                <div className="flex-1">
                  <div className="bg-gray-200 mb-2 rounded w-3/4 h-4"></div>
                  <div className="bg-gray-200 rounded w-1/2 h-3"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">People you may know</CardTitle>
      </CardHeader>
      <CardContent className="gap-4 grid">
        {connections.map((connection: any) => {
          return (
            <div key={connection.id} className="flex items-start gap-3">
              <Avatar className="size-12 object-cover shrink-0">
                <AvatarImage
                  src={connection.avatar || undefined}
                  alt={connection.name}
                />
                <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                  {connection.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="font-medium text-sm leading-none">{connection.name}</p>
                <p className="text-muted-foreground text-xs">{connection.role}</p>
                <p className="text-muted-foreground text-xs">{connection.mutualConnections} mutual connections</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 border-muted-foreground/20 w-full h-8 text-xs"
                  onClick={() => handleFollow(connection.id, connection.name)}
                  disabled={followUserMutation.isPending}
                >
                  {followUserMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <UserPlus className="size-4" />
                  )}
                  Follow
                </Button>
              </div>
            </div>
          );
        })}
        <Button variant="ghost" size="sm" className="w-full text-primary">
          Explore networks
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
};