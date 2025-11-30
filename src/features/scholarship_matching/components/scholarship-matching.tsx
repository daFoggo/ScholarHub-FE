import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { useScholarshipDetail } from "@/features/scholarship_search";
import ScholarshipInfoCard from "@/features/scholarship_search/components/scholarship-info-card";
import { UserProfile } from "@/features/user_profile";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { usePostScholarshipMatching } from "../hooks/use-scholarship-matching";
import { MatchingRadarChart } from "./matching-radar-chart";
import { MatchingSkeleton } from "./matching-skeleton";

export interface IMatchingCriteria {
  name: string;
  matchPercentage: number;
  status: "met" | "partially-met" | "not-met";
  advice: string;
}

export const ScholarshipMatching = ({
  scholarshipId,
}: {
  scholarshipId: string;
}) => {
  const { data: scholarshipData } = useScholarshipDetail(scholarshipId);
  const { user } = useAuth();
  const {
    mutate: postScholarshipMatching,
    isPending,
    isError,
    error,
    data: evaluateData,
  } = usePostScholarshipMatching();

  useEffect(() => {
    postScholarshipMatching({ id: scholarshipId });
  }, [scholarshipId, postScholarshipMatching]);

  const criteria = useMemo(() => {
    if (!evaluateData) return [];

    const ordinalCriteria: IMatchingCriteria[] = Object.entries(
      evaluateData.payload.evaluate.ordinal_criteria
    ).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      matchPercentage: value.score,
      status:
        value.score >= 80
          ? "met"
          : value.score >= 50
          ? "partially-met"
          : "not-met",
      advice: value.evidence.join(" "),
    }));

    return [...ordinalCriteria];
  }, [evaluateData]);

  if (isPending) {
    return <MatchingSkeleton />;
  }

  if (isError) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorStatus = (error as any)?.response?.status;

    let errorTitle = "Error Loading Match Data";
    let errorMessage = "An unexpected error occurred. Please try again.";

    if (errorStatus === 402) {
      errorTitle = "Insufficient SPT Balance";
      errorMessage = "You do not have enough SPT to perform this action.";
    } else if (errorStatus === 400) {
      errorTitle = "Wallet Required";
      errorMessage =
        "Please create a blockchain wallet before using this service.";
    }

    return (
      <Card className="bg-destructive/10 shadow-md p-6 border-destructive text-center">
        <CardHeader>
          <CardTitle className="text-destructive text-2xl">
            {errorTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{errorMessage}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => postScholarshipMatching({ id: scholarshipId })}
          >
            Retry
            <RotateCcw className="size-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex md:flex-row flex-col gap-8">
      {/* Left side - Profile and Scholarship Info */}
      <div className="space-y-6 w-full md:w-5/12">
        <Card className="shadow-md border-muted-foreground/20">
          <CardHeader className="pb-3 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="font-bold text-2xl">
                Match Overview
              </CardTitle>
            </div>
            <CardDescription>
              Compatibility between your profile and the scholarship
              requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="mb-4 text-muted-foreground text-sm">
              This analysis compares your profile with the requirements of the
              selected scholarship, highlighting areas of strength and
              opportunities for improvement.
            </p>
            <Button className="w-full" variant="outline">
              View Full Report
              <ArrowUpRight className="ml-2 size-4" />
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="scholarship" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="scholarship">Scholarship</TabsTrigger>
            <TabsTrigger value="profile">Your Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="scholarship" className="space-y-4">
            {scholarshipData && (
              <ScholarshipInfoCard
                info={scholarshipData}
                view="list"
                showMatchScore={false}
              />
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <UserProfile
              showHeader={false}
              showInOneColumn={true}
              userId={user?.id || ""}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Right side - Chart and Progress */}
      <div className="w-full md:w-7/12">
        <Card className="shadow-md mb-6 border-muted-foreground/20">
          <CardHeader className="border-b">
            <CardTitle>Match Analysis</CardTitle>
            <CardDescription>
              Compatibility radar chart of your profile against scholarship
              requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center pt-6 h-[350px]">
            {criteria.length > 0 && <MatchingRadarChart data={criteria} />}
          </CardContent>
        </Card>

        <Card className="shadow-md border-muted-foreground/20">
          <CardHeader className="border-b">
            <CardTitle>Criteria Assessment & Recommendations</CardTitle>
            <CardDescription>
              Detailed feedback on how your profile matches each criterion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {criteria.map((criterion) => {
              // Determine status styles
              const statusStyles = {
                met: {
                  icon: <CheckCircle className="size-4 text-green-500" />,
                  textColor: "text-green-600",
                  progressBg: "bg-green-100",
                  progressFill: "[&>*]:bg-green-500",
                },
                "partially-met": {
                  icon: <AlertCircle className="size-4 text-amber-500" />,
                  textColor: "text-amber-600",
                  progressBg: "bg-amber-100",
                  progressFill: "[&>*]:bg-amber-500",
                },
                "not-met": {
                  icon: <XCircle className="size-4 text-red-500" />,
                  textColor: "text-red-600",
                  progressBg: "bg-red-100",
                  progressFill: "[&>*]:bg-red-500",
                },
              };

              const style = statusStyles[criterion.status];

              return (
                <div
                  key={criterion.name}
                  className="space-y-3 bg-card p-4 border border-muted-foreground/20 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {style.icon}
                      <h3 className="font-medium">{criterion.name}</h3>
                    </div>
                    <Badge
                      className={cn(
                        "font-medium",
                        criterion.status === "met"
                          ? "bg-green-100 text-green-800 border-green-300"
                          : criterion.status === "partially-met"
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-red-100 text-red-800 border-red-300"
                      )}
                    >
                      {criterion.matchPercentage}%
                    </Badge>
                  </div>

                  <Progress
                    value={criterion.matchPercentage}
                    className={cn("h-2", style.progressBg, style.progressFill)}
                  />

                  <div className="flex items-start gap-2 pt-1">
                    <div className="flex-shrink-0 size-4" />
                    <p className="text-muted-foreground text-sm">
                      {criterion.advice}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
