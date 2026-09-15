import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Send } from "lucide-react";

export default function EmployeeTabs() {
  return (
    <Tabs defaultValue="acquired" className="w-full">
      <TabsList>
        <TabsTrigger value="acquired">Acquired Resources</TabsTrigger>
        <TabsTrigger value="requested">Requested Resources</TabsTrigger>
      </TabsList>

      <TabsContent value="acquired">
        <Card>
          <CardContent className="flex min-h-[240px] flex-col items-center justify-center text-center">
            <div className="mb-4 p-3 rounded-full bg-muted">
              <Package className="size-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Acquired resources will appear here once available.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="requested">
        <Card>
          <CardContent className="flex min-h-[240px] flex-col items-center justify-center text-center">
            <div className="mb-4 p-3 rounded-full bg-muted">
              <Send className="size-8 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Requested resources will appear here once available.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
