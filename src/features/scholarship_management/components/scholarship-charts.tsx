import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { IScholarship } from "@/types/scholarship";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { format, subMonths, startOfMonth } from "date-fns";

interface ScholarshipChartsProps {
  scholarships: IScholarship[];
}

export function ScholarshipCharts({ scholarships }: ScholarshipChartsProps) {
  // Status Distribution Data
  const now = new Date();
  const statusData = [
    {
      status: "active",
      name: "Active",
      value: scholarships.filter(
        (s) => s.deadline && new Date(s.deadline) > now
      ).length,
      fill: "var(--color-active)",
    },
    {
      status: "expired",
      name: "Expired",
      value: scholarships.filter(
        (s) => s.deadline && new Date(s.deadline) <= now
      ).length,
      fill: "var(--color-expired)",
    },
    {
      status: "noDeadline",
      name: "No Deadline",
      value: scholarships.filter((s) => !s.deadline).length,
      fill: "var(--color-noDeadline)",
    },
  ].filter((item) => item.value > 0);

  const statusChartConfig = {
    active: {
      label: "Active",
      color: "#10b981", // green-500
    },
    expired: {
      label: "Expired",
      color: "#ef4444", // red-500
    },
    noDeadline: {
      label: "No Deadline",
      color: "#6b7280", // gray-500
    },
  };

  // Timeline Data (Last 6 months)
  const timelineData = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = startOfMonth(subMonths(now, i));
    const monthLabel = format(monthDate, "MMM yyyy");

    const count = scholarships.filter((s) => {
      if (!s.posted_at) return false;
      const postedDate = new Date(s.posted_at);
      return (
        postedDate.getMonth() === monthDate.getMonth() &&
        postedDate.getFullYear() === monthDate.getFullYear()
      );
    }).length;

    timelineData.push({
      month: monthLabel,
      count: count,
    });
  }

  const timelineChartConfig = {
    count: {
      label: "Scholarships",
      color: "#3b82f6", // blue-500
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Status Distribution</CardTitle>
          <CardDescription>Breakdown by deadline status</CardDescription>
        </CardHeader>
        <CardContent>
          {statusData.length > 0 ? (
            <ChartContainer
              config={statusChartConfig}
              className="h-[300px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                  cursor={false}
                />
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Creation Timeline</CardTitle>
          <CardDescription>
            Scholarships posted over last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          {timelineData.some((d) => d.count > 0) ? (
            <ChartContainer
              config={timelineChartConfig}
              className="h-[300px] w-full"
            >
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={false}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
