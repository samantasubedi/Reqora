import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { ResourceStatus } from "../../generated/prisma/enums";
export const getAllResources = async (req: Request, res: Response) => {
  try {
    const companyId = res.locals.user.companyId;
    const status = (req.query.status as ResourceStatus) || undefined;
    const resources = await prisma.resource.findMany({
      where: { companyId, status },
    });

    if (!resources) {
      throw new Error
    }

    const allResources = resources.map((curr) => ({
      id: curr.id,
      name: curr.name,
      location: curr.location,
      department: curr.department,
      type: curr.type,
      availability: curr.availability,
      status: curr.status,
      totalQuantity: curr.totalQuantity,
      availableQuantity: curr.availableQuantity,
      createdAt: curr.createdAt,
      updatedAt: curr.updatedAt,
    }));

    const countsByStatus = await prisma.resource.groupBy({
      by: ["status"],
      _count: true,
    });

    const countsByType = await prisma.resource.groupBy({
      by: ["type"],
      _count: true,
    });

    res.json({
      success: true,
      message: "got all resources",
      allResources,
      countsByStatus: [
        ...countsByStatus,
        { _count: allResources.length, status: "all" },
      ],
      countsByType,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "server error , couldnt retirve the resources",
    });
  }
};

export const addResource = async (req: Request, res: Response) => {
  const {
    resourceName: name,
    quantity: totalQuantity,
    type,
    status,
    department,
    location,
    description,
  } = req.body; // we are renaming resourceName from frontend as name and so on for other fields to match the naming for db
  if (!name || !location || !department || !totalQuantity || !type || !status) {
    res.json({ message: "please provide all fields" });
  }

  try {
    const { companyId } = res.locals.user;
    console.log("this is companyId", companyId);

    if (!companyId) {
      return res.status(400).json({
        success: false,
        code: "USER_NOT_ENROLLED",
        message: "User does not belong to a company",
      });
    }
    await prisma.resource.create({
      data: {
        name,
        location,
        department,
        type,
        availability: true,
        status,
        totalQuantity,
        availableQuantity: totalQuantity,
        createdAt: new Date(),
        updatedAt: new Date(),
        companyId,
      },
    });

    return res.status(201).json({
      success: true,
      code: "RESOURCE_ADDED",
      message: "resource added successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: err,
      success: false,
      code: "SERVER_ERROR",
      message: "server error",
    });
  }
};
type params = {
  id: string;
};
export const getSpecificResource = async (
  req: Request<params>,
  res: Response,
) => {
  const id = req.params.id;
  const companyId = res.locals.user.companyId;
  if (!id) {
    return res.status(400).json({
      success: false,
      code: "ID_NOT_FOUND",
      message: "please provide an id",
    });
  }
  const resourceDetail = await prisma.resource.findUnique({
    where: { id, companyId },
  });
  if (!resourceDetail) {
    return res.status(404).json({
      success: false,
      code: "INVALID_ID",
      message: "invalid id ",
    });
  }
  return res.status(200).json({
    success: true,
    code: "SUCCESSFULL",
    message: "resource detail retrived successfully",
    resourceDetail,
  });
};

export const editResource = async (req: Request, res: Response) => {
  const { id, name, location, department, totalQuantity } = req.body;
  if (!id || !name || !location || !department || !totalQuantity) {
    return res.status(400).json({
      success: false,
      message: "please provide all fields",
      code: "MISSING_FIELDS",
    });
  }
  const companyId = res.locals.user.companyId;
  console.log("this is company id ", companyId);
  const updatedAt = new Date();
  if (!id) {
    return res
      .status(400)
      .json({ message: "please provide an id", success: false });
  }
  try {
    const resourceData = await prisma.resource.findUnique({
      where: { id, companyId },
    });
    if (!resourceData) {
      return res.status(400).json({
        success: false,
        message: "resource not found",
        code: "INVALID_ID",
      });
    }
    const editedResource = await prisma.resource.update({
      where: { id },
      data: {
        name,
        location,
        department,
        totalQuantity,
        updatedAt,
        companyId,
      },
    });
    res.status(201).json({
      message: "Resource updated successfully",
      code: "RESOURCE_UPDATED",
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: err,
      success: false,
      code: "SERVER_ERROR",
      message: "server error",
    });
  }
};
export const deleteResource = async (req: Request, res: Response) => {
  const id = req.body.id;
  const companyId = res.locals.companyId;
  if (!id) {
    return res.json({
      message: "please provide an id",
    });
  }
  try {
    await prisma.resource.delete({
      where: { id, companyId },
    });
    res.json({ message: "resource deleted successfully", success: true });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: err,
      success: false,
      code: "SERVER_ERROR",
      message: "server error",
    });
  }
};
export const releaseResource = async (req: Request, res: Response) => {
  const { resourceId } = req.body;
  const { email, companyId } = res.locals.user;
  try {
  } catch (err) {}
  await prisma.user.findUnique({ where: email, select: {} });
};
