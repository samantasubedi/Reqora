import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { findByUsername } from "../auth/auth.repository";
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
export const createRequest = async (req: Request, res: Response) => {
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
      data: createRequest,
    });
  } catch (err) {
    return res.status(500).json({
      message: "server error",
      success: false,
      code: "SERVER_ERROR",
    });
  }
};
export const handleReview = async (req: Request, res: Response) => {
  const { status, requestId } = req.body;
  if (!status || !requestId) {
    return res.json({ message: "please provide all fields" });
  }
  const email = res.locals.user.email;
  if (!email) {
    return res.json({ message: "authentication failed" });
  }
  const idObj = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  const requestDetails = await prisma.request.findUnique({
    where: { id: requestId },
    select: { resourceId: true, requestedQuantity: true, companyId: true },
  });
  if (!idObj || !requestDetails) {
    return res.json({
      code: "SERVER_ERROR",
      success: false,
      message: "server error",
    });
  }
  await prisma.request.update({
    where: { id: requestId },
    data: { reviewedById: idObj.id, status },
  });
  await prisma.resource.update({
    where: { id: requestDetails.resourceId },
    data: {
      availableQuantity: { decrement: requestDetails.requestedQuantity },
    },
  });

  return res.json({
    message: "Request status updated",
    success: true,
    code: "REQUEST_REVIEWED",
  });
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
