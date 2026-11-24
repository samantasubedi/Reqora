"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import {
  formatCustomRange,
  type DashboardDateRange,
  type DashboardRangePreset,
} from "./dateRange";

const presets: Array<{ value: DashboardRangePreset; label: string }> = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
  { value: "all", label: "All time" },
];

const tabClassName = (active: boolean) =>
  cn(
    "cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
    active
      ? "bg-background text-foreground shadow-sm"
      : "text-muted-foreground hover:text-foreground",
  );

type DashboardRangeFilterProps = {
  preset: DashboardRangePreset;
  customRange?: DashboardDateRange;
  isCustomOpen: boolean;
  onCustomOpenChange: (open: boolean) => void;
  onSelectPreset: (preset: DashboardRangePreset) => void;
  onSelectCustomRange: (range: DashboardDateRange) => void;
  onClearCustomRange: () => void;
};

export const DashboardRangeFilter = ({
  preset,
  customRange,
  isCustomOpen,
  onCustomOpenChange,
  onSelectPreset,
  onSelectCustomRange,
  onClearCustomRange,
}: DashboardRangeFilterProps) => {
  const today = new Date();
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(
    customRange,
  );

  const handleOpenChange = (open: boolean) => {
    if (open) setDraftRange(customRange);
    onCustomOpenChange(open);
  };

  const draftFrom = draftRange?.from;
  const draftTo = draftRange?.to;
  const canApply = Boolean(draftFrom && draftTo);

  const handleApply = () => {
    if (!draftFrom || !draftTo) return;
    onSelectCustomRange({ from: draftFrom, to: draftTo });
  };

  return (
    <div
      role="group"
      aria-label="Date range"
      className="inline-flex flex-wrap items-center gap-1 rounded-lg border bg-muted p-1"
    >
      {presets.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={preset === option.value}
          onClick={() => onSelectPreset(option.value)}
          className={tabClassName(preset === option.value)}
        >
          {option.label}
        </button>
      ))}

      <Popover open={isCustomOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-pressed={preset === "custom"}
            className={cn(
              tabClassName(preset === "custom"),
              "inline-flex items-center gap-1",
            )}
          >
            Custom
            <ChevronDown className="size-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
          <div className="flex items-center justify-between gap-4 border-b px-3 py-2">
            <span className="text-sm font-medium">Custom range</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label="Close custom date range"
              onClick={() => onCustomOpenChange(false)}
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="max-w-[calc(100vw-2rem)] overflow-x-auto">
            <Calendar
              mode="range"
              selected={draftRange}
              onSelect={(range) => {
                setDraftRange(range);
              }}
              numberOfMonths={2}
              defaultMonth={
                customRange?.from ??
                new Date(today.getFullYear(), today.getMonth() - 1, 1)
              }
              disabled={{ after: today }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t p-3">
            <span className="text-sm text-muted-foreground">
              {draftFrom && draftTo
                ? formatCustomRange({ from: draftFrom, to: draftTo })
                : draftFrom
                  ? "Select an end date"
                  : "Select a start and end date"}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDraftRange(undefined);
                  onClearCustomRange();
                }}
                disabled={!draftFrom && !customRange}
              >
                Clear
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleApply}
                disabled={!canApply}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
