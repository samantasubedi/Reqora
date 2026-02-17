import { Request, Response } from "express";
export const getAllResources = (req: Request, res: Response) => {
  res.send("gets all resources ");
};
export const getSpecificResource = (req: Request, res: Response) => {
  const id = req.params.id;
  res.send(`gets details for a sepecific user with id ${id}`);
};
export const addResource = (req: Request, res: Response) => {
  res.json({ message: "used to add resources by admin" });
};
export const editResource=(req:Request, res:Response) => {
  const id = req.params.id;
  res.json({
    message: `used to update a particular resource details with id ${id}`,
  });
}
export const deleteResource=(req:Request, res:Response) => {
  const id = req.params.id;
  res.json({ message: `used to delete a specific resource with id ${id}` });
}