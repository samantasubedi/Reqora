"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  Resources: {
    label: "Resources",
  },
  Available: {
    label: "Available",
    color: "var(--chart-1)",
  },
  InUse: {
    label: "In Use",
    color: "var(--chart-2)",
  },
  UnderMaintenance: {
    label: "Under Maintenance",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;
interface propType {
  availableResourceCount: Number;
  inUseResourceCount: Number;
  underMaintainenceResourceCount: Number;
}

export function ChartPieLabel({
  availableResourceCount,
  inUseResourceCount,
  underMaintainenceResourceCount,
}: propType) {
  const chartData = [
    {
      status: "Available",
      Resources: availableResourceCount,
      fill: "var(--color-Available)",
    },
    {
      status: "In Use",
      Resources: inUseResourceCount,
      fill: "var(--color-InUse)",
    },
    {
      status: "Under Maintenance",
      Resources: underMaintainenceResourceCount,
      fill: "var(--color-UnderMaintenance)",
    },
  ];
  return (
    <Card className="flex flex-col ">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl text-teal-800">
          Resource distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1  pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]  pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="Resources" label nameKey="status" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Showing total resources in the company
        </div>
      </CardFooter>
    </Card>
  );
}
