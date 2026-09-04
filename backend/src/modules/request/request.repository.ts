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
      requestedBy: true,
      reviewedBy: true,
      resource: true,
    },
  });
};
export const findRequestsByUserId = async ({
  companyId,
  userId,
}: {
  companyId: string;
  userId: string;
}) => {
  return await prisma.request.findMany({
    where: { companyId, requestedById: userId },
    include: {
      company: true,
      requestedBy: true,
      reviewedBy: true,
      resource: true,
    },
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
}: {
  requestedById: string;
  requestedQuantity: number;
  resourceId: string;
  companyId: string;
}) => {
  return await prisma.request.create({
    data: {
      requestedById,
      requestedQuantity,
      resourceId,
      companyId,
      status: "pending",
    },
  });
};
