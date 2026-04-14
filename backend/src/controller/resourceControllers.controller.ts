import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
export const getAllResources = async (req: Request, res: Response) => {
  try {
    const resources = await prisma.resource.findMany();
    res.json({
      success: true,
      message: "got all resources",
      resources,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "server error , couldnt retirve the resources",
    });
  }
};

export const addResource = async (req: Request, res: Response) => {
  const { name, location, department, totalQuantity } = req.body;
  if (!name || !location || !department || !totalQuantity) {
    res.json({ message: "please provide all fields" });
  }

  try {
    const email = res.locals.user.email;
    const companyInfo = await prisma.user.findUnique({
      where: { email },
      select: {
        company: {
          select: { id: true },
        },
      },
    });
    const companyId = companyInfo?.company?.id;

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
        availability: true,
        status: "available",
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

export const getSpecificResource = (req: Request, res: Response) => {
  const id = req.params.id;
  res.send(`gets details for a sepecific user with id ${id}`);
};

export const editResource = async (req: Request, res: Response) => {
  const id = req.body.id;
};
export const deleteResource = async (req: Request, res: Response) => {
  const id = req.body.id;
  if (!id) {
    return res.json({
      message: "please provide an id",
    });
  }
  try {
    await prisma.resource.delete({
      where: { id },
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
