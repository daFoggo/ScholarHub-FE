
import { ScholarshipManagement } from "@/features/scholarship_management";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/scholarship-management/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col py-6 min-h-screen container-wrapper">
      <div className="container">
        <ScholarshipManagement />
      </div>
    </div>
  );
}
