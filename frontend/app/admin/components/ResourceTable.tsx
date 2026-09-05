import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Delete, Edit, EllipsisVertical, View } from "lucide-react";
import {
  ResourceStatus,
  resourceType,
  tableResourceType,
} from "./AdminDashboard";
import { Badge } from "@/components/ui/badge";
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

export const ResourceTable = ({
  resourceData,
}: {
  resourceData: resourceType[];
}) => {
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
      label: "Status",
      key: "status",
      render: (resource) => {
        return <Badge variant={"outline"}>{resource.status}</Badge>;
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
      label: "Availabitly",
      key: "availability",
      render: (resource) => {
        return (
          <span>
            {(resource.availableQuantity / resource.totalQuantity) * 100}%
          </span>
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

  return (
    <div className="mt-5 px-3">
      <Table>
        <TableHeader>
          <TableRow>
            {tableFields.map((cur) => (
              <TableHead key={cur.key}>{cur.label}</TableHead>
            ))}
            <TableHead>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 border-border/60 hover:bg-muted/60"
                  >
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
                      disabled={
                        tableFields.length === defaultTableFields.length
                      }
                      onClick={() => setTableFields(defaultTableFields)}
                      className="flex text-text-danger  items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                    >
                      <Icon
                        icon="eva:refresh-outline"
                        className="h-3.5 w-3.5 font-bold"
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
                            <Icon
                              icon="eva:checkmark-fill"
                              className="h-3 w-3"
                            />
                          )}
                        </span>
                        <span
                          className={cn(!isChecked && "text-muted-foreground")}
                        >
                          {cur.label}
                        </span>
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resourceData.map((resource) => {
            const statusDetails = getStatusDisaplay(resource.status);
            return (
              <TableRow
                key={resource.id}
                onClick={() => router.push(`/admin/resources/${resource.id}`)}
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
                    <DropdownMenuTrigger>
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                          router.push(`/resources/${resource.id}`);
                        }}
                      >
                        <View className="text-blue-500" /> view Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="text-yellow-500" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Delete className="text-red-500" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export const getStatusDisaplay = (status: ResourceStatus) => {
  switch (status) {
    case ResourceStatus.available:
      return { display: "Available", color: "bg-green-200" };
    case ResourceStatus.inUse:
      return { display: "In Use", color: "bg-yellow-200" };
    case ResourceStatus.underMaintainence:
      return { display: "Under Maintainence", color: "bg-red-200" };
    default:
      return { display: status, color: "bg-red-200" };
  }
};
