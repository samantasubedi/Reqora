import { findRequestsByCompanyId } from "./request.repository";

export const getAllRequestService=async({companyId}:{companyId:string})=>{
 const result = await findRequestsByCompanyId({companyId})
 
    const allRequests = result.map((curr) => {//we are doing this because we get an array not an object
      return {
        requestId: curr.id,
        status: curr.status,
        requestedQuantity: curr.requestedQuantity,
        resourceId: curr.resourceId,
        reviewedBy: curr.reviewedBy?.username,
        requestedBy: curr.requestedBy.username,
        companyName: curr.company.companyName,
        resourceName: curr.resource.name,
      };
    });
    return allRequests
}