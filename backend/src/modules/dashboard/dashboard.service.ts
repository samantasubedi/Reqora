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

const MONTHS_TO_SHOW = 6;

type MonthlyPoint = { label: string; value: number };

const getStartOfMonthWindow = () => {
  const now = new Date();
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() - (MONTHS_TO_SHOW - 1),
      1,
    ),
  );
};

const getMonthlyBuckets = () => {
  const now = new Date();
  return Array.from({ length: MONTHS_TO_SHOW }, (_, index) => {
    const date = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth() - (MONTHS_TO_SHOW - 1 - index),
        1,
      ),
    );

    return {
      key: `${date.getUTCFullYear()}-${date.getUTCMonth()}`,
      label: date.toLocaleDateString("en-US", {
        month: "short",
        timeZone: "UTC",
      }),
      value: 0,
    };
  });
};

const bucketDatesByMonth = (dates: Date[]): MonthlyPoint[] => {
  const buckets = getMonthlyBuckets();
  const bucketByKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const date of dates) {
    const bucket = bucketByKey.get(
      `${date.getUTCFullYear()}-${date.getUTCMonth()}`,
    );
    if (bucket) bucket.value += 1;
  }

  return buckets.map(({ label, value }) => ({ label, value }));
};

export const getAdminDashboardAnalyticsService = async ({
  companyId,
}: {
  companyId: string;
}) => {
  const startOfWindow = getStartOfMonthWindow();

  const [
    resourceCountsByStatus,
    resourceCountsByType,
    totalResourceCount,
    userCountsByRole,
    userCountsByDepartments,
    recentResourceItems,
    recentUsers,
  ] = await Promise.all([
    prisma.resourceItem.groupBy({
      by: ["status"],
      _count: true,
      where: { resource: { companyId } },
    }),
    prisma.resource.groupBy({
      by: ["type"],
      _count: true,
      where: { companyId },
    }),
    prisma.resourceItem.count({
      where: { resource: { companyId } },
    }),
    prisma.user.groupBy({
      by: ["role"],
      _count: true,
      where: { companyId },
    }),
    prisma.department.findMany({
      where: { companyId },
      select: {
        name: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    }),
    prisma.resourceItem.findMany({
      where: {
        resource: { companyId },
        createdAt: { gte: startOfWindow },
      },
      select: { createdAt: true },
    }),
    prisma.user.findMany({
      where: {
        companyId,
        joinedAt: { gte: startOfWindow },
      },
      select: { joinedAt: true },
    }),
  ]);

  const resourcesByMonth = bucketDatesByMonth(
    recentResourceItems.map((item) => item.createdAt),
  );
  const usersByMonth = bucketDatesByMonth(
    recentUsers
      .map((user) => user.joinedAt)
      .filter((joinedAt): joinedAt is Date => joinedAt !== null),
  );

  return {
    resourceStats: {
      countsByStatus: [
        ...resourceCountsByStatus,
        { status: "all", _count: totalResourceCount },
      ],
      countsByType: resourceCountsByType,
      resourcesByMonth,
    },
    userStats: {
      countsByRole: userCountsByRole,
      countsByDepartment: userCountsByDepartments,
      usersByMonth,
    },
  };
};
