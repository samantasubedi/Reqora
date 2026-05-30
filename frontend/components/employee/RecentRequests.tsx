import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export const RecentRequests = () => {
  return (
    <div>
      <Card className="col-span-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Recent Requests</CardTitle>
              <CardDescription>
                You have made 3 requests this month.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-8 w-50" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">MacBook Pro 14"</TableCell>
                <TableCell>Oct 12, 2023</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-600">
                    Approved
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-blue-500 bg-zinc-100 hover:bg-zinc-200 cursor-pointer transition-all duration-300 ease-in-out"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Noise Cancelling Headphones
                </TableCell>
                <TableCell>Oct 15, 2023</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-700"
                  >
                    Pending
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-blue-500 bg-zinc-100 hover:bg-zinc-200 cursor-pointer transition-all duration-300 ease-in-out"
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex justify-end w-full mt-10">
            <Button className="cursor-pointer text-blue-600 bg-blue-100 hover:bg-blue-200 transition-all duration-300 ease-in-out font-bold">
              View All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
