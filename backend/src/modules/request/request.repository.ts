import { prisma } from "../../lib/prisma";

export const findRequestsByCompanyId = async ({
  companyId,
}: {
  companyId: string;
}) => {
  return await prisma.request.findMany({
    where: { companyId },
    include: {
      company: true,
      requestedBy: { include: { department: true } },
      reviewedBy: { include: { department: true } },
      resource: true,
    },
    orderBy: { createdAt: "desc" },
  });
};
export const findRequestsByUserId = async ({
  companyId,
  userId,
  take,
}: {
  companyId: string;
  userId: string;
  take?: number;
}) => {
  return await prisma.request.findMany({
    where: { companyId, requestedById: userId },
    include: {
      company: true,
      requestedBy: { include: { department: true } },
      reviewedBy: true,
      resource: true,
    },
    orderBy: { createdAt: "desc" },
    take,
  });
};
export const findRequestById = async ({ id }: { id: string }) => {
  return await prisma.request.findUnique({
    where: {
      id,
    },
    select: {
      requestedBy: true,
      reviewedBy: true,
    },
  });
};
export const createRequest = async ({
  requestedById,
  requestedQuantity,
  resourceId,
  companyId,
  priority,
  reason,
}: {
  requestedById: string;
  requestedQuantity: number;
  resourceId: string;
  companyId: string;
  priority?: "low" | "medium" | "high";
  reason?: string;
}) => {
  return await prisma.request.create({
    data: {
      requestedById,
      requestedQuantity,
      resourceId,
      companyId,
      status: "pending",
      priority: priority ?? "medium",
      reason,
    },
  });
};
