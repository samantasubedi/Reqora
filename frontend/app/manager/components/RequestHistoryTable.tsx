"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EllipsisVertical, Inbox, PackageSearch } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Filter, { FilterConfig, FilterValues } from "@/components/global/Filter";
import { calculatePages } from "@/lib/HelperFunctions";
import InitialsAvatar from "./InitialsAvatar";
import { formatDate, ResourceRequest } from "./requestsDummyData";

type RequestHistoryTableProps = {
  requests: ResourceRequest[];
};

const PAGE_SIZE = 6;

const resourceTypeOptions = [
  "Laptop",
  "Projector",
  "Vehicle",
  "Printer",
  "Server",
  "Furniture",
].map((type) => ({ label: type, value: type.toLowerCase() }));

const statusBadgeClass: Record<string, string> = {
  approved: "bg-green-500/10 text-green-700 dark:text-green-400",
  rejected: "bg-red-500/10 text-red-700 dark:text-red-400",
};

const RequestHistoryTable = ({ requests }: RequestHistoryTableProps) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  const tableFilter: FilterConfig[] = [
    {
      key: "requestStatus",
      title: "Status",
      type: "dropdown",
      options: [
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ],
    },
    {
      key: "resourceType",
      title: "Resource Type",
      type: "dropdown",
      options: resourceTypeOptions,
    },
  ];

  const query = debouncedSearchText.toLowerCase();
  const statusFilter = filters.requestStatus as string | undefined;
  const typeFilter = filters.resourceType as string | undefined;

  const filtered = requests.filter((request) => {
    const matchesSearch =
      request.employee.name.toLowerCase().includes(query) ||
      request.resource.name.toLowerCase().includes(query) ||
      request.resource.type.toLowerCase().includes(query);
    const matchesStatus =
      !statusFilter || request.status === statusFilter;
    const matchesType =
      !typeFilter || request.resource.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const mappingPages = calculatePages({
    totalPages,
    currentPage: safePage,
  });

  const handleFilterChange = (values: FilterValues) => {
    setFilters(values);
    setCurrentPage(1);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-foreground">
          Review History
        </h2>
        <span className="text-sm text-muted-foreground">
          {filtered.length} reviewed
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2" colSpan={7}>
              <div className="flex justify-end gap-3">
                <Input
                  placeholder="Search by employee or resource"
                  className="w-full bg-secondary! sm:w-72"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <Filter
                  filters={tableFilter}
                  setFilters={handleFilterChange}
                />
              </div>
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Requested</TableHead>
            <TableHead>Reviewed</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {paged.length > 0 ? (
            paged.map((request) => (
              <TableRow
                key={request.id}
                className="cursor-pointer"
                onClick={() => router.push(`/manager/requests/${request.id}`)}
              >
                <TableCell>
                  <div className="flex min-w-0 items-center gap-3">
                    <InitialsAvatar
                      name={request.employee.name}
                      className="size-9"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {request.employee.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {request.employee.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {request.resource.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {request.resource.type}
                    </p>
                  </div>
                </TableCell>
                <TableCell>x{request.requestedQuantity}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(request.createdAt)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(request.reviewedAt)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`capitalize ${statusBadgeClass[request.status] ?? ""}`}
                  >
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <EllipsisVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(`/manager/requests/${request.id}`)
                        }
                      >
                        <PackageSearch className="size-4" />
                        View details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7}>
                <div className="flex min-h-56 w-full flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                  <div className="rounded-full bg-muted p-4">
                    <Inbox className="size-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    No reviewed requests found
                  </h3>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Try adjusting your search or filters.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {filtered.length > PAGE_SIZE && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>
                <div className="flex w-full justify-center gap-2">
                  {mappingPages.map((pageNumber, index) => {
                    if (typeof pageNumber === "string") {
                      return (
                        <span
                          key={`${pageNumber}-${index}`}
                          className="flex h-9 items-center px-2 text-sm text-muted-foreground"
                        >
                          {pageNumber}
                        </span>
                      );
                    }
                    return (
                      <Button
                        key={pageNumber}
                        size="sm"
                        variant={safePage === pageNumber ? "default" : "ghost"}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </section>
  );
};

export default RequestHistoryTable;