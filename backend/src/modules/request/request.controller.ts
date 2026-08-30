import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { stat } from "node:fs";
export const getAllRequest = async (req: Request, res: Response) => {
  const companyId = res.locals.user.companyId;
  try {
    const response = await prisma.request.findMany({
      where: { companyId },
      include: {
        company: true,
        requestedBy: true,
        reviewedBy: true,
        resource: true,
      },
    });
    if (!response) {
      throw new Error("server error");
    }
    const requestData = response.map((curr) => {//we are doing this because we get an array not an object
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
  } catch (err) {
    return res.status(500).json({
      code: "SERVER_ERROR",
      message: "server error",
      success: false,
    });
  }
};
export const getSpecificRequest = (req: Request, res: Response) => {
  const id = req.params.id;
  res.send(`gets a specific request with id ${id}`);
};
export const createRequest = async (req: Request, res: Response) => {
  const { companyId, email } = res.locals.user;
  const { requestedQuantity, resourceId } = req.body;
  if (!requestedQuantity || requestedQuantity <= 0 || !resourceId) {
    return res.status(400).json({
      message: "please provide all fields",
      code: "INSUFFICIENT_FIELDS",
      success: false,
    });
  }
  const idObj = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!idObj) {
    return res.status(500).json({
      message: "server error",
      success: false,
      code: "SERVER_ERROR",
    });
  }
  const quantityObj = await prisma.resource.findUnique({
    where: { id: resourceId },
    select: { availableQuantity: true },
  });
  if (!quantityObj) {
    return;
  }
  if (quantityObj.availableQuantity < requestedQuantity) {
    return res.status(400).json({
      code: "INVALID_REQUEST",
      message: " requested quantity of resource is unavailable",
      success: false,
    });
  }
  try {
    await prisma.request.create({
      data: {
        requestedById: idObj.id,
        requestedQuantity,
        resourceId,
        companyId,
        status: "pending",
      },
    });
    return res.status(201).json({
      message: "Request created successfully",
      code: "REQUEST_CREATED",
      success: true,
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
