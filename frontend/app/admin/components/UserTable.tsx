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
  Plus,
  UserX,
  View,
} from "lucide-react";

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
import { FilterConfig, FilterValues } from "@/components/global/Filter";
import { useUserTable } from "../hooks/userHooks";
import { useRouter } from "next/navigation";
import TablePaginationFooter from "./TablePaginationFooter";
import StatusBadge from "./ui/StatusBadge";
import TableToolbar from "./ui/TableToolbar";

export type userType = {
  id: string;
  username: string;
  email: string;
  role: string | null;
  department: {
    name: string;
    id: string;
    companyId: string;
    createdAt: string;
    updatedAt: string;
  }
  ,company:{ companyName: string } | null,
  description: string | null;
  resourceItems?: { id: string }[];
};

export const UserTable = () => {
  const defaultTableFields: {
    label: string;
    key: keyof userType;
    render: (user: userType) => React.ReactNode;
  }[] = [
    {
      label: "ID",
      key: "id",
      render: (user) => {
        return user.id;
      },
    },
    {
      label: "Username",
      key: "username",
      render: (user) => {
        return user.username;
      },
    },
    {
      label: "Email",
      key: "email",
      render: (user) => {
        return user.email;
      },
    },
    {
      label: "Role",
      key: "role",
      render: (user) => {
        return <StatusBadge status={user.role} />;
      },
    },
    {
      label: "Department",
      key: "department",
      render: (user) => {
        return user.department?.name ?? "N/A";
      },
    },
    {
      label: "Description",
      key: "description",
      render: (user) => {
        return user.description??"N/A"
      },
    },
  ];
  const router = useRouter();
  const [tableFields, setTableFields] = useState<
    {
      label: string;
      key: keyof userType;
      render: (user: userType) => React.ReactNode;
    }[]
  >(defaultTableFields);
  const tableEmptyProps: tableEmptyType = {
    colSpan: tableFields.length + 1,
    header: "No users found !",
    headerIcon: UserX,

    button: {
      buttonText: "Invite Users",
      link: "admin/users/invite",
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
      key: "userRole",
      title: "Role",
      type: "dropdown",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Manager", value: "manager" },
        { label: "Employee", value: "employee" },
      ],
    },
    {
      key: "userDepartmentSearch",
      title: "Department",
      type: "input",
      placeholder: "Search by user department",
    },
  ];

  const [currentPage, setCurrentPage] = useState<number>(1);
  const { isLoading, data, isSuccess } = useUserTable({
    searchText: debouncedSearchText,
    filters,
    page: currentPage,
  });

  const users: userType[] = data?.data;

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
          searchPlaceholder="Search by user name"
          filters={tableFilter}
          setFilters={setFilters}
          actions={columnToggle}
        />
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
              {isSuccess && users?.length ? (
                users.map((user) => {
                  return (
                    <TableRow
                      key={user.id}
                      className="cursor-pointer"
                      onClick={() => {
                        router.push(`/admin/users/${user.id}`);
                      }}
                    >
                      {tableFields.map((field) => {
                        return (
                          <TableCell key={field.key}>
                            {field.render(user)}
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
                            <DropdownMenuItem className="cursor-pointer">
                              <View className="text-muted-foreground" /> View
                              details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="text-muted-foreground" />
                              Change role
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                              <Delete className="text-destructive" />
                              Remove user
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
          {isSuccess && users?.length && data?.totalPages > 1 && (
            <TablePaginationFooter
              colSpan={tableFields.length + 1}
              currentPage={data?.currentPage}
              totalPages={data?.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </Table>
      </CardContent>
    </Card>
  );
};
