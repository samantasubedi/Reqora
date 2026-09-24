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
import { ClipboardCheck, Package, PlusCircle, Send } from "lucide-react";

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

type ReviewedRequest = {
  id: string;
  requestedQuantity: number;
  status: string;
  createdAt: string;
  resource: { name: string; type: string };
  requestedBy: { username: string };
};

type AddedResource = {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  department?: { name: string } | null;
};

type UserDetailsTabsProps = {
  role: string | null;
  resourceItems?: ResourceItem[];
  createdRequests?: UserRequest[];
  reviewedRequests?: ReviewedRequest[];
  addedResources?: AddedResource[];
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

const AcquiredTable = ({ items }: { items: ResourceItem[] }) => (
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
      {items.map((item) => (
        <TableRow key={item.id}>
          <TableCell className="font-medium">{item.resource.name}</TableCell>
          <TableCell className="capitalize">{item.resource.type}</TableCell>
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
);

const RequestedTable = ({ requests }: { requests: UserRequest[] }) => (
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
          <TableCell className="font-medium">{req.resource?.name}</TableCell>
          <TableCell className="capitalize">{req.resource?.type}</TableCell>
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
);

const ReviewedTable = ({ requests }: { requests: ReviewedRequest[] }) => (
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
          <TableCell className="capitalize">{req.resource.type}</TableCell>
          <TableCell>{req.requestedQuantity}</TableCell>
          <TableCell>
            <Badge
              variant="outline"
              className={`font-semibold capitalize ${statusBadge[req.status] ?? ""}`}
            >
              {req.status}
            </Badge>
          </TableCell>
          <TableCell>{formatDate(req.createdAt)}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const AddedResourcesTable = ({ resources }: { resources: AddedResource[] }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Resource</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Department</TableHead>
        <TableHead>Added On</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {resources.map((resource) => (
        <TableRow key={resource.id}>
          <TableCell className="font-medium">{resource.name}</TableCell>
          <TableCell className="capitalize">{resource.type}</TableCell>
          <TableCell>{resource.department?.name ?? "—"}</TableCell>
          <TableCell>{formatDate(resource.createdAt)}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default function UserDetailsTabs({
  role,
  resourceItems = [],
  createdRequests = [],
  reviewedRequests = [],
  addedResources = [],
}: UserDetailsTabsProps) {
  const isAdmin = role === "admin";
  const isManager = role === "manager";

  return (
    <Tabs defaultValue={isAdmin ? "added" : "acquired"} className="w-full">
      <TabsList>
        {isAdmin ? (
          <>
            <TabsTrigger value="added">Added Resources</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed Requests</TabsTrigger>
          </>
        ) : (
          <>
            <TabsTrigger value="acquired">Acquired Resources</TabsTrigger>
            <TabsTrigger value="requested">Requested Resources</TabsTrigger>
            {isManager && (
              <TabsTrigger value="reviewed">Reviewed Requests</TabsTrigger>
            )}
          </>
        )}
      </TabsList>

      {isAdmin ? (
        <>
          <TabsContent value="added">
            <Card>
              <CardContent className="pt-6">
                {addedResources.length === 0 ? (
                  <EmptyState
                    icon={PlusCircle}
                    text="No resources added yet."
                  />
                ) : (
                  <AddedResourcesTable resources={addedResources} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviewed">
            <Card>
              <CardContent className="pt-6">
                {reviewedRequests.length === 0 ? (
                  <EmptyState
                    icon={ClipboardCheck}
                    text="No requests reviewed yet."
                  />
                ) : (
                  <ReviewedTable requests={reviewedRequests} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </>
      ) : (
        <>
          <TabsContent value="acquired">
            <Card>
              <CardContent className="pt-6">
                {resourceItems.length === 0 ? (
                  <EmptyState icon={Package} text="No acquired resources yet." />
                ) : (
                  <AcquiredTable items={resourceItems} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="requested">
            <Card>
              <CardContent className="pt-6">
                {createdRequests.length === 0 ? (
                  <EmptyState icon={Send} text="No requests made yet." />
                ) : (
                  <RequestedTable requests={createdRequests} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          {isManager && (
            <TabsContent value="reviewed">
              <Card>
                <CardContent className="pt-6">
                  {reviewedRequests.length === 0 ? (
                    <EmptyState
                      icon={ClipboardCheck}
                      text="No requests reviewed yet."
                    />
                  ) : (
                    <ReviewedTable requests={reviewedRequests} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </>
      )}
    </Tabs>
  );
}