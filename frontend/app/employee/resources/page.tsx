"use client";
import { useEffect, useState } from "react";
import { LayoutGrid, List } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Filter, { FilterConfig, FilterValues } from "@/components/global/Filter";
import { cn } from "@/lib/utils";
import { calculatePages } from "@/lib/HelperFunctions";
import ResourceStats from "@/app/admin/components/ResourceStats";
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

  const { isLoading, data, isSuccess } = useTableResources({
    searchText: debouncedSearchText,
    filters,
    page: currentPage,
  });

  const typeOptions = [
    ...new Set((data?.allResources ?? []).map((r) => r.type)),
  ].map((type) => ({ label: type, value: type }));

  const departmentOptions = [
    ...new Set(
      (data?.allResources ?? [])
        .map((r) => r.department)
        .filter((d): d is string => Boolean(d)),
    ),
  ].map((department) => ({ label: department, value: department }));

  const tableFilter: FilterConfig[] = [
    {
      key: "resourceTypeSearch",
      title: "Type",
      type: "dropdown",
      options: typeOptions,
    },
    {
      key: "resourceDepartmentSearch",
      title: "Department",
      type: "dropdown",
      options: departmentOptions,
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
  const mappingPages = isSuccess
    ? calculatePages({
        totalPages,
        currentPage: safePage,
      })
    : [];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
        <p className="text-muted-foreground">
          Browse company resources and request what you need.
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
            className="w-[50%] bg-secondary!"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Filter filters={tableFilter} setFilters={handleSetFilters} />
          <div className="flex items-center rounded-lg border border-border bg-muted p-0.5">
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "h-8 w-8 cursor-pointer",
                view === "table" && "bg-background shadow-sm",
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
                "h-8 w-8 cursor-pointer",
                view === "grid" && "bg-background shadow-sm",
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
                <div key={i} className="h-56 rounded-2xl border bg-card animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="h-72 animate-pulse bg-muted/40" />
          )
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

        {totalPages > 1 && (
          <div className="flex w-full justify-center gap-5 border-t border-border p-3">
            {mappingPages.map((pageNumber, index) => (
              <Button
                key={index}
                className={cn(
                  pageNumber === safePage && "border-2! border-foreground!",
                )}
                onClick={() => {
                  if (typeof pageNumber === "number") {
                    setCurrentPage(pageNumber);
                  }
                }}
              >
                {pageNumber}
              </Button>
            ))}
          </div>
        )}
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