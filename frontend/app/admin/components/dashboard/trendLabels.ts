import type { TrendGranularity, TrendSeries } from "../../apis/companyApi";
import type { DashboardRangePreset } from "./dateRange";

export type TrendChartPoint = {
  label: string;
  value: number;
};

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type BucketDate = {
  year: number;
  month: number;
  day: number;
};

const parseBucketStart = (bucketStart: string): BucketDate => {
  const [year, month, day] = bucketStart.split("-").map(Number);
  return { year, month: month - 1, day };
};

const formatDayLabel = ({ month, day }: BucketDate) =>
  `${MONTHS_SHORT[month]} ${day}`;

const formatMonthLabel = ({ year, month }: BucketDate) =>
  `${MONTHS_SHORT[month]} '${String(year).slice(-2)}`;

const formatQuarterLabel = ({ year, month }: BucketDate) =>
  `Q${Math.floor(month / 3) + 1} '${String(year).slice(-2)}`;

const formatBucketLabel = (
  bucketStart: string,
  granularity: TrendGranularity,
  preset: DashboardRangePreset,
) => {
  const bucketDate = parseBucketStart(bucketStart);

  if (granularity === "day" && preset === "week") {
    return WEEKDAYS[new Date(bucketDate.year, bucketDate.month, bucketDate.day).getDay()];
  }

  if (granularity === "month" && preset === "year") {
    return MONTHS_SHORT[bucketDate.month];
  }

  switch (granularity) {
    case "day":
    case "week":
      return formatDayLabel(bucketDate);
    case "month":
      return formatMonthLabel(bucketDate);
    case "quarter":
      return formatQuarterLabel(bucketDate);
    case "year":
      return String(bucketDate.year);
  }
};

export const formatTrendSeries = (
  series: TrendSeries | undefined,
  preset: DashboardRangePreset,
): TrendChartPoint[] => {
  if (!series) return [];

  return series.points.map((point) => ({
    label: formatBucketLabel(point.bucketStart, series.granularity, preset),
    value: point.value,
  }));
};
