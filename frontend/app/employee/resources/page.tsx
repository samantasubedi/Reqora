"use client";
import { useEffect, useState } from "react";
import { LayoutGrid, List } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Filter, { FilterConfig, FilterValues } from "@/components/global/Filter";
import { cn } from "@/lib/utils";
import ResourceStats from "@/app/admin/components/ResourceStats";
import PaginationControls from "@/app/admin/components/PaginationControls";
import { useTableResources } from "@/app/admin/hooks/resourceHooks";
import { resourceType } from "@/app/admin/resources/(with-sidebar)/page";
import EmployeeResourceGrid from "../components/EmployeeResourceGrid";
import EmployeeResourceTable from "../components/EmployeeResourceTable";
import ResourceDetailDialog from "../components/ResourceDetailDialog";
import QuickRequestDialog from "../components/QuickRequestDialog";

type ViewMode = "grid" | "table";

const Page = () => {
  const [view, setView] = useState<ViewMode>("grid");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<resourceType | null>(null);
  const [quickResource, setQuickResource] = useState<resourceType | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const { isLoading, data, isSuccess, isError, refetch } =
    useTableResources({
      searchText: debouncedSearchText,
      filters,
      page: currentPage,
    });

  const typeOptions = [
    ...new Set((data?.allResources ?? []).map((r) => r.type)),
  ].map((type) => ({ label: type, value: type }));

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

  const handleOpenDetail = (resource: resourceType) => {
    setSelected(resource);
    setDetailOpen(true);
  };

  const handleQuickRequest = (resource: resourceType) => {
    setQuickResource(resource);
    setQuickOpen(true);
  };

  const handleSetFilters = (values: FilterValues) => {
    setFilters(values);
    setCurrentPage(1);
  };

  const totalPages = data?.totalPages ?? 1;
  const safePage = Math.min(data?.currentPage ?? 1, totalPages);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Resources</h1>
        <p className="text-sm text-muted-foreground">
          Browse your department&apos;s resources and request what you need.
        </p>
      </div>

      <ResourceStats
        countsByStatus={data?.countsByStatus}
        isLoading={isLoading}
      />

      <Card className="border-border shadow-sm">
        <div className="flex flex-wrap items-center justify-end gap-3 border-b border-border p-3">
          <Input
            placeholder="Search resources..."
            className="w-full bg-background sm:max-w-xs"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Filter filters={tableFilter} setFilters={handleSetFilters} />
          <div className="flex items-center rounded-lg border border-border bg-muted/50 p-1">
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "h-8 w-8 cursor-pointer text-muted-foreground",
                view === "table" && "bg-background text-foreground shadow-sm",
              )}
              onClick={() => setView("table")}
              aria-label="Table view"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "h-8 w-8 cursor-pointer text-muted-foreground",
                view === "grid" && "bg-background text-foreground shadow-sm",
              )}
              onClick={() => setView("grid")}
              aria-label="Card view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          view === "grid" ? (
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-56 animate-pulse rounded-xl border bg-card" />
              ))}
            </div>
          ) : (
            <div className="h-72 animate-pulse rounded-xl border bg-card" />
          )
        ) : isError ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-10 text-center">
            <p className="text-sm font-semibold">Failed to load resources</p>
            <p className="text-sm text-muted-foreground">
              Something went wrong while fetching your department&apos;s
              resources.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : isSuccess && data.allResources ? (
          view === "grid" ? (
            <div className="p-4">
              <EmployeeResourceGrid
                resources={data.allResources}
                onSelect={handleOpenDetail}
                onQuickRequest={handleQuickRequest}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <EmployeeResourceTable
                resources={data.allResources}
                onSelect={handleOpenDetail}
                onQuickRequest={handleQuickRequest}
              />
            </div>
          )
        ) : null}

        {totalPages > 1 && data?.allResources?.length ? (
          <PaginationControls
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        ) : null}
      </Card>

      <ResourceDetailDialog
        resource={selected}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <QuickRequestDialog
        resource={quickResource}
        open={quickOpen}
        onOpenChange={setQuickOpen}
      />
    </div>
  );
};

export default Page;