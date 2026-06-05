import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Building2, Calendar, MapPin, Package } from "lucide-react";
enum ResourceStatus {
  "",
}
type resourceType = {
  id: String;
  name: String;
  location: String;
  department: String;
  type: String;
  availability: Boolean;
  status: ResourceStatus;
  totalQuantity: number;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  description: string;
};
const ResourceDetails = (resource: resourceType) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Resource Information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="flex gap-3">
            <Package className="mt-1 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Resource ID</p>
              <p>{resource.id}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Building2 className="mt-1 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p>{resource.department}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p>{resource.location}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Calendar className="mt-1 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p>{resource.createdAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="leading-7 text-muted-foreground">
            {resource.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceDetails;
