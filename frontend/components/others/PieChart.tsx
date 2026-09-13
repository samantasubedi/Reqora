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
} satisfies ChartConfig;
interface propType {
  data: {
    label: string;
    value: number;
    fill: string;
  }[];
}

export function ChartPieLabel({ data }: propType) {
  return (
    <Card className="flex h-[420px] flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Resource distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1  pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]  pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" label nameKey="label" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Showing resource distribution by status
        </div>
      </CardFooter>
    </Card>
  );
}
