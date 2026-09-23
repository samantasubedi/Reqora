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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Send } from "lucide-react";

const statusBadge: Record<string, string> = {
  available: "bg-green-100 text-green-700 border-green-200",
  inUse: "bg-blue-100 text-blue-700 border-blue-200",
  underMaintenance: "bg-amber-100 text-amber-700 border-amber-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

type ResourceItem = {
  id: string;
  status: string;
  location: string;
  createdAt: string;
  resource: { name: string; type: string };
};

type UserRequest = {
  id: string;
  requestedQuantity: number;
  status: string;
  createdAt: string;
  resource: { name: string; type: string };
  reviewedBy: { username: string } | null;
};

const formatDate = (value: string) => new Date(value).toLocaleDateString();

const EmptyState = ({
  icon: Icon,
  text,
}: {
  icon: typeof Package;
  text: string;
}) => (
  <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
    <div className="mb-4 p-3 rounded-full bg-muted">
      <Icon className="size-8 text-muted-foreground" />
    </div>
    <p className="text-sm font-medium text-muted-foreground">{text}</p>
  </div>
);

export default function EmployeeTabs({
  resourceItems,
  requests,
}: {
  resourceItems: ResourceItem[];
  requests: UserRequest[];
}) {
  return (
    <Tabs defaultValue="acquired" className="w-full">
      <TabsList>
        <TabsTrigger value="acquired">Acquired Resources</TabsTrigger>
        <TabsTrigger value="requested">Requested Resources</TabsTrigger>
      </TabsList>

      <TabsContent value="acquired">
        <Card>
          <CardContent className="pt-6">
            {resourceItems.length === 0 ? (
              <EmptyState icon={Package} text="No acquired resources yet." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Acquired On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resourceItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.resource.name}
                      </TableCell>
                      <TableCell className="capitalize">
                        {item.resource.type}
                      </TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-semibold capitalize ${statusBadge[item.status] ?? ""}`}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="requested">
        <Card>
          <CardContent className="pt-6">
            {requests.length === 0 ? (
              <EmptyState icon={Send} text="No requests made yet." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reviewed By</TableHead>
                    <TableHead>Requested On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">
                        {req.resource?.name}
                      </TableCell>
                      <TableCell className="capitalize">
                        {req.resource?.type}
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
                      <TableCell>{req.reviewedBy?.username ?? "—"}</TableCell>
                      <TableCell>{formatDate(req.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
