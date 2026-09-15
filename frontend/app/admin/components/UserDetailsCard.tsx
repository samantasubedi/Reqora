import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Mail, User as UserIcon } from "lucide-react";

type UserData = {
  username: string;
  email: string;
  role: string | null;
  department: string | null;
  description: string | null;
  company: { companyName: string } | null;
};

const roleBadgeStyle: Record<string, string> = {
  admin: "bg-red-100 text-red-700 border-red-200",
  manager: "bg-amber-100 text-amber-700 border-amber-200",
  employee: "bg-green-100 text-green-700 border-green-200",
};

export default function UserDetailsCard({ user }: { user: UserData }) {
  const initials = user.username
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted text-xl font-bold">
            {initials || <UserIcon className="size-6 text-muted-foreground" />}
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl">{user.username}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="size-4" />
              {user.email}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <Badge
              variant="outline"
              className={`font-semibold capitalize ${roleBadgeStyle[user.role ?? ""] ?? ""}`}
            >
              {user.role ?? "N/A"}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Department
            </p>
            <p className="text-sm">{user.department ?? "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Company</p>
            <div className="flex items-center gap-1.5 text-sm">
              <Building2 className="size-4 text-muted-foreground" />
              {user.company?.companyName ?? "N/A"}
            </div>
          </div>
          {user.description && (
            <div className="space-y-1 sm:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">
                Description
              </p>
              <p className="text-sm">{user.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
