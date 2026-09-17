"use client";
import React from "react";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { MapPin, User } from "lucide-react";
import { ResourceStatus } from "@/app/admin/resources/(with-sidebar)/page";
import { requestType } from "@/app/admin/apis/resourceApi";

export type ResourceItemDetail = {
  id: string;
  status: ResourceStatus;
  location: string;
  acquiredById: string | null;
  acquiredBy: { username: string } | null;
  resourceId: string;
  createdAt: string;
  updatedAt: string;
};

export const getItemStatusDisplay = (status: ResourceStatus) => {
  switch (status) {
    case ResourceStatus.available:
      return {
        display: "Available",
        badgeClass: "border-green-500 text-green-700 bg-green-100",
      };
    case ResourceStatus.inUse:
      return {
        display: "In Use",
        badgeClass: "border-amber-500 text-amber-700 bg-amber-100",
      };
    case ResourceStatus.underMaintenance:
      return {
        display: "Under Maintenance",
        badgeClass: "border-red-500 text-red-700 bg-red-100",
      };
    default:
      return {
        display: status,
        badgeClass: "",
      };
  }
};

export const ResourceTabs = ({
  resourceItems = [],
  requests,
}: {
  resourceItems?: ResourceItemDetail[];
  requests?: requestType[];
}) => {
  const holdResources = resourceItems.filter((item) => item.acquiredById);

  return (
    <div>
      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Requests</TabsTrigger>

          <TabsTrigger value="holders">Current Holders</TabsTrigger>

          <TabsTrigger value="items">Items</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Resource Requests</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {requests && requests.length ? (
                  requests.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">
                          {item.requestedBy.username}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Requested {item.requestedQuantity} unit/s
                        </p>
                      </div>

                      <Badge>{item.status}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No request for this resource yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="holders">
          <Card>
            <CardHeader>
              <CardTitle>Current Holders</CardTitle>
            </CardHeader>

            <CardContent>
              {holdResources.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Resource dont have any holders yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {holdResources.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4" />

                        <div>
                          <p className="font-medium">
                            {item.acquiredBy?.username ?? "Unknown user"}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            <MapPin className="mr-1 inline h-3 w-3" />
                            {item.location}
                          </p>
                        </div>
                      </div>

                      <Badge
                        className={getItemStatusDisplay(item.status).badgeClass}
                      >
                        {getItemStatusDisplay(item.status).display}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle>Resource Items</CardTitle>
            </CardHeader>

            <CardContent>
              {resourceItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No items found for this resource.
                </p>
              ) : (
                <div className="space-y-3">
                  {resourceItems.map((item) => {
                    const status = getItemStatusDisplay(item.status);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-mono text-xs text-muted-foreground">
                              {item.id}
                            </p>

                            <p className="text-sm text-muted-foreground">
                              <MapPin className="mr-1 inline h-3 w-3" />
                              {item.location}
                            </p>
                          </div>
                        </div>

                        <Badge className={status.badgeClass}>
                          {status.display}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
