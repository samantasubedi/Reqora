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
      tone: "info",
    },
    {
      title: "Employees",
      role: "employee",
      IconName: Briefcase,
      tone: "success",
    },
    {
      title: "Managers",
      role: "manager",
      IconName: UserCog,
      tone: "warning",
    },
    {
      title: "Admins",
      role: "admin",
      IconName: ShieldCheck,
      tone: "info",
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
            className="h-[118px] animate-pulse rounded-xl border bg-card"
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
          tone={config.tone}
        />
      ))}
    </div>
  );
};

export default UserStats;
