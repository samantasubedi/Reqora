"use client";
import { useQuery } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  Edit,
  MapPin,
  Package,
  Trash2,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Progress } from "@/components/ui/progress";

const ResourceDetails = () => {
  const resource = {
    id: "RES-001",
    name: "MacBook Pro M3",
    type: "Laptop",
    department: "IT",
    location: "Floor 3",
    status: "Available",
    totalQuantity: 20,
    availableQuantity: 8,
    createdAt: "2026-01-12",
    updatedAt: "2026-02-14",
    description:
      "High-performance laptops used by software engineers for development and testing.",
  };

  const inUse = resource.totalQuantity - resource.availableQuantity;

  const percentage =
    (resource.availableQuantity / resource.totalQuantity) * 100;

  const params = useParams();
  const id = params.id;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const fetchApi = async () => {
    const response = await axios.get(`${backendUrl}/resource/${id}`, {
      withCredentials: true,
    });
    return response.data;
  };
  const query = useQuery({
    queryKey: ["resourceDetail"],
    queryFn: fetchApi,
  });
  useEffect(() => {
    if (query.isError) {
      if (isAxiosError(query.error)) {
        toast.error(query.error.response?.data.message);
      } else {
        toast.error(query.error.message);
      }
    }
  }, [query.error]);
  let resourceDetail;
  if (query.isSuccess) {
    resourceDetail = query.data.resourceDetail;
    console.log("this is resourceDetail", resourceDetail);
  }
  if (query.isLoading) {
    return <div>Loading....</div>;
  }
  if (query.isSuccess) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="h-4 w-4" />
              Edit
            </Button>

            <Button variant="destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="rounded-xl border p-4">
                  <Package className="h-8 w-8" />
                </div>

                <div>
                  <h1 className="text-3xl font-bold">{resourceDetail.name}</h1>

                  <p className="text-muted-foreground">{resourceDetail.type}</p>
                </div>
              </div>

              <Badge>{resourceDetail.status}</Badge>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-muted-foreground text-sm">Total</p>

                  <h3 className="text-2xl font-bold">
                    {resourceDetail.totalQuantity}
                  </h3>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-muted-foreground text-sm">Available</p>

                  <h3 className="text-2xl font-bold">
                    {resource.availableQuantity}
                  </h3>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-muted-foreground text-sm">In Use</p>

                  <h3 className="text-2xl font-bold">{inUse}</h3>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">

  

        <div className="space-y-6 lg:col-span-2">

        

          <Card>
            <CardHeader>
              <CardTitle>
                Resource Information
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-2">

              <div className="flex gap-3">
                <Package className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Resource ID
                  </p>
                  <p>{resource.id}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Building2 className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Department
                  </p>
                  <p>{resource.department}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Location
                  </p>
                  <p>{resource.location}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Calendar className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Created At
                  </p>
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

       

          <Tabs defaultValue="requests">

            <TabsList>
              <TabsTrigger value="requests">
                Requests
              </TabsTrigger>

              <TabsTrigger value="holders">
                Current Holders
              </TabsTrigger>

              <TabsTrigger value="activity">
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Request History
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">

                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p className="font-medium">
                            John Doe
                          </p>

                          <p className="text-sm text-muted-foreground">
                            Requested 2 units
                          </p>
                        </div>

                        <Badge>
                          Approved
                        </Badge>
                      </div>
                    ))}

                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="holders">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Current Holders
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">

                    {[1, 2].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4" />

                          <div>
                            <p className="font-medium">
                              Employee Name
                            </p>

                            <p className="text-sm text-muted-foreground">
                              Assigned 5 days ago
                            </p>
                          </div>
                        </div>

                        <Badge>
                          2 Units
                        </Badge>
                      </div>
                    ))}

                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Activity Timeline
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-6">

                    {[
                      "Resource Created",
                      "Quantity Updated",
                      "Assigned To Employee",
                      "Returned By Employee",
                    ].map((event) => (
                      <div
                        key={event}
                        className="flex gap-4"
                      >
                        <div className="mt-2 h-3 w-3 rounded-full bg-primary" />

                        <div>
                          <p className="font-medium">
                            {event}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            2 days ago
                          </p>
                        </div>
                      </div>
                    ))}

                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>

        </div>
        <div className="space-y-6">

          <Card>
            <CardHeader>
              <CardTitle>
                Availability
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Available</span>
                  <span>
                    {resource.availableQuantity}/
                    {resource.totalQuantity}
                  </span>
                </div>

                <Progress value={percentage} />
              </div>

              <div className="grid grid-cols-2 gap-3">

                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      Available
                    </p>

                    <p className="text-xl font-bold">
                      {resource.availableQuantity}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      In Use
                    </p>

                    <p className="text-xl font-bold">
                      {inUse}
                    </p>
                  </CardContent>
                </Card>

              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Recent Activity
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="flex gap-3">
                <Clock className="h-4 w-4 mt-1" />
                <div>
                  <p className="text-sm">
                    Status changed to Available
                  </p>
                  <p className="text-xs text-muted-foreground">
                    3 hours ago
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock className="h-4 w-4 mt-1" />
                <div>
                  <p className="text-sm">
                    Quantity updated
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Yesterday
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>

        </div> 

      

        </div>
      </div>
    );
  }
};

export default ResourceDetails;
