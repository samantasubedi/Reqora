import { Request, Response } from "express";
export const getAllRequest = (req: Request, res: Response) => {
  const role = res.locals.user.role;
  if (role === "employee") {
    res.json({ message: "this sends all requests sent by a employee" });
  }
  if (role == "manager") {
    res.send("gets all requests used to be viewed by manager");
  }
};
export const getSpecificRequest = (req: Request, res: Response) => {
  const id = req.params.id;
  res.send(`gets a specific request with id ${id}`);
};
export const createRequest = (req: Request, res: Response) => {
  res.json({ message: "used to create a request" });
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
