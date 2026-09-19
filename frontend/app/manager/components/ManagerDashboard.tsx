import RequestStats from "./RequestStats";
import { ChartBarLabel } from "@/components/others/BarChart";
import { ChartPieDonut } from "@/components/others/donoutChart";
import { AreaChartLabel } from "@/components/others/AreaChartLabel";

const resourceTypeChartData = {
  chartTitle: "Requests by Resource Type",
  chartData: [
    { label: "Laptop", value: 45 },
    { label: "Projector", value: 18 },
    { label: "Vehicle", value: 12 },
    { label: "Printer", value: 21 },
    { label: "Server", value: 9 },
    { label: "Furniture", value: 15 },
  ],
  chartFooter: "Showing requests grouped by resource type",
};

const statusDonutData = [
  { label: "Pending", value: 21, fill: "var(--chart-2)" },
  { label: "Approved", value: 96, fill: "var(--chart-1)" },
  { label: "Rejected", value: 11, fill: "var(--chart-3)" },
];

const requestsOverTimeData = {
  chartTitle: "Requests Over Time",
  chartDescription: "Showing requests for the last 6 months",
  chartData: [
    { label: "January", value: 18 },
    { label: "February", value: 24 },
    { label: "March", value: 19 },
    { label: "April", value: 31 },
    { label: "May", value: 27 },
    { label: "June", value: 35 },
  ],
  chartFooter: "Trending up this quarter",
};

export default function ManagerDashboard() {
  return (
    <div className="w-full space-y-6 pb-8">
      <div>
        <h1 className="text-4xl font-bold text-primary">Manager Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Review and manage resource requests from your team.
        </p>
      </div>

      <RequestStats />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartBarLabel {...resourceTypeChartData} />
        <ChartPieDonut
          title="Request Status Distribution"
          data={
            statusDonutData as { label: string; value: number }[]
          }
          footer="Showing requests grouped by status"
        />
      </section>

      <AreaChartLabel {...requestsOverTimeData} />
    </div>
  );
}