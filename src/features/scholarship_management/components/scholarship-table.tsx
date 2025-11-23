"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IScholarship } from "@/types/scholarship";
import { format } from "date-fns";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";

interface ScholarshipTableProps {
  scholarships?: IScholarship[] | null;
  onEdit: (scholarship: IScholarship) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function ScholarshipTable({
  scholarships = [],
  onEdit,
  onDelete,
  isLoading = false,
}: ScholarshipTableProps) {
  const data = scholarships || [];

  if (data.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          No scholarships found. Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Title</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Degree Level</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((scholarship) => (
            <TableRow key={scholarship.id} className="hover:bg-muted/50">
              <TableCell className="max-w-xs font-medium truncate">
                {scholarship.title}
              </TableCell>
              <TableCell>{scholarship.provider}</TableCell>
              <TableCell>
                {scholarship.type ? (
                  <span className="inline-block bg-primary/10 px-2 py-1 rounded-full text-primary text-xs">
                    {scholarship.type}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {scholarship.degree_level || (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {scholarship.deadline ? (
                  format(new Date(scholarship.deadline), "MMM dd, yyyy")
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {scholarship.original_url && (
                    <Button size="sm" variant="ghost" asChild>
                      <a
                        href={scholarship.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(scholarship)}
                    disabled={isLoading}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(scholarship.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
