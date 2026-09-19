"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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

export type areaChartPropsType = {
  chartData: { label: string; value: number }[];
  chartTitle: string;
  chartDescription?: string;
  chartFooter?: string;
};

export function AreaChartLabel({
  chartData,
  chartTitle,
  chartDescription,
  chartFooter,
}: areaChartPropsType) {
  const chartConfig = {
    value: {
      label: "Requests",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{chartTitle}</CardTitle>
        <CardDescription>{chartDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-60! w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => String(value).slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="value"
              type="natural"
              fill="var(--color-value)"
              fillOpacity={0.4}
              stroke="var(--color-value)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {chartFooter && (
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              {chartFooter}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

export default AreaChartLabel;