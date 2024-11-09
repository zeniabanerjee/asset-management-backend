import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcryptjs from "bcryptjs";
import { tokenGenerator } from "../helper/tokenGenerator";

const prisma = new PrismaClient();

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { employeeEmail, employeePassword } = req.body;

    if (!employeeEmail || !employeePassword) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Email and password is required");
    }

    const employeeDetails = await prisma.employees.findUnique({
      where: {
        employeeEmail,
      },
    });

    if (!employeeDetails) {
      res.status(StatusCodes.NOT_FOUND);
      throw new Error("User not found!");
    }

    const id = employeeDetails.id;
    let passwordMatches;

    if (employeeDetails.employeePassword) {
      passwordMatches = await bcryptjs.compare(
        employeePassword,
        employeeDetails.employeePassword
      );
    }

    if (!passwordMatches) {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Invalid credentials!");
    }

    if (employeeDetails.employeeType !== "Admin") {
      res.status(StatusCodes.BAD_REQUEST);
      throw new Error("Invalid action!");
    }

    const tokens = tokenGenerator({ id });

    res.status(StatusCodes.OK).json({
      data: {
        tokens,
        userDetails: {
          email: employeeDetails.employeeEmail,
          name: employeeDetails.employeeName,
          phone: employeeDetails.employeePhone,
          status: employeeDetails.employeeStatus,
        },
      },
      message: "Welcome Back!",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
