import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Package } from "lucide-react";

export const ResourceCard = () => {
  return (
    <div className="grid grid-cols-3 gap-10 ">
     
      <Card className="hover:bg-purple-100 bg-purple-50 hover:translate-1 cursor-pointer transition-all duration-400 ease-in-out ">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">My Resources</CardTitle>
          <Package className="h-8 w-8 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">04</div>
          <p className="text-sm text-muted-foreground">
            Items currently assigned
          </p>
        </CardContent>
      </Card>
      <Card className="hover:bg-orange-100 bg-orange-50 hover:translate-1 cursor-pointer transition-all duration-400 ease-in-out">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">
            Pending Approvals
          </CardTitle>
          <Clock className="h-8 w-8 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">02</div>
          <p className="text-sm text-muted-foreground">
            Awaiting manager review
          </p>
        </CardContent>
      </Card>
      <Card className="hover:bg-green-100 bg-green-50 hover:translate-1 cursor-pointer transition-all duration-400 ease-in-out">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">
            Approved Requests
          </CardTitle>
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-sm text-muted-foreground">
            Total successful fulfillments
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
