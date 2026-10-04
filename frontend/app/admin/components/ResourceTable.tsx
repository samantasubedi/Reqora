import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Delete,
  Edit,
  EllipsisVertical,
  PackageX,
  Plus,
  View,
} from "lucide-react";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import TableEmpty, { tableEmptyType } from "./emptyStates/TableEmpty";
import { TableSkeleton } from "./skeletonLoaders/TableSkeleton";
import { TableError } from "./TableError";
import { useTableResources } from "../hooks/resourceHooks";
import { FilterConfig, FilterValues } from "@/components/global/Filter";
import { resourceType } from "../resources/(with-sidebar)/page";
import { Progress } from "@/components/ui/progress";
import TablePaginationFooter from "./TablePaginationFooter";
import TableToolbar from "./ui/TableToolbar";

export const ResourceTable = () => {
  const router = useRouter();
  const defaultTableFields: {
    label: string;
    key: keyof resourceType;
    render: (resource: resourceType) => React.ReactNode;
  }[] = [
    {
      label: "ID",
      key: "id",
      render: (resource) => {
        return resource.id;
      },
    },
    {
      label: "Resource Name",
      key: "name",
      render: (resource) => {
        return resource.name;
      },
    },
    {
      label: "Type",
      key: "type",
      render: (resource) => {
        return resource.type;
      },
    },
    {
      label: "Department",
      key: "department",
      render: (resource) => {
        return resource.department;
      },
    },
    {
      label: "Location",
      key: "location",
      render: (resource) => {
        return resource.location;
      },
    },
    {
      label: "Availability",
      key: "availability",
      render: (resource) => {
        const percentage =
          resource.totalQuantity > 0
            ? (resource.availableQuantity / resource.totalQuantity) * 100
            : 0;
        return (
          <div className="flex items-center gap-2 min-w-32">
            <Progress value={percentage} className="flex-1" />
            <span className="w-10 text-right text-xs text-muted-foreground">
              {percentage.toFixed(0)}%
            </span>
          </div>
        );
      },
    },
  ];

  const [tableFields, setTableFields] = useState<
    {
      label: string;
      key: keyof resourceType;
      render: (resource: resourceType) => React.ReactNode;
    }[]
  >(defaultTableFields);
  const tableEmptyProps: tableEmptyType = {
    colSpan: tableFields.length + 1,
    header: "No resources found !",
    headerIcon: PackageX,

    button: {
      buttonText: "Add Resource",
      link: "/admin/resources/add",
      buttonIcon: Plus,
    },
  };

  const handleTableField = (fieldKey: string) => {
    let newFields;
    const fieldExists = tableFields.some((cur) => {
      return cur.key == fieldKey;
    });
    if (fieldExists) {
      newFields = tableFields.filter((cur) => {
        return cur.key !== fieldKey;
      });
    } else {
      const newUnorderedTableFieldsKeys = [
        ...tableFields.map((cur) => {
          return cur.key;
        }),
        fieldKey,
      ];
      newFields = defaultTableFields.filter((cur) =>
        newUnorderedTableFieldsKeys.includes(cur.key),
      );
    }
    if (newFields) {
      setTableFields(newFields);
    }
  };
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);
  const [filters, setFilters] = useState<FilterValues>({});
  const tableFilter: FilterConfig[] = [
    {
      key: "resourceTypeSearch",
      title: "Type",
      type: "input",
      placeholder: "Search by resource type",
    },
    {
      key: "resourceDepartmentSearch",
      title: "Department",
      type: "input",
      placeholder: "Search by resource department",
    },
    {
      key: "resourceAvailableQuantity",
      title: "Available Quantity",
      type: "input",
      placeholder: "Min available quantity",
    },
  ];

  const [currentPage, setCurrentPage] = useState<number>(1);
  const { isLoading, data, isSuccess, isError, refetch } = useTableResources({
    searchText: debouncedSearchText,
    filters,
    page: currentPage,
  });

  const columnToggle = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Icon icon="eva:options-2-fill" className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-1.5">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Table Columns
          </DropdownMenuLabel>

          <button
            type="button"
            disabled={tableFields.length === defaultTableFields.length}
            onClick={() => setTableFields(defaultTableFields)}
            className="flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <Icon
              icon="eva:refresh-outline"
              className="h-3.5 w-3.5"
            />
            Reset
          </button>
        </div>

        <DropdownMenuSeparator className="mb-1" />

        {defaultTableFields.map((cur) => {
          const isChecked = tableFields.some(
            (curField) => cur.key === curField.key,
          );
          return (
            <DropdownMenuCheckboxItem
              key={cur.key}
              checked={isChecked}
              onClick={() => handleTableField(cur.key)}
              onSelect={(e) => e.preventDefault()}
              className="relative flex items-center gap-2 rounded-md py-1.5 pl-8 pr-2 text-sm focus:bg-muted"
            >
              <span
                className={cn(
                  "absolute left-2 flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors",
                  isChecked
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-transparent",
                )}
              >
                {isChecked && (
                  <Icon icon="eva:checkmark-fill" className="h-3 w-3" />
                )}
              </span>
              <span className={cn(!isChecked && "text-muted-foreground")}>
                {cur.label}
              </span>
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <TableToolbar
          searchValue={searchText}
          onSearchChange={setSearchText}
          searchPlaceholder="Search by resource name"
          filters={tableFilter}
          setFilters={setFilters}
          actions={columnToggle}
        />
        {isError ? (
          <TableError onRetry={() => refetch()} />
        ) : (
          <Table>
          <TableHeader>
            <TableRow>
              {tableFields.map((cur) => (
                <TableHead key={cur.key}>{cur.label}</TableHead>
              ))}
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableSkeleton columnCount={tableFields.length + 1} />
          ) : (
            <TableBody>
              {isSuccess && data.allResources.length ? (
                data.allResources.map((resource) => {
                  return (
                    <TableRow
                      key={resource.id}
                      className="cursor-pointer"
                      onClick={() =>
                        router.push(`/admin/resources/${resource.id}`)
                      }
                    >
                      {tableFields.map((field) => {
                        return (
                          <TableCell key={field.key}>
                            {field.render(resource)}
                          </TableCell>
                        );
                      })}

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <EllipsisVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => {
                                router.push(`/admin/resources/${resource.id}`);
                              }}
                            >
                              <View className="text-muted-foreground" /> View
                              details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() =>
                                router.push(`/admin/resources/edit/${resource.id}`)
                              }
                            >
                              <Edit className="text-muted-foreground" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                              <Delete className="text-destructive" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableEmpty {...tableEmptyProps} />
              )}
            </TableBody>
          )}
          {isSuccess && data.allResources.length && data.totalPages > 1 && (
            <TablePaginationFooter
              colSpan={tableFields.length + 1}
              currentPage={data.currentPage}
              totalPages={data.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
