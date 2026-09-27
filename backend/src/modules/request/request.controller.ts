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
  editRequestService,
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
    const {
      search,
      status,
      type,
      reviewer,
      priority,
      sortBy,
      order,
      page,
      limit,
    } = req.query as Record<string, string | undefined>;
    const validStatuses: RequestStatus[] = [
      RequestStatus.pending,
      RequestStatus.approved,
      RequestStatus.rejected,
      RequestStatus.cancelled,
      RequestStatus.forwarded,
    ];
    if (status && !(validStatuses as string[]).includes(status)) {
      throw new appError(400, "INVALID_STATUS", "invalid request status filter");
    }
    if (
      priority &&
      !priority
        .split(",")
        .every((p) => ["low", "medium", "high"].includes(p))
    ) {
      throw new appError(400, "INVALID_PRIORITY", "invalid priority filter");
    }
    const validSortBy = ["date", "name", "status", "priority"];
    if (sortBy && !validSortBy.includes(sortBy)) {
      throw new appError(400, "INVALID_SORT", "invalid sort field");
    }
    const result = await getMyRequestService({
      username,
      companyId,
      search,
      status: status as RequestStatus | undefined,
      type,
      reviewer,
      priority,
      sortBy: (sortBy as "date" | "name" | "status" | "priority" | undefined) ?? "date",
      order: order === "asc" ? "asc" : "desc",
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : undefined,
    });
    return res.status(200).json({
      success: true,
      code: "REQUESTS_RETRIVED",
      message: "requests retirved successfully",
      data: result.requests,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      countsByStatus: result.countsByStatus,
      reviewers: result.reviewers,
      types: result.types,
      oldestPendingAt: result.oldestPendingAt,
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
    if (!id) {
      throw new appError(400, "INVALID_ID", "please provide an id");
    }
    const { companyId, role } = res.locals.user;
    const requestDetails = await getRequestDetailsService({ id });
    if (requestDetails.companyId !== companyId) {
      throw new appError(
        403,
        "NOT_SAME_COMPANY",
        "this request belongs to another company",
      );
    }
    if (role === Role.employee) {
      const viewer = await findByUsername({ username: res.locals.user.username });
      if (!viewer || requestDetails.requestedById !== viewer.id) {
        throw new appError(
          403,
          "NOT_REQUESTER",
          "you can only view your own requests",
        );
      }
    }
    const { companyId: _omit, ...response } = requestDetails;
    return res.status(200).json({
      success: true,
      code: "REQUEST_RETRIEVED",
      message: "request details retrieved successfully",
      data: response,
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
    const { requestedQuantity, resourceId, priority, reason } = req.body;
    const createdRequest = await createRequestService({
      companyId,
      email,
      requestedQuantity,
      resourceId,
      priority,
      reason,
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
export const handleEdit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    if (!id) {
      throw new appError(400, "INVALID_ID", "please provide an id");
    }
    const { companyId, email } = res.locals.user;
    const { requestedQuantity, priority, reason } = req.body;
    const updated = await editRequestService({
      id,
      email,
      companyId,
      requestedQuantity,
      priority,
      reason,
    });
    return res.status(200).json({
      success: true,
      code: "REQUEST_UPDATED",
      message: "request updated successfully",
      data: updated,
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
    const { status, requestId, note } = req.body;
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
      select: {
        id: true,
        role: true,
        departmentId: true,
        companyId: true,
      },
    });
    const requestDetails = await prisma.request.findUnique({
      where: { id: requestId },
      select: {
        id: true,
        requestedById: true,
        resourceId: true,
        requestedQuantity: true,
        companyId: true,
        status: true,
        requestedBy: { select: { departmentId: true } },
      },
    });
    if (!reviewer || !requestDetails) {
      throw new appError(404, "NOT_FOUND", "reviewer or request not found");
    }

    if (requestDetails.companyId !== reviewer.companyId) {
      throw new appError(
        403,
        "NOT_SAME_COMPANY",
        "you cannot review requests from another company",
      );
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
      (!reviewer.departmentId ||
        requestDetails.requestedBy.departmentId !== reviewer.departmentId)
    ) {
      throw new appError(
        403,
        "NOT_SAME_DEPARTMENT",
        "you can only review requests from employees of your department",
      );
    }

    if (requestDetails.status !== RequestStatus.pending) {
      throw new appError(
        400,
        "REQUEST_ALREADY_PROCESSED",
        "this request has already been processed",
      );
    }

    const reviewOnlyStatuses: RequestStatus[] = [
      RequestStatus.approved,
      RequestStatus.rejected,
    ];
    if (!reviewOnlyStatuses.includes(status as RequestStatus)) {
      throw new appError(
        400,
        "INVALID_REQUEST_STATUS",
        "status must be approved or rejected",
      );
    }

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

      await prisma.$transaction([
        prisma.request.update({
          where: { id: requestId },
          data: { reviewedById: reviewer.id, status, note: note ?? undefined },
        }),
        prisma.resourceItem.updateMany({
          where: { id: { in: availableItems.map((item) => item.id) } },
          data: {
            status: ResourceStatus.inUse,
            acquiredById: requestDetails.requestedById,
            allocatedRequestId: requestId,
          },
        }),
      ]);
    } else {
      await prisma.request.update({
        where: { id: requestId },
        data: { reviewedById: reviewer.id, status, note: note ?? undefined },
      });
    }

    return res.status(200).json({
      message: "Request status updated",
      success: true,
      code: "REQUEST_REVIEWED",
    });
  } catch (err) {
    next(err);
  }
};

export const handleCancel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const { companyId, email } = res.locals.user;
    const userInfo = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    const requestDetails = await prisma.request.findUnique({
      where: { id },
      select: {
        companyId: true,
        requestedById: true,
        status: true,
      },
    });
    if (!userInfo || !requestDetails) {
      throw new appError(404, "NOT_FOUND", "user or request not found");
    }
    if (requestDetails.companyId !== companyId) {
      throw new appError(
        403,
        "NOT_SAME_COMPANY",
        "this request belongs to another company",
      );
    }
    if (requestDetails.requestedById !== userInfo.id) {
      throw new appError(
        403,
        "NOT_REQUESTER",
        "you can only cancel your own requests",
      );
    }
    if (requestDetails.status === RequestStatus.cancelled) {
      throw new appError(
        400,
        "ALREADY_CANCELLED",
        "this request has already been cancelled",
      );
    }
    if (requestDetails.status !== RequestStatus.pending) {
      throw new appError(
        400,
        "CANNOT_CANCEL",
        "only pending requests can be cancelled",
      );
    }
    await prisma.request.update({
      where: { id },
      data: { status: RequestStatus.cancelled },
    });
    return res.status(200).json({
      message: "Request cancelled",
      success: true,
      code: "REQUEST_CANCELLED",
    });
  } catch (err) {
    next(err);
  }
};

export const handleForward = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const { companyId, email } = res.locals.user;
    const reviewer = await prisma.user.findUnique({
      where: { email },
      select: { id: true, departmentId: true },
    });
    const requestDetails = await prisma.request.findUnique({
      where: { id },
      select: {
        companyId: true,
        requestedById: true,
        status: true,
        requestedBy: { select: { departmentId: true } },
      },
    });
    if (!reviewer || !requestDetails) {
      throw new appError(404, "NOT_FOUND", "reviewer or request not found");
    }
    if (requestDetails.companyId !== companyId) {
      throw new appError(
        403,
        "NOT_SAME_COMPANY",
        "this request belongs to another company",
      );
    }
    if (requestDetails.requestedById === reviewer.id) {
      throw new appError(
        403,
        "SELF_FORWARD",
        "you cannot forward your own request",
      );
    }
    if (
      !reviewer.departmentId ||
      requestDetails.requestedBy.departmentId !== reviewer.departmentId
    ) {
      throw new appError(
        403,
        "NOT_SAME_DEPARTMENT",
        "you can only forward requests from your department",
      );
    }
    if (requestDetails.status !== RequestStatus.pending) {
      throw new appError(
        400,
        "CANNOT_FORWARD",
        "only pending requests can be forwarded",
      );
    }
    await prisma.request.update({
      where: { id },
      data: { status: RequestStatus.forwarded },
    });
    return res.status(200).json({
      message: "Request forwarded to admin",
      success: true,
      code: "REQUEST_FORWARDED",
    });
  } catch (err) {
    next(err);
  }
};
