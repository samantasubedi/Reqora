"use client";

import { useMemo, useState } from "react";

import {
  buildRangeParams,
  type DashboardDateRange,
  type DashboardRangePreset,
} from "./dateRange";

export const useDashboardRange = (
  initialPreset: DashboardRangePreset = "month",
) => {
  const [preset, setPreset] = useState<DashboardRangePreset>(initialPreset);
  const [customRange, setCustomRange] = useState<DashboardDateRange>();
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const params = useMemo(
    () => buildRangeParams(preset, customRange),
    [preset, customRange],
  );

  const selectPreset = (nextPreset: DashboardRangePreset) => {
    if (nextPreset === "custom") {
      setIsCustomOpen(true);
      return;
    }

    setIsCustomOpen(false);
    setPreset(nextPreset);
  };

  const selectCustomRange = (range: DashboardDateRange) => {
    setCustomRange(range);
    setPreset("custom");
    setIsCustomOpen(false);
  };

  const clearCustomRange = () => {
    setCustomRange(undefined);
    setIsCustomOpen(false);
    setPreset(initialPreset);
  };

  return {
    preset,
    customRange,
    params,
    isCustomOpen,
    setIsCustomOpen,
    selectPreset,
    selectCustomRange,
    clearCustomRange,
  };
};
