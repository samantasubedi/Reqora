import StatCard from "@/app/admin/components/StatCard";
import { CheckCircle2, CircleX, ClipboardList, Clock } from "lucide-react";
import { statCardInterface } from "@/app/admin/components/ResourceStats";

const totalRequests = 128;
const pendingRequests = 21;
const approvedRequests = 96;
const rejectedRequests = 11;

const statConfig: Omit<statCardInterface, "number">[] = [
  {
    title: "Total Requests",
    IconName: ClipboardList,
    subtext: "Requests in your department",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    borderColor: "border-blue-500",
  },
  {
    title: "Pending",
    IconName: Clock,
    subtext: `${((pendingRequests / totalRequests) * 100).toFixed(1)}% of total`,
    bgColor: "bg-amber-100",
    textColor: "text-amber-800",
    borderColor: "border-amber-500",
  },
  {
    title: "Approved",
    IconName: CheckCircle2,
    subtext: `${((approvedRequests / totalRequests) * 100).toFixed(1)}% of total`,
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-500",
  },
  {
    title: "Rejected",
    IconName: CircleX,
    subtext: `${((rejectedRequests / totalRequests) * 100).toFixed(1)}% of total`,
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    borderColor: "border-red-500",
  },
];

const statValues = [
  totalRequests,
  pendingRequests,
  approvedRequests,
  rejectedRequests,
];

const RequestStats = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statConfig.map((config, index) => (
        <StatCard
          key={config.title}
          {...config}
          number={statValues[index]}
        />
      ))}
    </div>
  );
};

export default RequestStats;