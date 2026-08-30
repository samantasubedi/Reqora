import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod/v3";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "invalid request data",
        errors: result.error.issues,
      });
    }
    req.body = result.data;
    next();
  };
};
