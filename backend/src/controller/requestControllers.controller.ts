import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
export const getAllRequest = (req: Request, res: Response) => {};
// export const getSpecificRequest = (req: Request, res: Response) => {
//   const id = req.params.id;
//   res.send(`gets a specific request with id ${id}`);
// };
export const createRequest = async (req: Request, res: Response) => {
  const { companyId, email } = res.locals.user;
  const { requestedQuantity, resourceId } = req.body;
  if (!requestedQuantity || !resourceId) {
    return res.status(400).json({
      message: "please provide all fields",
    });
  }
  const idObj = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!idObj) {
    return res
      .status(500)
      .json({ message: "server error ", success: false, code: "SERVER_ERROR" });
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
    return res.json({
      message: "server error",
      success: false,
      code: "SERVER_ERROR",
    });
  }
};
export const handleApprove = (req: Request, res: Response) => {
  const id = req.params.id;
  res.json({ message: `approves the specific request with id ${id}` });
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
