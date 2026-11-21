"use client";
import { useEffect, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import ResourceStats from "@/app/admin/components/ResourceStats";
import PaginationControls from "@/app/admin/components/PaginationControls";
import { TableError } from "@/app/admin/components/TableError";
import { Input } from "@/components/ui/input";
import Filter, { FilterConfig, FilterValues } from "@/components/global/Filter";
import { cn } from "@/lib/utils";
import ResourceGrid from "../components/ResourceGrid";
import ResourceTableView from "../components/ResourceTableView";
import ResourceDetailModal from "../components/ResourceDetailModal";
import { useManagerResources } from "../hooks/resourceHooks";
import type { ManagerResource } from "../apis/types";

type ViewMode = "grid" | "table";

const PAGE_SIZE = 12;

const Page = () => {
  const [view, setView] = useState<ViewMode>("grid");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<ManagerResource | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText.trim());
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const { data, isLoading, isError, refetch } = useManagerResources({
    search: debouncedSearchText || undefined,
    resourceTypeSearch: filters.resourceTypeSearch as string | undefined,
    availability: filters.availability as "inStock" | "outOfStock" | undefined,
    page: currentPage,
    limit: PAGE_SIZE,
  });

  const resources = data?.allResources ?? [];
  const totalPages = data?.totalPages ?? 1;
  const safePage = Math.min(data?.currentPage ?? 1, totalPages);

  const typeOptions = (data?.countsByType ?? []).map((item) => ({
    label: item.type,
    value: item.type,
  }));

  const tableFilter: FilterConfig[] = [
    {
      key: "resourceTypeSearch",
      title: "Type",
      type: "dropdown",
      options: typeOptions,
    },
    {
      key: "availability",
      title: "Availability",
      type: "dropdown",
      options: [
        { label: "In stock", value: "inStock" },
        { label: "Out of stock", value: "outOfStock" },
      ],
    },
  ];

  const handleSetFilters = (values: FilterValues) => {
    setFilters(values);
    setCurrentPage(1);
  };

  const openResource = (resource: ManagerResource) => {
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

      {isError && !data ? (
        <TableError
          title="Unable to load resources"
          message="We couldn't load your department's resources. Check your connection and try again."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <ResourceStats
            countsByStatus={data?.countsByStatus}
            isLoading={isLoading}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-3">
              <Input
                placeholder="Search by resource name"
                className="w-full bg-secondary! sm:max-w-sm"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Filter filters={tableFilter} setFilters={handleSetFilters} />
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

          {isLoading ? (
            view === "grid" ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-56 animate-pulse rounded-2xl border bg-card"
                  />
                ))}
              </div>
            ) : (
              <div className="h-72 animate-pulse rounded-xl border bg-card" />
            )
          ) : view === "grid" ? (
            <ResourceGrid resources={resources} onSelect={openResource} />
          ) : (
            <div className="overflow-x-auto rounded-xl border bg-card">
              <ResourceTableView
                resources={resources}
                onSelect={openResource}
              />
            </div>
          )}

          {!isLoading && totalPages > 1 && resources.length > 0 && (
            <PaginationControls
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
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
