import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import {
  RequestStatus,
  ResourceStatus,
  Role,
} from "../../generated/prisma/enums";
import { findByUsername } from "../auth/auth.repository";
import { appError } from "../../utils/appError";
import {
  createRequestService,
  getAllRequestService,
  getMyRequestService,
  getRequestDetailsService,
} from "./request.service";

export const getAllRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = res.locals.user.companyId;
    const allRequests = await getAllRequestService({ companyId });
    return res.status(200).json({
      success: true,
      code: "REQUESTS_RETRIVED",
      message: "all requests retrived",
      data: allRequests,
    });
  } catch (err) {
    next(err);
  }
};
export const getMyRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { companyId, username } = res.locals.user;
    const myRequests = await getMyRequestService({ username, companyId });
    return res.status(200).json({
      success: true,
      code: "REQUESTS_RETRIVED",
      message: "requests retirved successfully",
      data: myRequests,
    });
  } catch (err) {
    next(err);
  }
};
export const getSpecificRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const requestDetails = await getRequestDetailsService({ id });
    return res.status(200).json({
      success: true,
      code: "RESOURCE_RETRIVED",
      message: "resource details retrived successfully",
      data: requestDetails,
    });
  } catch (err) {
    next(err);
  }
};
export const createRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { companyId, email } = res.locals.user;
    const { requestedQuantity, resourceId } = req.body;
    const createdRequest = createRequestService({
      companyId,
      email,
      requestedQuantity,
      resourceId,
    });
    return res.status(201).json({
      message: "Request created successfully",
      code: "REQUEST_CREATED",
      success: true,
      data: createdRequest,
    });
  } catch (err) {
    next(err);
  }
};
export const handleReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status, requestId } = req.body;
    if (!status || !requestId) {
      throw new appError(400, "INVALID_REQUEST", "please provide all fields");
    }
    const userInfo = res.locals.user;
    const email = userInfo?.email;
    if (!email) {
      throw new appError(401, "UNAUTHORIZED", "authentication failed");
    }
    const reviewer = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true, departmentId: true },
    });
    const requestDetails = await prisma.request.findUnique({
      where: { id: requestId },
      select: {
        requestedById: true,
        resourceId: true,
        requestedQuantity: true,
        companyId: true,
        requestedBy: { select: { departmentId: true } },
      },
    });
    if (!reviewer || !requestDetails) {
      throw new appError(500, "SERVER_ERROR", "server error");
    }

    if (requestDetails.requestedById === reviewer.id) {
      throw new appError(
        403,
        "SELF_REVIEW",
        "you cannot review your own request",
      );
    }

    if (
      reviewer.role === Role.manager &&
      requestDetails.requestedBy.departmentId !== reviewer.departmentId
    ) {
      throw new appError(
        403,
        "NOT_SAME_DEPARTMENT",
        "you can only review requests from employees of your department",
      );
    }

    await prisma.request.update({
      where: { id: requestId },
      data: { reviewedById: reviewer.id, status },
    });

    if (status === RequestStatus.approved) {
      const availableItems = await prisma.resourceItem.findMany({
        where: {
          resourceId: requestDetails.resourceId,
          status: ResourceStatus.available,
        },
        orderBy: { createdAt: "asc" },
        take: requestDetails.requestedQuantity,
        select: { id: true },
      });

      if (availableItems.length < requestDetails.requestedQuantity) {
        throw new appError(
          400,
          "INSUFFICIENT_RESOURCE_ITEMS",
          "not enough available resource items to fulfill this request",
        );
      }

      await prisma.resourceItem.updateMany({
        where: { id: { in: availableItems.map((item) => item.id) } },
        data: {
          status: ResourceStatus.inUse,
          acquiredById: requestDetails.requestedById,
        },
      });
    }

    return res.json({
      message: "Request status updated",
      success: true,
      code: "REQUEST_REVIEWED",
    });
  } catch (err) {
    next(err);
  }
};

export const handleCancel = (req: Request, res: Response) => {
  const id = req.params.id;
  res.json({ message: `cancels the specific request with id ${id}` });
};
export const handleForward = (req: Request, res: Response) => {
  const id = req.params.id;
  res.json({
    message: `forwards the specific request with id ${id} to higher authority`,
  });
};
