"use client";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
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
import {
  DUMMY_MY_RESOURCES,
  MyResource,
} from "../components/myResourcesDummyData";

type ViewMode = "grid" | "table";

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
  const [view, setView] = useState<ViewMode>("table");
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [items, setItems] = useState<MyResource[]>(DUMMY_MY_RESOURCES);
  const [releaseTarget, setReleaseTarget] = useState<MyResource | null>(null);
  const [detailTarget, setDetailTarget] = useState<MyResource | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleOpenDetail = (resource: MyResource) => {
    setDetailTarget(resource);
    setDetailOpen(true);
  };

  const typeOptions = [
    ...new Set(items.map((item) => item.type)),
  ].map((type) => ({ label: type, value: type }));

  const departmentOptions = [
    ...new Set(items.map((item) => item.department)),
  ].map((department) => ({ label: department, value: department }));

  const tableFilter: FilterConfig[] = [
    {
      key: "resourceType",
      title: "Type",
      type: "dropdown",
      options: typeOptions,
    },
    {
      key: "resourceDepartment",
      title: "Department",
      type: "dropdown",
      options: departmentOptions,
    },
  ];

  const filtered = useMemo(() => {
    const query = searchText.toLowerCase();
    const typeFilter = filters.resourceType as string | undefined;
    const departmentFilter = filters.resourceDepartment as string | undefined;
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query);
      const matchesType = !typeFilter || item.type === typeFilter;
      const matchesDepartment =
        !departmentFilter || item.department === departmentFilter;
      return matchesSearch && matchesType && matchesDepartment;
    });
  }, [items, searchText, filters]);

  const handleRelease = () => {
    if (!releaseTarget) return;
    setItems((prev) => prev.filter((item) => item.id !== releaseTarget.id));
    toast.success("Resource returned successfully");
    setReleaseTarget(null);
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Resources</h1>
        <p className="text-muted-foreground">
          Resources currently assigned to you.
        </p>
      </div>

      {items.length === 0 ? (
        <Card className="border-border shadow-sm">
          <EmptyState
            icon={PackageX}
            header="No resources assigned to you"
            description="You don&apos;t currently hold any resources. Browse the company inventory and request what you need."
            button={{ text: "Browse Resources", link: "/employee/resources" }}
          />
        </Card>
      ) : (
        <Card className="border-border shadow-sm">
          <div className="flex flex-wrap items-center justify-end gap-3 border-b border-border p-3">
            <Input
              placeholder="Search my resources..."
              className="w-[50%] bg-secondary!"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Filter filters={tableFilter} setFilters={setFilters} />
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

          {filtered.length === 0 ? (
            <EmptyState
              icon={PackageX}
              header="No resources found"
              description="Try adjusting your search or filters."
            />
          ) : view === "table" ? (
            <div className="overflow-x-auto">
              <MyResourcesTable
                resources={filtered}
                onSelect={handleOpenDetail}
                onRelease={setReleaseTarget}
              />
            </div>
          ) : (
            <div className="p-4">
              <MyResourcesGrid
                resources={filtered}
                onSelect={handleOpenDetail}
                onRelease={setReleaseTarget}
              />
            </div>
          )}
        </Card>
      )}

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
              ? It will be released and made available again to your company.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Resource</AlertDialogCancel>
            <AlertDialogAction onClick={handleRelease}>
              Return Resource
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Page;