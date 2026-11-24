import type { TrendGranularity } from "../../apis/companyApi";

export type DashboardRangePreset =
  | "week"
  | "month"
  | "year"
  | "all"
  | "custom";

export type DashboardDateRange = {
  from: Date;
  to: Date;
};

export type DashboardRangeParams = {
  from?: string;
  to: string;
  tzOffsetMinutes: number;
  granularity?: TrendGranularity;
};

export const startOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const endOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

export const startOfWeek = (date: Date) => {
  const result = startOfDay(date);
  result.setDate(result.getDate() - result.getDay());
  return result;
};

export const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

export const startOfYear = (date: Date) =>
  new Date(date.getFullYear(), 0, 1);

export const endOfWeek = (date: Date) => {
  const result = startOfWeek(date);
  result.setDate(result.getDate() + 6);
  return endOfDay(result);
};

export const endOfMonth = (date: Date) =>
  endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));

export const endOfYear = (date: Date) =>
  endOfDay(new Date(date.getFullYear(), 11, 31));

const getTimezoneOffsetMinutes = (date: Date) => -date.getTimezoneOffset();

export const buildRangeParams = (
  preset: DashboardRangePreset,
  customRange?: DashboardDateRange,
): DashboardRangeParams | null => {
  const now = new Date();

  if (preset === "custom") {
    if (!customRange) return null;

    return {
      from: startOfDay(customRange.from).toISOString(),
      to: endOfDay(customRange.to).toISOString(),
      tzOffsetMinutes: getTimezoneOffsetMinutes(customRange.from),
    };
  }

  if (preset === "all") {
    return {
      to: endOfDay(now).toISOString(),
      tzOffsetMinutes: getTimezoneOffsetMinutes(now),
    };
  }

  const range: {
    from: Date;
    to: Date;
    granularity: TrendGranularity;
  } =
    preset === "week"
      ? { from: startOfWeek(now), to: endOfWeek(now), granularity: "day" }
      : preset === "month"
        ? { from: startOfMonth(now), to: endOfMonth(now), granularity: "day" }
        : { from: startOfYear(now), to: endOfYear(now), granularity: "month" };

  return {
    from: range.from.toISOString(),
    to: range.to.toISOString(),
    tzOffsetMinutes: getTimezoneOffsetMinutes(range.from),
    granularity: range.granularity,
  };
};

const formatShortDate = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const formatCustomRange = (range: DashboardDateRange) => {
  const from = formatShortDate(range.from);
  const to = formatShortDate(range.to);
  const fromYear = range.from.getFullYear();
  const toYear = range.to.getFullYear();

  if (fromYear === toYear) {
    return `${from} – ${to}, ${toYear}`;
  }

  return `${from}, ${fromYear} – ${to}, ${toYear}`;
};

export const formatRangeSummary = (
  preset: DashboardRangePreset,
  customRange?: DashboardDateRange,
) => {
  switch (preset) {
    case "week":
      return "This week";
    case "month":
      return "This month";
    case "year":
      return "This year";
    case "all":
      return "All time";
    case "custom":
      return customRange ? formatCustomRange(customRange) : "Custom range";
  }
};
