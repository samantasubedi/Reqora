import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { stat } from "node:fs";
export const getAllRequest = (req: Request, res: Response) => {};
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
export const handleApprove = async (req: Request, res: Response) => {
  const { resourceId, status, requestId } = req.body;
  if (!resourceId || !status) {
    return res.json({ message: "please provide all fields" });
  }
  const email = res.locals.email;
  const idObj = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!idObj) {
    return res.json({ message: "server error" });
  }
  await prisma.request.update({
    where: { id: requestId },
    data: { reviewedById: idObj.id, status },
  });
};
export const handleReject = (req: Request, res: Response) => {
  const id = req.params.id;
  res.json({ message: `rejects the specific request with id ${id}` });
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
