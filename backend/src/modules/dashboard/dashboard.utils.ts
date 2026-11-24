import { appError } from "../../utils/appError";

export type TrendGranularity =
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year";

export type TrendPoint = {
  bucketStart: string;
  value: number;
};

export type TrendSeries = {
  granularity: TrendGranularity;
  points: TrendPoint[];
};

export type AnalyticsQuery = {
  from?: Date;
  to?: Date;
  tzOffsetMinutes: number;
  granularity?: TrendGranularity;
};

const TREND_GRANULARITIES: TrendGranularity[] = [
  "day",
  "week",
  "month",
  "quarter",
  "year",
];

const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;

const parseDateParam = (value: unknown, field: string): Date | undefined => {
  if (value === undefined) return undefined;

  if (typeof value !== "string" || value.trim() === "") {
    throw new appError(
      400,
      "INVALID_DATE_RANGE",
      `${field} must be an ISO date string`,
    );
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new appError(
      400,
      "INVALID_DATE_RANGE",
      `${field} must be a valid ISO date string`,
    );
  }

  return date;
};

const parseTimezoneOffset = (value: unknown): number => {
  if (value === undefined) return 0;

  const offset = Number(value);
  if (!Number.isInteger(offset) || offset < -720 || offset > 840) {
    throw new appError(
      400,
      "INVALID_TIMEZONE_OFFSET",
      "tzOffsetMinutes must be an integer between -720 and 840",
    );
  }

  return offset;
};

const parseGranularity = (
  value: unknown,
): TrendGranularity | undefined => {
  if (value === undefined) return undefined;

  if (
    typeof value !== "string" ||
    !TREND_GRANULARITIES.includes(value as TrendGranularity)
  ) {
    throw new appError(
      400,
      "INVALID_GRANULARITY",
      `granularity must be one of: ${TREND_GRANULARITIES.join(", ")}`,
    );
  }

  return value as TrendGranularity;
};

export const parseAnalyticsQuery = (
  query: Record<string, unknown>,
): AnalyticsQuery => {
  const from = parseDateParam(query.from, "from");
  const to = parseDateParam(query.to, "to");
  const tzOffsetMinutes = parseTimezoneOffset(query.tzOffsetMinutes);
  const granularity = parseGranularity(query.granularity);

  if (from && to && from.getTime() > to.getTime()) {
    throw new appError(
      400,
      "INVALID_DATE_RANGE",
      "'from' must be earlier than or equal to 'to'",
    );
  }

  return { from, to, tzOffsetMinutes, granularity };
};

const shiftToLocal = (date: Date, offsetMinutes: number) =>
  new Date(date.getTime() + offsetMinutes * MINUTE_MS);

const pad = (value: number) => String(value).padStart(2, "0");

const formatBucketKey = (date: Date) =>
  `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate(),
  )}`;

const startOfLocalDay = (date: Date) =>
  new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );

const startOfLocalWeek = (date: Date) => {
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() - daysSinceMonday,
    ),
  );
};

const startOfLocalMonth = (date: Date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

const startOfLocalQuarter = (date: Date) =>
  new Date(
    Date.UTC(
      date.getUTCFullYear(),
      Math.floor(date.getUTCMonth() / 3) * 3,
      1,
    ),
  );

const startOfLocalYear = (date: Date) =>
  new Date(Date.UTC(date.getUTCFullYear(), 0, 1));

const getBucketStart = (date: Date, granularity: TrendGranularity) => {
  switch (granularity) {
    case "day":
      return startOfLocalDay(date);
    case "week":
      return startOfLocalWeek(date);
    case "month":
      return startOfLocalMonth(date);
    case "quarter":
      return startOfLocalQuarter(date);
    case "year":
      return startOfLocalYear(date);
  }
};

export const resolveTrendGranularity = (
  from: Date,
  to: Date,
): TrendGranularity => {
  const spanDays = (to.getTime() - from.getTime()) / DAY_MS;

  if (spanDays <= 31) return "day";
  if (spanDays <= 120) return "week";
  if (spanDays <= 730) return "month";
  if (spanDays <= 1825) return "quarter";
  return "year";
};

export const buildTrend = (
  dates: Date[],
  {
    from,
    to,
    tzOffsetMinutes,
    granularity,
  }: {
    from: Date;
    to: Date;
    tzOffsetMinutes: number;
    granularity?: TrendGranularity;
  },
): TrendSeries => {
  const resolvedGranularity =
    granularity ?? resolveTrendGranularity(from, to);
  const localFrom = shiftToLocal(from, tzOffsetMinutes);
  const localTo = shiftToLocal(to, tzOffsetMinutes);
  const buckets = new Map<string, TrendPoint>();

  const addBucket = (date: Date) => {
    const key = formatBucketKey(date);
    if (!buckets.has(key)) buckets.set(key, { bucketStart: key, value: 0 });
  };

  if (resolvedGranularity === "day") {
    const cursor = startOfLocalDay(localFrom);
    const end = startOfLocalDay(localTo);

    while (cursor.getTime() <= end.getTime()) {
      addBucket(cursor);
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
  } else if (resolvedGranularity === "week") {
    const cursor = startOfLocalWeek(localFrom);
    const end = startOfLocalWeek(localTo);

    while (cursor.getTime() <= end.getTime()) {
      addBucket(cursor);
      cursor.setUTCDate(cursor.getUTCDate() + 7);
    }
  } else if (resolvedGranularity === "month") {
    const cursor = startOfLocalMonth(localFrom);
    const end = startOfLocalMonth(localTo);

    while (cursor.getTime() <= end.getTime()) {
      addBucket(cursor);
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }
  } else if (resolvedGranularity === "quarter") {
    const cursor = startOfLocalQuarter(localFrom);
    const end = startOfLocalQuarter(localTo);

    while (cursor.getTime() <= end.getTime()) {
      addBucket(cursor);
      cursor.setUTCMonth(cursor.getUTCMonth() + 3);
    }
  } else {
    const cursor = startOfLocalYear(localFrom);
    const end = startOfLocalYear(localTo);

    while (cursor.getTime() <= end.getTime()) {
      addBucket(cursor);
      cursor.setUTCFullYear(cursor.getUTCFullYear() + 1);
    }
  }

  for (const date of dates) {
    const localDate = shiftToLocal(date, tzOffsetMinutes);
    const bucketStart = getBucketStart(localDate, resolvedGranularity);
    const bucket = buckets.get(formatBucketKey(bucketStart));
    if (bucket) bucket.value += 1;
  }

  return {
    granularity: resolvedGranularity,
    points: [...buckets.values()],
  };
};
