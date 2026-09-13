"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from "recharts";

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

export const description = "A bar chart with a label";
const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const chartConfig = {
  desktop: {
    label: "type",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export type chartPropsType = {
  chartData: { label: string; value: number }[];
  chartTitle: string;
  chartDescription?: string;
  chartFooter?: string;
};
export function ChartBarLabel({
  chartData,
  chartTitle,
  chartDescription,
  chartFooter,
}: chartPropsType) {
  console.log(chartData);
  return (
    <Card className="h-[420px]">
      <CardHeader>
        <CardTitle>{chartTitle}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[250px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" radius={8}>
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    <CardFooter className="flex-col gap-2 text-sm mt-8">
        <div className="flex items-center gap-2 leading-none font-medium">
          {chartFooter}
        </div>
      </CardFooter>
    </Card>
  );
}
