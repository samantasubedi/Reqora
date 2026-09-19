"use client";
import { useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  LayoutGrid,
  List,
  Package,
  TrendingUp,
} from "lucide-react";
import StatCard from "@/app/admin/components/StatCard";
import { statCardInterface } from "@/app/admin/components/ResourceStats";
import { Input } from "@/components/ui/input";
import Filter, { FilterConfig, FilterValues } from "@/components/global/Filter";
import { cn } from "@/lib/utils";
import ResourceGrid from "../components/ResourceGrid";
import ResourceTableView from "../components/ResourceTableView";
import ResourceDetailModal from "../components/ResourceDetailModal";
import {
  DUMMY_RESOURCES,
  getAvailabilityLevel,
  getResourceCounts,
  Resource,
} from "../components/resourcesDummyData";

type ViewMode = "grid" | "table";

const summaryCounts = DUMMY_RESOURCES.reduce(
  (acc, resource) => {
    const counts = getResourceCounts(resource.items);
    acc.total += counts.total;
    acc.available += counts.available;
    acc.inUse += counts.inUse;
    acc.underMaintenance += counts.underMaintenance;
    return acc;
  },
  { total: 0, available: 0, inUse: 0, underMaintenance: 0 },
);

const statConfig: Omit<statCardInterface, "number">[] = [
  {
    title: "Total Resources",
    IconName: Package,
    subtext: "Across your department",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    borderColor: "border-blue-500",
  },
  {
    title: "Available",
    IconName: CheckCircle2,
    subtext: `${((summaryCounts.available / summaryCounts.total) * 100).toFixed(1)}% of total`,
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-500",
  },
  {
    title: "In Use",
    IconName: TrendingUp,
    subtext: `${((summaryCounts.inUse / summaryCounts.total) * 100).toFixed(1)}% of total`,
    bgColor: "bg-amber-100",
    textColor: "text-amber-800",
    borderColor: "border-amber-500",
  },
  {
    title: "Under Maintenance",
    IconName: CircleAlert,
    subtext: `${((summaryCounts.underMaintenance / summaryCounts.total) * 100).toFixed(1)}% of total`,
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    borderColor: "border-red-500",
  },
];

const statValues = [
  summaryCounts.total,
  summaryCounts.available,
  summaryCounts.inUse,
  summaryCounts.underMaintenance,
];

const typeOptions = [
  ...new Set(DUMMY_RESOURCES.map((resource) => resource.type)),
].map((type) => ({ label: type, value: type.toLowerCase() }));

const availabilityOptions = [
  { label: "Available", value: "available" },
  { label: "Low stock", value: "low" },
  { label: "Out of stock", value: "out" },
];

const Page = () => {
  const [view, setView] = useState<ViewMode>("grid");
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [selected, setSelected] = useState<Resource | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const tableFilter: FilterConfig[] = [
    {
      key: "resourceType",
      title: "Type",
      type: "dropdown",
      options: typeOptions,
    },
    {
      key: "availability",
      title: "Availability",
      type: "dropdown",
      options: availabilityOptions,
    },
  ];

  const query = searchText.toLowerCase();
  const typeFilter = filters.resourceType as string | undefined;
  const availabilityFilter = filters.availability as string | undefined;

  const filtered = DUMMY_RESOURCES.filter((resource) => {
    const counts = getResourceCounts(resource.items);
    const matchesSearch =
      resource.name.toLowerCase().includes(query) ||
      resource.type.toLowerCase().includes(query) ||
      resource.location.toLowerCase().includes(query);
    const matchesType =
      !typeFilter || resource.type.toLowerCase() === typeFilter;
    const matchesAvailability =
      !availabilityFilter ||
      getAvailabilityLevel(counts.available, counts.total) ===
        availabilityFilter;
    return matchesSearch && matchesType && matchesAvailability;
  });

  const openResource = (resource: Resource) => {
    setSelected(resource);
    setSheetOpen(true);
  };

  return (
    <div className="w-full space-y-6 pb-8">
      <div>
        <h1 className="text-4xl font-bold text-primary">Resources</h1>
        <p className="mt-1 text-muted-foreground">
          Check availability across your department before approving requests.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statConfig.map((config, index) => (
          <StatCard key={config.title} {...config} number={statValues[index]} />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <Input
            placeholder="Search by name, type or location"
            className="w-full bg-secondary! sm:max-w-sm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Filter filters={tableFilter} setFilters={setFilters} />
        </div>

        <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-1">
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-label="Card view"
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              view === "grid"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <LayoutGrid className="size-4" />
            <span className="hidden sm:inline">Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setView("table")}
            aria-label="Table view"
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              view === "table"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <List className="size-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <ResourceGrid resources={filtered} onSelect={openResource} />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <ResourceTableView resources={filtered} onSelect={openResource} />
        </div>
      )}

      <ResourceDetailModal
        resource={selected}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
};

export default Page;