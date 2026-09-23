import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardCheck } from "lucide-react";

const statusBadge: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

type ReviewedRequest = {
  id: string;
  requestedQuantity: number;
  status: string;
  createdAt: string;
  resource: { name: string; type: string };
  requestedBy: { username: string };
};

export default function ManagerRequests({
  requests,
}: {
  requests: ReviewedRequest[];
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        {requests.length === 0 ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
            <div className="mb-4 p-3 rounded-full bg-muted">
              <ClipboardCheck className="size-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No reviews yet.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Decision</TableHead>
                <TableHead>Reviewed On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">
                    {req.requestedBy.username}
                  </TableCell>
                  <TableCell>{req.resource.name}</TableCell>
                  <TableCell className="capitalize">
                    {req.resource.type}
                  </TableCell>
                  <TableCell>{req.requestedQuantity}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-semibold capitalize ${statusBadge[req.status] ?? ""}`}
                    >
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(req.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}