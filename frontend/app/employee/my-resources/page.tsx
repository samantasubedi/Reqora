"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutGrid, List, PackageX, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Filter, { FilterConfig, FilterValues } from "@/components/global/Filter";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import MyResourcesTable from "../components/MyResourcesTable";
import MyResourcesGrid from "../components/MyResourcesGrid";
import MyResourceDetailModal from "../components/MyResourceDetailModal";
import { useMyItems, useReleaseItem } from "../hooks/requestHooks";
import type { MyResourceItem } from "../apis/types";

type ViewMode = "grid" | "table";

const STATUS_OPTIONS = [
  { label: "In use", value: "inUse" },
  { label: "Under maintenance", value: "underMaintenance" },
];

const EmptyState = ({
  icon: Icon,
  header,
  description,
  button,
}: {
  icon: typeof PackageX;
  header: string;
  description: string;
  button?: { text: string; link: string };
}) => {
  const router = useRouter();
  return (
    <div className="flex min-h-64 w-full flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <div className="rounded-full bg-muted p-4">
        <Icon className="size-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground">{header}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {button && (
        <Button className="mt-2 gap-2" onClick={() => router.push(button.link)}>
          <Plus className="size-4" />
          {button.text}
        </Button>
      )}
    </div>
  );
};

const Page = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [view, setView] = useState<ViewMode>("table");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [releaseTarget, setReleaseTarget] = useState<MyResourceItem | null>(
    null,
  );
  const [detailTarget, setDetailTarget] = useState<MyResourceItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const typeFilter = filters.resourceType as string | undefined;
  const statusFilter = filters.resourceStatus as string | undefined;

  const { data, isLoading, isError, refetch } = useMyItems({
    search: debouncedSearch || undefined,
    type: typeFilter || undefined,
    status: statusFilter || undefined,
  });

  const items = useMemo(() => data?.data ?? [], [data]);

  const typeOptions = useMemo(
    () =>
      [...new Set(items.map((item) => item.type))].map((type) => ({
        label: type,
        value: type,
      })),
    [items],
  );

  const tableFilter: FilterConfig[] = useMemo(
    () => [
      {
        key: "resourceType",
        title: "Type",
        type: "dropdown",
        options: typeOptions,
      },
      {
        key: "resourceStatus",
        title: "Status",
        type: "dropdown",
        options: STATUS_OPTIONS,
      },
    ],
    [typeOptions],
  );

  const releaseMutation = useReleaseItem();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["myItems"] });
    queryClient.invalidateQueries({ queryKey: ["tableResourceData"] });
    queryClient.invalidateQueries({ queryKey: ["resourceDetails"] });
  };

  const handleOpenDetail = (resource: MyResourceItem) => {
    setDetailTarget(resource);
    setDetailOpen(true);
  };

  const handleSetFilters = (values: FilterValues) => {
    setFilters(values);
  };

  const hasActiveQuery =
    debouncedSearch !== "" || !!typeFilter || !!statusFilter;

  const handleRelease = () => {
    if (!releaseTarget) return;
    releaseMutation.mutate(releaseTarget.id, {
      onSuccess: (res) => {
        toast.success(res.message ?? "Resource returned successfully");
        setReleaseTarget(null);
        invalidate();
      },
      onError: (err) => {
        toast.error(err.response?.data?.message ?? "Failed to return");
      },
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return view === "table" ? (
        <div className="space-y-2 p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 w-full animate-pulse rounded-xl border bg-card"
            />
          ))}
        </div>
      ) : (
        <div className="p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-xl border bg-card"
              />
            ))}
          </div>
        </div>
      );
    }
    if (isError) {
      return (
        <EmptyState
          icon={PackageX}
          header="Couldn't load your resources"
          description="Something went wrong while fetching your assigned items. Please try again."
        />
      );
    }
    if (items.length === 0 && !hasActiveQuery) {
      return (
        <EmptyState
          icon={PackageX}
          header="No resources assigned to you"
          description="You don't currently hold any resources. Approved requests will show up here — browse the inventory and request what you need."
          button={{ text: "Browse Resources", link: "/employee/resources" }}
        />
      );
    }
    if (items.length === 0) {
      return (
        <EmptyState
          icon={PackageX}
          header="No matching resources"
          description="None of your assigned items match this search or filter combination. Try clearing them to see everything assigned to you."
        />
      );
    }
    return view === "table" ? (
      <div className="overflow-x-auto">
        <MyResourcesTable
          resources={items}
          onSelect={handleOpenDetail}
          onRelease={setReleaseTarget}
        />
      </div>
    ) : (
      <div className="p-4">
        <MyResourcesGrid
          resources={items}
          onSelect={handleOpenDetail}
          onRelease={setReleaseTarget}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">My Resources</h1>
          <p className="text-sm text-muted-foreground">
            Resources currently assigned to you.
          </p>
        </div>
        <Button
          size="lg"
          className="gap-2 shadow-sm cursor-pointer"
          onClick={() => router.push("/employee/resources")}
        >
          <Plus className="h-4 w-4" /> Request New Resource
        </Button>
      </div>

      <Card className="border-border shadow-sm">
        <div className="flex flex-wrap items-center justify-end gap-3 border-b border-border p-3">
          <Input
            placeholder="Search my resources..."
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

        {renderContent()}
        {isError && (
          <div className="flex justify-center border-t border-border p-4">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}
      </Card>

      <MyResourceDetailModal
        resource={detailTarget}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onRelease={(resource) => {
          setDetailOpen(false);
          setReleaseTarget(resource);
        }}
      />

      <AlertDialog
        open={!!releaseTarget}
        onOpenChange={(open) => {
          if (!open) setReleaseTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Return this resource?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to return{" "}
              <span className="font-semibold text-foreground">
                {releaseTarget?.name}
              </span>
              ? It will be released immediately and made available again to
              your department.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Resource</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/80 cursor-pointer"
              disabled={releaseMutation.isPending}
              onClick={handleRelease}
            >
              {releaseMutation.isPending ? "Returning…" : "Return Resource"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Page;
