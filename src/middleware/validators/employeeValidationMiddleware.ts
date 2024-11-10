import { RequestHandler } from "express";
import { employeeValidator } from "../../validators/employeeValidator";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";

const employeeValidation: RequestHandler = async (req, res, next) => {
  try {
    const { body } = req;

    employeeValidator.parse(body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(StatusCodes.NOT_FOUND);
      next(new Error(error.errors[0].message));
    }
    next(error);
  }
};
export default employeeValidation;
