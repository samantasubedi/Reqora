import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
export const getAllResources = async (req: Request, res: Response) => {
  try {
    const resources = await prisma.resource.findMany();
    console.log(resources);
    res.json({ message: "got all resources" });
  } catch (err) {
    console.log(err);
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

export const editResource = (req: Request, res: Response) => {
  const id = req.params.id;
  res.json({
    message: `used to update a particular resource details with id ${id}`,
  });
};
export const deleteResource = (req: Request, res: Response) => {
  const id = req.params.id;
  res.json({ message: `used to delete a specific resource with id ${id}` });
};
