"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ScholarshipForm,
  type ScholarshipFormValues,
} from "./scholarship-form";
import { ScholarshipTable } from "./scholarship-table";
import { ScholarshipStatsCards } from "./scholarship-stats-cards";
import { ScholarshipCharts } from "./scholarship-charts";
import type { IScholarship } from "@/types/scholarship";
import { Plus } from "lucide-react";
import {
  useGetMyScholarships,
  useCreateScholarship,
  useUpdateScholarship,
  useDeleteScholarship,
} from "../hooks/use-scholarship-management";

export function ScholarshipManagement() {
  const { data: scholarships = [], isLoading: isLoadingScholarships } =
    useGetMyScholarships();

  const createMutation = useCreateScholarship();
  const updateMutation = useUpdateScholarship();
  const deleteMutation = useDeleteScholarship();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<
    IScholarship | undefined
  >();

  const handleOpenDialog = () => {
    setSelectedScholarship(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (scholarship: IScholarship) => {
    setSelectedScholarship(scholarship);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scholarship?")) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleFormSubmit = async (data: ScholarshipFormValues) => {
    if (selectedScholarship) {
      await updateMutation.mutateAsync({
        id: selectedScholarship.id,
        ...data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
    setIsDialogOpen(false);
    setSelectedScholarship(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">My Scholarships</h2>
          <p className="mt-1 text-muted-foreground">
            Manage and track your scholarship programs
          </p>
        </div>
        <Button onClick={handleOpenDialog} disabled={createMutation.isPending}>
          <Plus className="mr-2 w-4 h-4" />
          Add Scholarship
        </Button>
      </div>

      {/* Statistics Cards */}
      {!isLoadingScholarships && scholarships.length > 0 && (
        <ScholarshipStatsCards scholarships={scholarships} />
      )}

      {/* Charts */}
      {!isLoadingScholarships && scholarships.length > 0 && (
        <ScholarshipCharts scholarships={scholarships} />
      )}

      {/* Table */}
      <ScholarshipTable
        scholarships={scholarships}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoadingScholarships || deleteMutation.isPending}
      />

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="min-w-5xl max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedScholarship
                ? "Edit Scholarship"
                : "Create New Scholarship"}
            </DialogTitle>
            <DialogDescription>
              {selectedScholarship
                ? "Update the scholarship details below"
                : "Fill in the details for a new scholarship"}
            </DialogDescription>
          </DialogHeader>
          <ScholarshipForm
            onSubmit={handleFormSubmit}
            initialData={selectedScholarship}
            isLoading={createMutation.isPending || updateMutation.isPending}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
