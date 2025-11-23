import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { truncateText } from "@/utils/functions";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  useDeleteEducation,
  useGetEducation,
  usePostEducation,
  usePutEducation,
} from "../hooks/use-education";
import { EDUCATION_TYPE } from "../utils/constants";
import type { IEducation, IEducationSectionProps } from "../utils/types";
import EducationForm, { type EducationFormValues } from "./educations-form";

const EducationSection = ({ isCurrentUser }: IEducationSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<IEducation | null>(
    null
  );
  const [showAll, setShowAll] = useState<Record<EDUCATION_TYPE, boolean>>({
    university: false,
    high_school: false,
    other: false,
  });

  // Use the hooks
  const { data: educationInfo, isLoading } = useGetEducation();
  const { mutate: createEducation, isPending: isCreating } = usePostEducation();
  const { mutate: updateEducation, isPending: isUpdating } = usePutEducation();
  const { mutate: deleteEducation, isPending: isDeleting } = useDeleteEducation();
  const isDataArray = Array.isArray(educationInfo);

  const saveEducation = (values: EducationFormValues) => {
    if (editingEducation?.id) {
      updateEducation({
        id: editingEducation.id,
        ...values,
      });
    } else {
      createEducation({
        ...values,
      });
    }
    closeDialog();
  };

  const editEducation = (education: IEducation) => {
    setEditingEducation(education);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingEducation(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingEducation(null);
  };

  const toggleShowAll = (type: EDUCATION_TYPE) => {
    setShowAll((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const getTypeLabel = (type: EDUCATION_TYPE): string => {
    switch (type) {
      case EDUCATION_TYPE.UNIVERSITY:
        return "University Education";
      case EDUCATION_TYPE.OTHER:
        return "Other Education";
      case EDUCATION_TYPE.HIGH_SCHOOL:
        return "High School Education";
      default:
        return "Education";
    }
  };

  const getEducationByType = (type: EDUCATION_TYPE) => {
    return isDataArray ? educationInfo?.filter((edu) => edu.type === type) : [];
  };

  const renderEducationCard = (education: IEducation) => (
    <div
      key={education.id}
      className="bg-muted p-4 border border-muted-foreground/20 rounded-lg"
    >
      <div className="flex sm:flex-row flex-col justify-between items-start gap-2">
        <div className="w-full">
          <div className="flex items-center gap-2">
            <p className="font-medium break-words">
              {truncateText(education.institution || "", 50)}
            </p>
          </div>

          <p className="text-muted-foreground text-sm break-words">
            {education.degree_type}{" "}
            {education.major ? `in ${education.major}` : ""}
          </p>

          <div className="flex flex-wrap gap-2 sm:gap-4 mt-1 text-muted-foreground/70 text-sm">
            {education.current_study_year && (
              <p>Current Year: {education.current_study_year}</p>
            )}
            {education.graduation_year && (
              <p>Graduated: {education.graduation_year}</p>
            )}
            {education?.gpa && (
              <p className="text-primary">GPA: {education?.gpa.toFixed(2)}</p>
            )}
          </div>
        </div>

        {isCurrentUser && (
          <div className="flex self-end sm:self-start gap-1 mt-2 sm:mt-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editEducation(education)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => deleteEducation(education.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderCategorySection = (type: EDUCATION_TYPE) => {
    const categoryItems = getEducationByType(type);
    if (categoryItems.length === 0) return null;

    const isShowingAll = showAll[type];
    const displayItems = isShowingAll
      ? categoryItems
      : categoryItems.slice(0, 2);
    const hasMore = categoryItems.length > 2;

    return (
      <div className="space-y-4">
        <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-2">
          <p className="font-medium text-lg">{getTypeLabel(type)}</p>
        </div>

        <div className="space-y-4">
          {displayItems.map((education: IEducation) =>
            renderEducationCard(education)
          )}
        </div>

        {hasMore && (
          <Button
            variant="ghost"
            className="mt-2 w-full"
            onClick={() => toggleShowAll(type)}
          >
            {isShowingAll ? (
              <>
                <ChevronUp className="size-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="size-4" />
                Show All ({categoryItems.length})
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  const hasEducation = Array.isArray(educationInfo)
    ? educationInfo?.length > 0
    : !!educationInfo;

  if (isLoading) {
    return <EducationSectionSkeleton isCurrentUser={isCurrentUser || false} />;
  }

  return (
    <Card>
      <CardHeader className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <CardTitle className="text-xl">Education</CardTitle>
          <CardDescription>Educational background</CardDescription>
        </div>
        {isCurrentUser && (
          <Button
            size="sm"
            onClick={() => openAddDialog()}
            className="w-full sm:w-auto"
          >
            <Plus className="size-4" />
            Add Education
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        {renderCategorySection(EDUCATION_TYPE.HIGH_SCHOOL)}
        {renderCategorySection(EDUCATION_TYPE.UNIVERSITY)}
        {renderCategorySection(EDUCATION_TYPE.OTHER)}

        {!hasEducation && (
          <div className="py-10 text-center">
            <p className="text-muted-foreground">
              No education information added
            </p>
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] sm:max-w-lg">
          <EducationForm
            initialValues={editingEducation}
            isLoading={isCreating || isUpdating || isDeleting}
            onSubmit={saveEducation}
            onCancel={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const EducationSectionSkeleton = ({
  isCurrentUser,
}: {
  isCurrentUser: boolean;
}) => {
  return (
    <Card>
      <CardHeader className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 pb-4 border-b">
        <div>
          <Skeleton className="w-24 h-7" />
          <Skeleton className="mt-1 w-40 h-4" />
        </div>
        {isCurrentUser && <Skeleton className="w-full sm:w-32 h-9" />}
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        <div className="space-y-4">
          <Skeleton className="w-48 h-6" />
          <div className="space-y-4">
            <div className="bg-muted p-4 border border-muted-foreground/20 rounded-lg">
              <div className="flex sm:flex-row flex-col justify-between items-start gap-2">
                <div className="w-full">
                  <Skeleton className="w-3/4 h-5" />
                  <Skeleton className="mt-2 w-1/2 h-4" />
                  <div className="flex flex-wrap gap-2 sm:gap-4 mt-3">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-16 h-4" />
                  </div>
                </div>
                {isCurrentUser && (
                  <div className="flex self-end sm:self-start gap-1 mt-2 sm:mt-0">
                    <Skeleton className="w-8 h-8" />
                    <Skeleton className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>
            <div className="bg-muted p-4 border border-muted-foreground/20 rounded-lg">
              <div className="flex sm:flex-row flex-col justify-between items-start gap-2">
                <div className="w-full">
                  <Skeleton className="w-2/3 h-5" />
                  <Skeleton className="mt-2 w-1/3 h-4" />
                  <div className="flex flex-wrap gap-2 sm:gap-4 mt-3">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                </div>
                {isCurrentUser && (
                  <div className="flex self-end sm:self-start gap-1 mt-2 sm:mt-0">
                    <Skeleton className="w-8 h-8" />
                    <Skeleton className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="w-44 h-6" />
          <div className="bg-muted p-4 border border-muted-foreground/20 rounded-lg">
            <div className="flex sm:flex-row flex-col justify-between items-start gap-2">
              <div className="w-full">
                <Skeleton className="w-4/5 h-5" />
                <Skeleton className="mt-2 w-3/5 h-4" />
                <div className="flex flex-wrap gap-2 sm:gap-4 mt-3">
                  <Skeleton className="w-28 h-4" />
                  <Skeleton className="w-18 h-4" />
                </div>
              </div>
              {isCurrentUser && (
                <div className="flex self-end sm:self-start gap-1 mt-2 sm:mt-0">
                  <Skeleton className="w-8 h-8" />
                  <Skeleton className="w-8 h-8" />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationSection;
