import React from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  FileText,
  History,
  Info,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const REQUESTS = [
  {
    id: "REQ-8291",
    name: "Dell UltraSharp 32''",
    type: "Hardware",
    date: "Feb 20, 2024",
    status: "pending",
    note: null,
  },
  {
    id: "REQ-8285",
    name: "IntelliJ IDEA License",
    type: "Software",
    date: "Feb 15, 2024",
    status: "approved",
    note: null,
  },
  {
    id: "REQ-8102",
    name: "Herman Miller Aeron",
    type: "Furniture",
    date: "Jan 12, 2024",
    status: "rejected",
    note: "Budget limit exceeded for Q1",
  },
];

export default function MyRequests() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Requests
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage your resource acquisition history.
          </p>
        </div>
        <Button size="lg" className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" /> Request New Resource
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <TabsList className="grid w-full grid-cols-3 md:w-100">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search requests..." className="pl-8" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle className="text-xl">Request History</CardTitle>
              <CardDescription>
                View status and manage your submitted requests.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-transparent">
                    <TableHead className="w-30 pl-6 font-semibold">
                      ID
                    </TableHead>
                    <TableHead className="font-semibold">Resource</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-slate-900">
                        Date <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right pr-6 font-semibold">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {REQUESTS.map((req) => (
                    <TableRow
                      key={req.id}
                      className="group transition-colors hover:bg-slate-50/50"
                    >
                      <TableCell className="pl-6 font-mono text-xs text-slate-500 font-medium">
                        {req.id}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-700">
                        {req.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-medium bg-white capitalize shadow-none"
                        >
                          {req.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {req.date}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`shadow-none px-2.5 py-0.5 font-semibold 
                            ${
                              req.status === "pending"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : req.status === "approved"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {req.status.charAt(0).toUpperCase() +
                              req.status.slice(1)}
                          </Badge>
                          {req.note && (
                            <div
                              title={req.note}
                              className="cursor-help flex items-center"
                            >
                              <Info className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-slate-200/50"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuLabel>Manage</DropdownMenuLabel>
                            <DropdownMenuItem className="cursor-pointer">
                              <FileText className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <History className="mr-2 h-4 w-4" /> Timeline
                            </DropdownMenuItem>
                            {req.status === "pending" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-rose-600 cursor-pointer focus:text-rose-600 focus:bg-rose-50">
                                  Cancel Request
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
