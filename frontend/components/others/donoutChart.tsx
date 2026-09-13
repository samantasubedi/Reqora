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
  users: {
    label: "Users",
  },
  admin: {
    label: "Admin",
    color: "var(--chart-1)",
  },
  manager: {
    label: "Manager",
    color: "var(--chart-2)",
  },
  employee: {
    label: "Employee",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function ChartPieDonut({
  title,
  description,
  footer,
  data,
}: {
  title: string;
  description?: string;
  footer?: string;
  data: { label: string; value: number }[];
}) {
  return (
    <Card className="flex h-[420px] flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={data} dataKey="value" nameKey="label" innerRadius={60} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none ">{footer}</div>
      </CardFooter>
    </Card>
  );
}
