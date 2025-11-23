import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { View } from "@/contexts/view-context";
import type { IScholarship } from "@/types/scholarship";
import { truncateText } from "@/utils/functions";
import {
  ArrowUpRight,
  CalendarIcon,
  Heart,
  School,
  Trophy,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { SEARCH_KEYS } from "../utils/constants";
import { handleConvertSearchKeyToIncon } from "../utils/functions";
import { ScholarshipDetailsDialog } from "./scholarship-detail-dialog";

const ScholarshipInfoCard = ({
  info,
  view = "grid",
  showMatchScore = false,
  matchBadgeColor = "bg-emerald-500",
}: {
  info: IScholarship & { matchScore?: number };
  view?: View;
  showMatchScore?: boolean;
  matchBadgeColor?: string;
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const FundingLevelIcon = handleConvertSearchKeyToIncon(
    SEARCH_KEYS.FUNDING_LEVEL
  );

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  const MatchScoreBadge =
    showMatchScore && info.matchScore? (
      <Badge
        className={`${matchBadgeColor} hover:${matchBadgeColor}/90 border-0 select-none text-xs whitespace-nowrap flex items-center gap-1`}
      >
        <Trophy className="size-3" />
        <span>{Math.round(info.matchScore)}% Match</span>
      </Badge>
    ) : null;

  // List view layout
  if (view === "list") {
    return (
      <>
        <Card
          key={info.id}
          className="hover:shadow-md py-0 border-muted-foreground/20 transition-all"
        >
          <div className="flex flex-col">
            <div className="flex-1 p-4 md:p-6">
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-xl">{info.title}</p>
                    <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                      <School className="size-3.5" />
                      <span>{info.provider}</span>
                    </div>
                  </div>
                  {MatchScoreBadge}
                </div>
                <Badge className="self-start bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary text-xs whitespace-nowrap select-none">
                  {FundingLevelIcon && (
                    <FundingLevelIcon className="size-3.5" />
                  )}
                  {info.funding_level}
                </Badge>
              </div>

              <div className="gap-x-6 gap-y-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {info.major && (
                  <InfoField
                    searchKey={SEARCH_KEYS.MAJOR}
                    title="Major"
                    description={info.major}
                  />
                )}
                {info.degree_level && (
                  <InfoField
                    searchKey={SEARCH_KEYS.DEGREE_LEVEL}
                    title="Degree Level"
                    description={info.degree_level}
                  />
                )}
                {info.funding_level && (
                  <InfoField
                    searchKey={SEARCH_KEYS.FUNDING_LEVEL}
                    title="Funding Level"
                    description={info.funding_level}
                  />
                )}
                {info.type && (
                  <InfoField
                    searchKey={SEARCH_KEYS.SCHOLARSHIP_TYPE}
                    title="Type"
                    description={info.type}
                  />
                )}
                {info.region && (
                  <InfoField
                    searchKey={SEARCH_KEYS.REGION}
                    title="Region"
                    description={info.region}
                  />
                )}
                {info.country && (
                  <InfoField
                    searchKey={SEARCH_KEYS.COUNTRY}
                    title="Country"
                    description={info.country}
                  />
                )}
                {info.deadline && (
                  <InfoField
                    customIcon={
                      <CalendarIcon className="size-4 text-primary" />
                    }
                    title="Deadline"
                    description={info.deadline}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-row justify-end items-center gap-3 bg-muted p-3 border-t rounded-b-xl">
              <Button size="sm" onClick={() => setDetailsOpen(true)}>
                View Details
                <ArrowUpRight className="ml-1 size-4" />
              </Button>
              <Button
                className={
                  isSaved
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-destructive hover:bg-destructive/90"
                }
                size="sm"
                onClick={toggleSave}
              >
                {isSaved ? "Saved" : "Save"}
                <Heart
                  className={`size-4 ml-1 ${isSaved ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          </div>
        </Card>

        <ScholarshipDetailsDialog
          scholarship={info}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          showMatchScore={showMatchScore}
          matchBadgeColor={matchBadgeColor}
        />
      </>
    );
  }

  // Grid view layout
  return (
    <>
      <Card
        key={info.id}
        className="flex flex-col hover:shadow-md py-0 border-muted-foreground/20 h-full transition-all"
      >
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg md:text-xl">
                  {info.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1 font-medium">
                  <School className="size-3.5" />
                  {info.provider}
                </CardDescription>
              </div>
              {MatchScoreBadge}
            </div>
            <div className="flex flex-wrap gap-2">
              {info.funding_level && (
                <Badge className="bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary text-xs whitespace-nowrap select-none">
                  {FundingLevelIcon && (
                    <FundingLevelIcon className="size-3.5" />
                  )}
                  {truncateText(info.funding_level, 50)}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 px-4 md:px-6 pt-0 pb-4 md:pb-6">
          <div className="gap-x-4 gap-y-3 grid grid-cols-1 sm:grid-cols-2">
            {info.major && (
              <InfoField
                searchKey={SEARCH_KEYS.MAJOR}
                title="Major"
                description={truncateText(info.major, 50)}
                compact
              />
            )}
            {info.degree_level && (
              <InfoField
                searchKey={SEARCH_KEYS.DEGREE_LEVEL}
                title="Degree Level"
                description={info.degree_level}
                compact
              />
            )}
            {info.type && (
              <InfoField
                searchKey={SEARCH_KEYS.SCHOLARSHIP_TYPE}
                title="Type"
                description={info.type}
                compact
              />
            )}
            {info.region && (
              <InfoField
                searchKey={SEARCH_KEYS.REGION}
                title="Region"
                description={info.region}
                compact
              />
            )}
            {info.country && (
              <InfoField
                searchKey={SEARCH_KEYS.COUNTRY}
                title="Country"
                description={info.country}
                compact
              />
            )}
            {info.deadline && (
              <InfoField
                customIcon={<CalendarIcon className="size-4 text-primary" />}
                title="Deadline"
                description={info.deadline}
                compact
              />
            )}
          </div>
        </CardContent>

        <div className="flex flex-row justify-end items-center gap-3 bg-muted mt-auto p-3 border-t rounded-b-xl">
          <Button size="sm" onClick={() => setDetailsOpen(true)}>
            View Details
            <ArrowUpRight className="ml-1 size-4" />
          </Button>
          <Button
            className={
              isSaved
                ? "bg-green-600 hover:bg-green-700"
                : "bg-destructive hover:bg-destructive/90"
            }
            size="sm"
            onClick={toggleSave}
          >
            {isSaved ? "Saved" : "Save"}
            <Heart className={`size-4 ml-1 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        </div>
      </Card>

      <ScholarshipDetailsDialog
        scholarship={info}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        showMatchScore={showMatchScore}
        matchBadgeColor={matchBadgeColor}
      />
    </>
  );
};

export default ScholarshipInfoCard;

export const InfoField = ({
  searchKey,
  customIcon,
  title,
  description,
  compact = false,
}: {
  searchKey?: string;
  customIcon?: React.ReactNode;
  title: string;
  description: string;
  compact?: boolean;
}) => {
  let icon = customIcon;

  if (searchKey) {
    const IconComponent = handleConvertSearchKeyToIncon(searchKey);
    if (IconComponent) {
      icon = (
        <IconComponent
          className={`${compact ? "size-3.5" : "size-4"} text-primary`}
        />
      );
    }
  }

  return (
    <div
      className={`flex items-start gap-2 ${compact ? "text-xs" : "text-sm"}`}
    >
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-muted-foreground">{title}:</p>
        <p className="font-medium">{description}</p>
      </div>
    </div>
  );
};
