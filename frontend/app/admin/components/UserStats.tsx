import { Briefcase, ShieldCheck, UserCog, Users } from "lucide-react";
import StatCard from "./StatCard";
import { statCardInterface } from "./ResourceStats";

interface UserStatsProps {
  countsByRole?: Array<{
    _count: number;
    role: string;
  }>;
  isLoading: boolean;
}

const UserStats = ({ countsByRole = [], isLoading }: UserStatsProps) => {
  const userStatConfig: Array<
    Omit<statCardInterface, "number"> & { role: string }
  > = [
    {
      title: "Total Users",
      role: "all",
      IconName: Users,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-500",
    },
    {
      title: "Employees",
      role: "employee",
      IconName: Briefcase,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-500",
    },
    {
      title: "Managers",
      role: "manager",
      IconName: UserCog,
      bgColor: "bg-amber-100",
      textColor: "text-amber-800",
      borderColor: "border-amber-500",
    },
    {
      title: "Admins",
      role: "admin",
      IconName: ShieldCheck,
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-500",
    },
  ];

  const getCountByRole = (role: string) =>
    role === "all"
      ? countsByRole.reduce((total, item) => total + item._count, 0)
      : countsByRole.find((item) => item.role === role)?._count ?? 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="h-[180px] animate-pulse rounded-xl border bg-card"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {userStatConfig.map((config) => (
        <StatCard
          key={config.role}
          title={config.title}
          number={getCountByRole(config.role)}
          IconName={config.IconName}
          subtext={config.subtext}
          bgColor={config.bgColor}
          textColor={config.textColor}
          borderColor={config.borderColor}
        />
      ))}
    </div>
  );
};

export default UserStats;
