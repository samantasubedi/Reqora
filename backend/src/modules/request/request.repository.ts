import { prisma } from "../../lib/prisma";

export const findRequestsByCompanyId=async({companyId}:{companyId:string})=>{
  return  await prisma.request.findMany({
      where: { companyId },
      include: {
        company: true,
        requestedBy: true,
        reviewedBy: true,
        resource: true,
      },
    });
}