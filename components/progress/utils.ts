import { ProgressHistoryPoint } from "@/types";

export type ProgressRange = "7d" | "30d" | "all";
export type ProgressMetric = "xp" | "accuracy" | "questions";

export interface ChartPoint {
  dateKey: string;
  label: string;
  value: number;
}

interface DerivedDailySeries {
  xpDaily: ChartPoint[];
  questionsDaily: ChartPoint[];
  accuracyDaily: ChartPoint[];
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function normalizeHistory(history: ProgressHistoryPoint[]) {
  return [...history].sort((a, b) => a.dateKey.localeCompare(b.dateKey));
}

function makeZeroPoint(dateKey: string): ProgressHistoryPoint {
  return {
    dateKey,
    totalXP: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    dayStreak: 0,
  };
}

function rangeDays(range: ProgressRange) {
  if (range === "7d") return 7;
  if (range === "30d") return 30;
  return null;
}

function createFallbackRange(range: ProgressRange): ProgressHistoryPoint[] {
  const today = new Date();
  const days = rangeDays(range);
  if (days === null) {
    return [makeZeroPoint(toDateKey(today))];
  }

  return Array.from({ length: days }).map((_, index) => {
    const date = addDays(today, index - (days - 1));
    return makeZeroPoint(toDateKey(date));
  });
}

export function buildDateRange(history: ProgressHistoryPoint[], range: ProgressRange) {
  const sorted = normalizeHistory(history);
  if (sorted.length === 0) {
    return createFallbackRange(range);
  }

  if (range === "all") {
    return sorted;
  }

  const days = rangeDays(range) ?? 7;
  const endDate = fromDateKey(sorted[sorted.length - 1].dateKey);
  const startDate = addDays(endDate, -(days - 1));
  const startKey = toDateKey(startDate);
  const endKey = toDateKey(endDate);

  const inRange = sorted.filter((point) => point.dateKey >= startKey && point.dateKey <= endKey);
  const baseline =
    [...sorted].reverse().find((point) => point.dateKey < startKey) ?? makeZeroPoint(startKey);

  const nextRange = [...inRange];
  if (!nextRange.some((point) => point.dateKey === startKey)) {
    nextRange.unshift({ ...baseline, dateKey: startKey });
  }

  const lastPoint = nextRange[nextRange.length - 1] ?? baseline;
  if (!nextRange.some((point) => point.dateKey === endKey)) {
    nextRange.push({ ...lastPoint, dateKey: endKey });
  }

  return normalizeHistory(nextRange);
}

export function fillMissingDays(points: ProgressHistoryPoint[]) {
  if (points.length === 0) return [];
  const sorted = normalizeHistory(points);

  const result: ProgressHistoryPoint[] = [];
  let cursor = fromDateKey(sorted[0].dateKey);
  const end = fromDateKey(sorted[sorted.length - 1].dateKey);
  let sourceIndex = 0;
  let lastKnown = sorted[0];

  while (cursor.getTime() <= end.getTime() + 1) {
    const key = toDateKey(cursor);
    const current = sorted[sourceIndex];

    if (current && current.dateKey === key) {
      lastKnown = current;
      result.push(current);
      sourceIndex += 1;
    } else {
      result.push({
        ...lastKnown,
        dateKey: key,
      });
    }

    cursor = new Date(cursor.getTime() + MS_PER_DAY);
  }

  return result;
}

function makeSeriesPoint(dateKey: string, value: number): ChartPoint {
  return {
    dateKey,
    label: dateKey,
    value,
  };
}

export function deriveDailySeries(points: ProgressHistoryPoint[]): DerivedDailySeries {
  if (points.length === 0) {
    return {
      xpDaily: [],
      questionsDaily: [],
      accuracyDaily: [],
    };
  }

  const sorted = normalizeHistory(points);

  const xpDaily: ChartPoint[] = [];
  const questionsDaily: ChartPoint[] = [];
  const accuracyDaily: ChartPoint[] = [];

  sorted.forEach((point, index) => {
    const previous = index > 0 ? sorted[index - 1] : point;
    const xpDelta = Math.max(0, point.totalXP - previous.totalXP);
    const answeredDelta = Math.max(0, point.questionsAnswered - previous.questionsAnswered);
    const correctDelta = Math.max(0, point.correctAnswers - previous.correctAnswers);
    const accuracy = answeredDelta > 0 ? Math.round((correctDelta / answeredDelta) * 100) : 0;

    xpDaily.push(makeSeriesPoint(point.dateKey, xpDelta));
    questionsDaily.push(makeSeriesPoint(point.dateKey, answeredDelta));
    accuracyDaily.push(makeSeriesPoint(point.dateKey, accuracy));
  });

  return {
    xpDaily,
    questionsDaily,
    accuracyDaily,
  };
}

export function computeTrend(series: ChartPoint[]) {
  if (series.length === 0) {
    return {
      current: 0,
      previous: 0,
      delta: 0,
      percentDelta: 0,
      direction: "flat" as const,
    };
  }

  const current = series[series.length - 1]?.value ?? 0;
  const previous = series.length > 1 ? series[series.length - 2]?.value ?? 0 : 0;
  const delta = current - previous;
  const percentDelta =
    previous === 0 ? (current === 0 ? 0 : 100) : Math.round((delta / Math.abs(previous)) * 100);

  return {
    current,
    previous,
    delta,
    percentDelta,
    direction: delta > 0 ? ("up" as const) : delta < 0 ? ("down" as const) : ("flat" as const),
  };
}

export function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function formatPercent(value: number) {
  return `${clampPercent(value)}%`;
}

export function formatDelta(value: number) {
  if (value > 0) return `+${value}`;
  if (value < 0) return `${value}`;
  return "0";
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: value < 1000 ? 0 : 1,
  }).format(value);
}

export function formatDateLabel(dateKey: string, range: ProgressRange) {
  const date = fromDateKey(dateKey);
  if (range === "all") {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
  }

  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
}

export function withRangeLabels(series: ChartPoint[], range: ProgressRange) {
  return series.map((point) => ({
    ...point,
    label: formatDateLabel(point.dateKey, range),
  }));
}
