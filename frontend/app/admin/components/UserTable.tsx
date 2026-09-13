import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Delete, Edit, EllipsisVertical, View } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import TableEmpty from "./emptyStates/TableEmpty";
import { TableSkeleton } from "./skeletonLoaders/TableSkeleton";
import Filter, { FilterConfig, FilterValues } from "@/components/global/Filter";
import { calculatePages } from "@/lib/HelperFunctions";
import { useUserTable } from "../hooks/companyHooks";

export type userType = {
  id: string;
  username: string;
  email: string;
  role: string | null;
  department: string | null;
  description: string | null;
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
        return <Badge variant={"outline"}>{user.role}</Badge>;
      },
    },
    {
      label: "Department",
      key: "department",
      render: (user) => {
        return user.department;
      },
    },
    {
      label: "Description",
      key: "description",
      render: (user) => {
        return user.description;
      },
    },
  ];

  const [tableFields, setTableFields] = useState<
    {
      label: string;
      key: keyof userType;
      render: (user: userType) => React.ReactNode;
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
      key: "role",
      title: "Role",
      type: "dropdown",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Manager", value: "manager" },
        { label: "Employee", value: "employee" },
      ],
    },
    {
      key: "department",
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

  let mappingPages;
  if (
    data?.success &&
    typeof data?.totalPages === "number" &&
    typeof data?.currentPage === "number"
  ) {
    mappingPages = calculatePages({
      totalPages: data?.totalPages,
      currentPage: data?.currentPage,
    });
  }
  return (
    <div className="mt-5 mb-5 px-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2" colSpan={tableFields.length + 1}>
              <div className="flex justify-end gap-5">
                <Input
                  placeholder="Search by user Name"
                  className="w-[50%] bg-secondary!"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                ></Input>
                <Filter filters={tableFilter} setFilters={setFilters} />
              </div>
            </TableHead>
          </TableRow>
          <TableRow>
            {tableFields.map((cur) => (
              <TableHead key={cur.key}>{cur.label}</TableHead>
            ))}
            <TableHead>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 border-border/60 hover:bg-muted/60 bg-secondary!"
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
        {isLoading ? (
          <TableSkeleton columnCount={tableFields.length + 1} />
        ) : (
          <TableBody>
            {isSuccess && users?.length ? (
              users.map((user) => {
                return (
                  <TableRow key={user.id}>
                    {tableFields.map((field) => {
                      return (
                        <TableCell key={field.key}>
                          {field.render(user)}
                        </TableCell>
                      );
                    })}

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem className="cursor-pointer">
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
              })
            ) : (
              <TableEmpty colSpan={tableFields.length + 1} />
            )}
          </TableBody>
        )}
        {mappingPages && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={tableFields.length + 1}>
                <div className="flex w-full justify-center gap-5">
                  {mappingPages.map((pageNumber, index) => {
                    return (
                      <Button
                        className={`${pageNumber == data?.currentPage ? "border-2! border-foreground!" : ""}`}
                        key={index}
                        onClick={() => {
                          if (typeof pageNumber === "number") {
                            setCurrentPage(pageNumber);
                          }
                        }}
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
    </div>
  );
};