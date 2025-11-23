import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarIcon,
  ExternalLink,
  Heart,
  School,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { SEARCH_KEYS } from "../utils/constants";
import { handleConvertSearchKeyToIncon } from "../utils/functions";
import type { IScholarshipDetailsDialogProps } from "../utils/types";
import { InfoField } from "./scholarship-info-card";

export function ScholarshipDetailsDialog({
  scholarship,
  open,
  onOpenChange,
  showMatchScore = false,
  matchBadgeColor = "bg-emerald-500",
}: IScholarshipDetailsDialogProps) {
  const FundingLevelIcon = handleConvertSearchKeyToIncon(
    SEARCH_KEYS.FUNDING_LEVEL
  );
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  const handleStartMatching = () => {
    navigate({
      to: "/scholarship-matching/$scholarshipId",
      params: { scholarshipId: scholarship.id },
    });
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  const MatchScoreBadge =
    showMatchScore && scholarship.matchScore? (
      <Badge
        className={`${matchBadgeColor} hover:${matchBadgeColor}/90 border-0 select-none text-xs whitespace-nowrap flex items-center gap-1`}
      >
        <Trophy className="size-3" />
        <span>{Math.round(scholarship.matchScore)}% Match</span>
      </Badge>
    ) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-4 sm:p-6 sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogHeader className="space-y-3 mt-2 sm:mt-4">
          <div className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-2 sm:gap-4">
            <DialogTitle className="font-bold text-lg sm:text-xl md:text-2xl">
              {scholarship.title}
            </DialogTitle>
            {MatchScoreBadge}
          </div>

          <DialogDescription className="flex items-center gap-1.5 text-sm sm:text-base">
            <School className="size-3.5 sm:size-4" />
            <span className="font-medium">{scholarship.provider}</span>
          </DialogDescription>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <Badge className="bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary text-xs sm:text-sm whitespace-nowrap select-none">
              {FundingLevelIcon && (
                <FundingLevelIcon className="size-3 sm:size-3.5" />
              )}
              {scholarship.funding_level}
            </Badge>
            <Badge
              variant="outline"
              className="bg-destructive/10 hover:bg-destructive/20 border-destructive/20 text-destructive text-xs sm:text-sm whitespace-nowrap"
            >
              <CalendarIcon className="mr-1 size-3 sm:size-3.5" />
              Deadline: {scholarship.deadline}
            </Badge>
          </div>
        </DialogHeader>
        <ScrollArea className="mt-2 pr-2 sm:pr-4 h-[250px] sm:h-[300px]">
          <Tabs defaultValue="details" className="mt-1 sm:mt-2">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
            </TabsList>

            <TabsContent
              value="details"
              className="space-y-4 sm:space-y-6 pt-3 sm:pt-4"
            >
              <div className="gap-x-4 gap-y-3 sm:gap-x-8 sm:gap-y-4 grid grid-cols-1 md:grid-cols-2">
                <InfoField
                  searchKey={SEARCH_KEYS.MAJOR}
                  title="Major"
                  description={scholarship.major || ""}
                />
                {!scholarship.posted_at && (
                  <InfoField
                    customIcon={
                      <CalendarIcon className="size-3.5 sm:size-4 text-primary" />
                    }
                    title="Posted Date"
                    description={scholarship.posted_at || ""}
                  />
                )}
                <InfoField
                  searchKey={SEARCH_KEYS.DEGREE_LEVEL}
                  title="Degree Level"
                  description={scholarship.degree_level || ""}
                />
                <InfoField
                  searchKey={SEARCH_KEYS.SCHOLARSHIP_TYPE}
                  title="Type"
                  description={scholarship.type || ""}
                />
                <InfoField
                  searchKey={SEARCH_KEYS.REGION}
                  title="Region"
                  description={scholarship.region || ""}
                />
                <InfoField
                  searchKey={SEARCH_KEYS.COUNTRY}
                  title="Country"
                  description={scholarship.country || ""}
                />
              </div>
            </TabsContent>

            <TabsContent value="description" className="pt-3 sm:pt-4">
              <div className="max-w-none prose prose-sm">
                <p className="mb-1 sm:mb-2 font-semibold text-base sm:text-lg">
                  About This Scholarship
                </p>
                <p className="text-sm sm:text-base whitespace-pre-line">
                  {scholarship.description}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <Separator className="my-2" />

        <DialogFooter className="sm:flex-row flex-col sm:justify-between gap-2 sm:gap-3 mt-2 sm:mt-0">
          <div className="flex items-center gap-2 sm:gap-3"></div>

          <div className="flex flex-wrap justify-end items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="px-2 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm"
              onClick={() => onOpenChange(false)}
              asChild
            >
              <Link
                to={scholarship.original_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to source
                <ExternalLink className="ml-1 size-3.5 sm:size-4" />
              </Link>
            </Button>
            <Button
              variant={isSaved ? "default" : "destructive"}
              size="sm"
              className={`text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 ${
                isSaved ? "bg-green-600 hover:bg-green-700" : ""
              }`}
              onClick={toggleSave}
            >
              {isSaved ? "Saved" : "Save"}
              <Heart
                className={`size-3.5 sm:size-4 ml-1 ${
                  isSaved ? "fill-current" : ""
                }`}
              />
            </Button>
            <Button
              size="sm"
              className="px-2 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm"
              onClick={handleStartMatching}
            >
              Start Matching
              <Sparkles className="ml-1 size-3.5 sm:size-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
