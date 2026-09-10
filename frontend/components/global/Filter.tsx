import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ListFilterPlus } from "lucide-react";

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterType = "select" | "dropdown" | "input";

export type FilterConfig = {
  key: string; // becomes the query param key sent to the parent
  title: string;
  type: FilterType;
  options?: FilterOption[]; // required for "select" and "dropdown"
  multiple?: boolean; // only relevant for "select" — checkbox list vs radio group
  placeholder?: string; // used by "input" and "dropdown"
};

// what gets sent to the parent's setter — plain enough for axios/TanStack params
export type FilterValue = string | string[] | undefined;
export type FilterValues = Record<string, FilterValue>;

type FilterProps = {
  filters: FilterConfig[];
  setFilters: (values: FilterValues) => void;
};

const Filter = ({ filters, setFilters }: FilterProps) => {
  const [staged, setStaged] = useState<FilterValues>({});
  const [appliedCount, setAppliedCount] = useState(0);

  const handleSelectToggle = (
    filterKey: string,
    optionValue: string,
    multiple?: boolean,
  ) => {
    setStaged((prev) => {
      if (multiple) {
        const current = (prev[filterKey] as string[]) || [];
        const exists = current.includes(optionValue);
        const next = exists
          ? current.filter((v) => v !== optionValue)
          : [...current, optionValue];
        return { ...prev, [filterKey]: next.length ? next : undefined };
      }
      return {
        ...prev,
        [filterKey]: prev[filterKey] === optionValue ? undefined : optionValue,
      };
    });
  };

  const handleInputChange = (filterKey: string, value: string) => {
    setStaged((prev) => ({ ...prev, [filterKey]: value || undefined }));
  };

  const handleDropdownChange = (filterKey: string, value: string) => {
    setStaged((prev) => ({ ...prev, [filterKey]: value }));
  };

  const handleApply = () => {
    const cleaned = Object.fromEntries(
      Object.entries(staged).filter(
        ([, v]) =>
          v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0),
      ),
    );
    setFilters(cleaned);
    setAppliedCount(Object.keys(cleaned).length);
  };

  const handleReset = () => {
    setStaged({});
    setFilters({});
    setAppliedCount(0);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 bg-secondary!">
          Filters
          <ListFilterPlus className="h-4 w-4" />
          {appliedCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 rounded-full px-1.5 py-0 text-xs"
            >
              {appliedCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-100">
        <div className="flex flex-col gap-4">
          {filters.map((filter) => (
            <div key={filter.key} className="flex flex-col gap-2">
              <span className="text-sm font-medium">{filter.title}</span>

              {filter.type === "select" && filter.multiple && (
                <div className="flex flex-col gap-1.5">
                  {filter.options?.map((option) => {
                    const checked = (
                      (staged[filter.key] as string[]) || []
                    ).includes(option.value);
                    return (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() =>
                            handleSelectToggle(filter.key, option.value, true)
                          }
                        />
                        {option.label}
                      </label>
                    );
                  })}
                </div>
              )}

              {filter.type === "select" && !filter.multiple && (
                <RadioGroup
                  value={(staged[filter.key] as string) || ""}
                  onValueChange={(value) =>
                    handleSelectToggle(filter.key, value, false)
                  }
                  className="flex flex-col gap-1.5"
                >
                  {filter.options?.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <RadioGroupItem value={option.value} />
                      {option.label}
                    </label>
                  ))}
                </RadioGroup>
              )}

              {filter.type === "dropdown" && (
                <Select
                  value={(staged[filter.key] as string) || ""}
                  onValueChange={(value) =>
                    handleDropdownChange(filter.key, value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={filter.placeholder ?? "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {filter.type === "input" && (
                <Input
                  placeholder={filter.placeholder}
                  value={(staged[filter.key] as string) || ""}
                  onChange={(e) =>
                    handleInputChange(filter.key, e.target.value)
                  }
                />
              )}
            </div>
          ))}

          <div className="flex justify-between gap-2 pt-2 border-t">
            <Button variant="destructive" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Filter;
