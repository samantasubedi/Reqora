"use client";

import { ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Filter, {
  FilterConfig,
  FilterValues,
} from "@/components/global/Filter";

type TableToolbarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  setFilters?: (values: FilterValues) => void;
  actions?: ReactNode;
};

export default function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  setFilters,
  actions,
}: TableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-2">
        {filters && setFilters && (
          <Filter filters={filters} setFilters={setFilters} />
        )}
        {actions}
      </div>
    </div>
  );
}
