import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ExternalLink, Package } from "lucide-react";
import { Button } from "../ui/button";

export const ActiveGear = () => {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-2xl">My Active Gear</CardTitle>
        <CardDescription>
          Items you are currently responsible for.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            {
              name: "LG UltraFine 5K",
              sn: "SN-99210",
              icon: <Package className="h-4 w-4" />,
            },
            {
              name: "Keychron K2 V2",
              sn: "SN-44123",
              icon: <Package className="h-4 w-4" />,
            },
            {
              name: "Magic Mouse",
              sn: "SN-11029",
              icon: <Package className="h-4 w-4" />,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg border p-3"
            >
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.sn}</p>
              </div>
              <Button variant="outline" size="icon">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
