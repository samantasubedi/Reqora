import { prisma } from "../../lib/prisma";
import {
  RequestStatus,
  ResourceStatus,
  Role,
} from "../../generated/prisma/enums";

export const getLogsService = async ({
  companyId,
  page = 1,
  pageSize = 10,
}: {
  companyId: string;
  page?: number;
  pageSize?: number;
}) => {
  const [
    resources,
    resourceItems,
    requests,
    users,
    joinTokens,
  ] = await Promise.all([
    prisma.resource.findMany({
      where: { companyId },
      include: {
        createdBy: { select: { username: true } },
        resourceItems: { select: { id: true } },
      },
    }),
    prisma.resourceItem.findMany({
      where: { resource: { companyId } },
      include: {
        resource: { select: { name: true } },
        acquiredBy: { select: { username: true } },
      },
    }),
    prisma.request.findMany({
      where: { companyId },
      include: {
        requestedBy: { select: { username: true } },
        reviewedBy: { select: { username: true } },
        resource: { select: { name: true } },
      },
    }),
    prisma.user.findMany({
      where: { companyId },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        joinedAt: true,
        department: { select: { name: true } },
      },
    }),
    prisma.joinToken.findMany({
      where: { companyId },
      include: {
        department: { select: { name: true } },
      },
    }),
  ]);

  type LogEntry = {
    id: string;
    category: "resource" | "request" | "onboarding";
    action: string;
    description: string;
    actor: string | null;
    timestamp: string;
  };

  const logs: LogEntry[] = [];

  for (const resource of resources) {
    logs.push({
      id: `resource-added-${resource.id}`,
      category: "resource",
      action: "Resource Added",
      description: `"${resource.name}" added`,
      actor: resource.createdBy?.username ?? null,
      timestamp: resource.createdAt.toISOString(),
    });
  }

  for (const item of resourceItems) {
    if (item.status === ResourceStatus.available) {
      continue;
    }
    const actionByStatus: Record<string, string> = {
      [ResourceStatus.inUse]: "Resource Assigned",
      [ResourceStatus.underMaintenance]: "Resource Under Maintenance",
    };
    logs.push({
      id: `resource-item-${item.id}`,
      category: "resource",
      action: actionByStatus[item.status] ?? item.status,
      description: `"${item.resource.name}" item is now ${item.status.replace(/([A-Z])/g, " $1").toLowerCase()}`,
      actor: item.acquiredBy?.username ?? null,
      timestamp: item.updatedAt.toISOString(),
    });
  }

  for (const request of requests) {
    logs.push({
      id: `request-created-${request.id}`,
      category: "request",
      action: "Request Created",
      description: `requested ${request.requestedQuantity} x "${request.resource.name}"`,
      actor: request.requestedBy.username,
      timestamp: request.createdAt.toISOString(),
    });

    if (request.status !== RequestStatus.pending) {
      const actionByStatus: Record<string, string> = {
        [RequestStatus.approved]: "Request Approved",
        [RequestStatus.rejected]: "Request Rejected",
        [RequestStatus.cancelled]: "Request Cancelled",
        [RequestStatus.forwarded]: "Request Forwarded",
      };
      logs.push({
        id: `request-review-${request.id}`,
        category: "request",
        action: actionByStatus[request.status] ?? request.status,
        description: `${request.requestedQuantity} x "${request.resource.name}" request`,
        actor: request.reviewedBy?.username ?? null,
        timestamp: request.updatedAt.toISOString(),
      });
    }
  }

  for (const user of users) {
    if (user.role === Role.admin) {
      continue;
    }
    logs.push({
      id: `user-joined-${user.id}`,
      category: "onboarding",
      action: "User Joined",
      description: `${user.username} joined as ${user.role ?? "member"}${
        user.department ? ` in ${user.department.name}` : ""
      }`,
      actor: user.username,
      timestamp: (user.joinedAt ?? user.createdAt).toISOString(),
    });
  }

  for (const token of joinTokens) {
    const action = token.used ? "Invitation Used" : "Invitation Sent";
    logs.push({
      id: `invite-${token.id}`,
      category: "onboarding",
      action,
      description: `invited ${token.email} as ${token.role}${
        token.department ? ` in ${token.department.name}` : ""
      }`,
      actor: null,
      timestamp: token.createdAt.toISOString(),
    });
  }

  const sortedLogs = logs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const totalItems = sortedLogs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedLogs = sortedLogs.slice(startIndex, startIndex + pageSize);

  return {
    logs: paginatedLogs,
    pagination: {
      totalItems,
      totalPages,
      currentPage: safePage,
      pageSize,
    },
  };
};