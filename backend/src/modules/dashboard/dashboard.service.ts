import { appError } from "../../utils/appError";
import { prisma } from "../../lib/prisma";
import { findUserByEmail } from "../company/company.repository";
import { getMyRequestService } from "../request/request.service";
import { countItemsByUserId } from "../resource/resource.repository";
import { getMyItemsService } from "../resource/resource.service";

export const getEmployeeDashboardService = async ({
  username,
  email,
  companyId,
}: {
  username: string;
  email: string;
  companyId: string;
}) => {
  const [requestsResult, assignedItems, user] = await Promise.all([
    getMyRequestService({ username, companyId, limit: 5 }),
    getMyItemsService({ email, companyId, limit: 5 }),
    findUserByEmail({ email }),
  ]);

  if (!user) {
    throw new appError(404, "USER_NOT_FOUND", "user not found");
  }

  const assignedItemsCount = await countItemsByUserId({
    userId: user.id,
    companyId,
  });

  return {
    countsByStatus: requestsResult.countsByStatus,
    assignedItemsCount,
    recentRequests: requestsResult.requests,
    assignedItems,
  };
};

export const getAdminDashboardAnalyticsService = async ({
  companyId,
}: {
  companyId: string;
}) => {
  const resourceCountsByStatus = await prisma.resourceItem.groupBy({
    by: ["status"],
    _count: true,
    where: { resource: { companyId } },
  });
  const resourceCountsByType = await prisma.resource.groupBy({
    by: ["type"],
    _count: true,
    where: { companyId },
  });
  const totalResourceCount = await prisma.resourceItem.count({
    where: { resource: { companyId } },
  });
  const userCountsByRole = await prisma.user.groupBy({
    by: ["role"],
    _count: true,
    where: { companyId },
  });
  const userCountsByDepartments = await prisma.department.findMany({
    where: { companyId },
    select: {
      name: true,
      _count: {
        select: {
          users: true,
        },
      },
    },
  });

  return {
    resourceStats: {
      countsByStatus: [
        ...resourceCountsByStatus,
        { status: "all", _count: totalResourceCount },
      ],
      countsByType: resourceCountsByType,
    },
    userStats: {
      countsByRole: userCountsByRole,
      countsByDepartment: userCountsByDepartments,
    },
  };
};
