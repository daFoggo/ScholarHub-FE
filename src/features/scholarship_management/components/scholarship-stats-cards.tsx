import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IScholarship } from "@/types/scholarship";
import { Award, Calendar, TrendingUp, Globe } from "lucide-react";

interface ScholarshipStatsCardsProps {
  scholarships: IScholarship[];
}

export function ScholarshipStatsCards({
  scholarships,
}: ScholarshipStatsCardsProps) {
  // Calculate statistics
  const totalCount = scholarships.length;

  // Active scholarships (deadline in future)
  const now = new Date();
  const activeCount = scholarships.filter((s) => {
    if (!s.deadline) return false;
    return new Date(s.deadline) > now;
  }).length;

  // Upcoming deadlines (within 30 days)
  const upcomingDeadlines = scholarships.filter((s) => {
    if (!s.deadline) return false;
    const deadline = new Date(s.deadline);
    const daysUntil =
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysUntil > 0 && daysUntil <= 30;
  }).length;

  // Unique countries
  const uniqueCountries = new Set(
    scholarships.map((s) => s.country).filter(Boolean)
  ).size;

  const stats = [
    {
      title: "Total Scholarships",
      value: totalCount,
      icon: Award,
      description: "Total programs",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Active Programs",
      value: activeCount,
      icon: TrendingUp,
      description: "Currently accepting",
      badge:
        activeCount > 0
          ? { text: "Active", variant: "default" as const }
          : undefined,
      iconColor: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Upcoming Deadlines",
      value: upcomingDeadlines,
      icon: Calendar,
      description: "Next 30 days",
      badge:
        upcomingDeadlines > 0
          ? { text: "Urgent", variant: "destructive" as const }
          : undefined,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Countries",
      value: uniqueCountries,
      icon: Globe,
      description: "Global reach",
      iconColor: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`size-4 ${stat.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.badge && (
                <Badge variant={stat.badge.variant} className="text-xs">
                  {stat.badge.text}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
