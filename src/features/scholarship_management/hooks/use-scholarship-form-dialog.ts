import type { IScholarship } from "@/types/scholarship";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { FormType } from "../utils/types";
import { useDeleteScholarship, usePostScholarship } from "./use-scholarship-management";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  provider: z.string().min(1, "Provider is required"),
  type: z.string().optional(),
  funding_level: z.string().optional(),
  degree_level: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  major: z.string().optional(),
  deadline: z.string().optional(),
  description: z.string().optional(),
  original_url: z.string().nullable().optional(),
  posted_at: z.string().optional(),

  education_criteria: z.string(),
  personal_criteria: z.string(),
  experience_criteria: z.string(),
  research_criteria: z.string(),
  certification_criteria: z.string(),
  achievement_criteria: z.string(),

  weights: z
    .object({
      "0": z.string(),
      "1": z.string(),
      "2": z.string(),
      "3": z.string(),
      "4": z.string(),
      "5": z.string(),
    })
    .optional(),
});

export type ScholarshipFormValues = z.infer<typeof formSchema>;

export const useScholarshipFormDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formType, setFormType] = useState<FormType>("create");
  const [scholarshipId, setScholarshipId] = useState<string | null>(null);
  const [currentScholarship, setCurrentScholarship] =
    useState<IScholarship | null>(null);

  const postScholarshipMutation = usePostScholarship();
  const deleteScholarshipMutation = useDeleteScholarship();

  const form = useForm<ScholarshipFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      provider: "",
      type: "",
      funding_level: "",
      degree_level: "",
      region: "",
      country: "",
      major: "",
      deadline: undefined,
      description: "",
      original_url: null,
      posted_at: undefined,

      education_criteria: "",
      personal_criteria: "",
      experience_criteria: "",
      research_criteria: "",
      certification_criteria: "",
      achievement_criteria: "",

      weights: {
        "0": "education_criteria",
        "1": "personal_criteria",
        "2": "experience_criteria",
        "3": "research_criteria",
        "4": "certification_criteria",
        "5": "achievement_criteria",
      },
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setScholarshipId(null);
      setCurrentScholarship(null);
    }
  }, [isOpen, form]);

  useEffect(() => {
    if (currentScholarship && (formType === "update" || formType === "read")) {
      form.reset({
        title: currentScholarship.title,
        provider: currentScholarship.provider,
        type: currentScholarship.type,
        funding_level: currentScholarship.funding_level,
        degree_level: currentScholarship.degree_level,
        region: currentScholarship.region,
        country: currentScholarship.country,
        major: currentScholarship.major,
        deadline: currentScholarship.deadline
          ? new Date(currentScholarship.deadline).toISOString()
          : "",
        description: currentScholarship.description,
        original_url: currentScholarship.original_url,
        posted_at: currentScholarship.posted_at
          ? new Date(currentScholarship.posted_at).toISOString()
          : "",

        education_criteria: currentScholarship.education_criteria,
        personal_criteria: currentScholarship.personal_criteria,
        experience_criteria: currentScholarship.experience_criteria,
        research_criteria: currentScholarship.research_criteria,
        certification_criteria: currentScholarship.certification_criteria,
        achievement_criteria: currentScholarship.achievement_criteria,

        weights: {
          "0": currentScholarship.weights?.["0"],
          "1": currentScholarship.weights?.["1"],
          "2": currentScholarship.weights?.["2"],
          "3": currentScholarship.weights?.["3"],
          "4": currentScholarship.weights?.["4"],
          "5": currentScholarship.weights?.["5"],
        },
      });
    }
  }, [currentScholarship, formType, form]);

  const onSubmit = async (values: ScholarshipFormValues) => {
    try {
      if (formType === "create") {
        //@ts-ignore
        await postScholarshipMutation.mutateAsync(values);
      }
      // else if (formType === "update" && scholarshipId) {
      //   await updateScholarshipMutation.mutateAsync(values);
      // }
      setIsOpen(false);
      toast.success(
        formType === "create"
          ? "Scholarship created successfully!"
          : "Scholarship updated successfully!"
      );
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const onDelete = async () => {
    if (!scholarshipId) return;

    try {
      await deleteScholarshipMutation.mutateAsync(scholarshipId);
      setIsOpen(false);
      toast.success("Scholarship deleted successfully!");
    } catch (error) {
      console.error("Error deleting scholarship:", error);
      toast.error("Failed to delete scholarship.");
    }
  };

  const openDialog = (type: FormType, scholarship?: IScholarship) => {
    setFormType(type);

    if (scholarship) {
      setScholarshipId(scholarship.id);
      setCurrentScholarship(scholarship);
    } else {
      form.reset({
        title: "",
        provider: "",
        type: "",
        funding_level: "",
        degree_level: "",
        region: "",
        country: "",
        major: "",
        deadline: undefined,
        description: "",
        original_url: null,
        posted_at: undefined,

        education_criteria: "",
        personal_criteria: "",
        experience_criteria: "",
        research_criteria: "",
        certification_criteria: "",
        achievement_criteria: "",

        weights: {
          "0": "education_criteria",
          "1": "personal_criteria",
          "2": "experience_criteria",
          "3": "research_criteria",
          "4": "certification_criteria",
          "5": "achievement_criteria",
        },
      });
    }

    setIsOpen(true);
  };

  return {
    isOpen,
    setIsOpen,
    formType,
    form,
    scholarshipId,
    isSubmitting: postScholarshipMutation.isPending,
    onSubmit: form.handleSubmit(onSubmit),
    onDelete,
    isDeleting: deleteScholarshipMutation.isPending,
    openDialog,
  };
};
