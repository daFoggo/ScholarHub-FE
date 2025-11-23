"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { IScholarship } from "@/types/scholarship";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { z } from "zod";

export const scholarshipFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must be less than 255 characters"),
  provider: z
    .string()
    .min(2, "Provider must be at least 2 characters")
    .max(255, "Provider must be less than 255 characters"),
  type: z.string().optional(),
  funding_level: z.string().optional(),
  degree_level: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  major: z.string().optional(),
  deadline: z.string().optional(),
  description: z.string().optional(),
  original_url: z
    .string()
    .url("Must be a valid URL"),
  education_criteria: z.string().optional(),
  personal_criteria: z.string().optional(),
  experience_criteria: z.string().optional(),
  research_criteria: z.string().optional(),
  certification_criteria: z.string().optional(),
  achievement_criteria: z.string().optional(),
});

export type ScholarshipFormValues = z.infer<typeof scholarshipFormSchema>;

interface ScholarshipFormProps {
  onSubmit: (data: ScholarshipFormValues) => Promise<void>;
  initialData?: IScholarship;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function ScholarshipForm({
  onSubmit,
  initialData,
  isLoading = false,
  onCancel,
}: ScholarshipFormProps) {
  const form = useForm<ScholarshipFormValues>({
    resolver: zodResolver(scholarshipFormSchema),
    defaultValues: initialData || {
      title: "",
      provider: "",
      type: "",
      funding_level: "",
      degree_level: "",
      region: "",
      country: "",
      major: "",
      deadline: "",
      description: "",
      original_url: "",
      education_criteria: "",
      personal_criteria: "",
      experience_criteria: "",
      research_criteria: "",
      certification_criteria: "",
      achievement_criteria: "",
    },
  });

  const handleSubmit = async (data: ScholarshipFormValues) => {
    try {
      await onSubmit(data);
      if (!initialData) {
        form.reset();
      }
    } catch (error) {
      console.error("[v0] Form submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 min-w-[625px]">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Basic Information</h3>

          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Scholarship title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider *</FormLabel>
                  <FormControl>
                    <Input placeholder="Organization name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="merit-based">Merit-Based</SelectItem>
                      <SelectItem value="need-based">Need-Based</SelectItem>
                      <SelectItem value="full-ride">Full Ride</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="funding_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funding Level</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select funding level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full">Full</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Scholarship description"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Academic Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Academic Details</h3>

          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="degree_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree Level</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select degree level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="bachelor">Bachelor</SelectItem>
                      <SelectItem value="master">Master</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="major"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Major</FormLabel>
                  <FormControl>
                    <Input placeholder="Field of study" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder="Region" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Criteria */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Selection Criteria</h3>

          <div className="gap-4 grid grid-cols-1">
            <FormField
              control={form.control}
              name="education_criteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education Criteria</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Educational requirements"
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personal_criteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personal Criteria</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Personal requirements"
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience_criteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Criteria</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Experience requirements"
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="research_criteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Research Criteria</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Research requirements"
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="certification_criteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certification Criteria</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Certification requirements"
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="achievement_criteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Achievement Criteria</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Achievement requirements"
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">
            Additional Information
          </h3>

          <FormField
            control={form.control}
            name="original_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Original URL</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
            {initialData ? "Update" : "Create"} Scholarship
          </Button>
        </div>
      </form>
    </Form>
  );
}
