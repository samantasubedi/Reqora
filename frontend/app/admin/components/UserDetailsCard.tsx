import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Mail, User as UserIcon } from "lucide-react";
import { userType } from "./UserTable";
import UserActionsMenu from "./UserActionsMenu";
import StatusBadge from "./ui/StatusBadge";

export default function UserDetailsCard({ user }: { user: userType }) {
  const initials = user.username
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
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
          <UserActionsMenu user={user} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <StatusBadge status={user.role} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Department
            </p>
            <p className="text-sm">{user.department?.name ?? "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Company</p>
            <div className="flex items-center gap-1.5 text-sm">
              <Building2 className="size-4 text-muted-foreground" />
              {user.company?.companyName ?? "N/A"}
            </div>
          </div>
          {user.description && (
            <div className="space-y-1 sm:col-span-2 xl:col-span-3">
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
