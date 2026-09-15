import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck } from "lucide-react";

export default function ManagerRequests() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Requests Reviewed</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-[240px] flex-col items-center justify-center text-center">
        <div className="mb-4 p-3 rounded-full bg-muted">
          <ClipboardCheck className="size-8 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Reviewed requests will appear here once available.
        </p>
      </CardContent>
    </Card>
  );
}
