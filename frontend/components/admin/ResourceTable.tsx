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
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

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

  const [tableFields, setTableFields] =
    useState<
      {
        label: string;
        key: keyof resourceType;
        render: (resource: resourceType) => React.ReactNode;
      }[]
    >(defaultTableFields);
  const handleTableField = (fieldName: string) => {
    const newFields = tableFields.filter((cur) => {
      return cur.label !== fieldName;
    });
    setTableFields(newFields);
  };

  return (
    <div className="mt-5 px-3">
      <Table className="bg-blue-200/40">
        <TableHeader>
          <TableRow className="bg-slate-200">
            {tableFields.map((cur) => (
              <TableHead>{cur.label}</TableHead>
            ))}
            <TableHead>
              <DropdownMenu>
                <DropdownMenuTrigger>==</DropdownMenuTrigger>
                <DropdownMenuContent>
                  {tableFields.map((cur) => (
                    <DropdownMenuItem
                      onClick={() => {
                        handleTableField(cur.label);
                      }}
                    >
                      {cur.label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem
                    onClick={() => {
                      setTableFields(defaultTableFields);
                    }}
                  >
                    Reset
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resourceData.map((resource) => {
            const statusDetails = getStatusDisaplay(resource.status);
            return (
              <TableRow key={resource.id}>
                {tableFields.map((field) => {
                  return <TableCell>{field.render(resource)}</TableCell>;
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
