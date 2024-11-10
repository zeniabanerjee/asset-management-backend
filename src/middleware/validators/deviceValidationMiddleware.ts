import { RequestHandler } from "express";
import { deviceValidator } from "../../validators/deviceValidators";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export const deviceValidation: RequestHandler = async (req, res, next) => {
  try {
    const { body } = req;

    deviceValidator.parse(body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(StatusCodes.NOT_FOUND);
      next(new Error(error.errors[0].message));
    }
    next(error);
  }
};
