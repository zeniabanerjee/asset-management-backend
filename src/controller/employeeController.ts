import { Prisma, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

export const addOrUpdateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { id } = req.params;
  let updatedOrNot = "updated";

  if (!id) {
    id = crypto.randomUUID();
    updatedOrNot = "added";
  }

  const {
    employeeEmail,
    employeeName,
    employeePhone,
    employeeStatus,
    employeeTeam,
  } = req.body;

  try {
    const updatedEmployee = await prisma.employees.upsert({
      where: {
        id,
      },
      update: {
        employeeEmail,
        employeeName,
        employeePhone,
        employeeStatus,
        employeeTeam,
      },
      create: {
        id,
        employeeEmail,
        employeeName,
        employeePhone,
        employeeStatus,
        employeeTeam,
      },
    });

    res.status(StatusCodes.OK).json({
      data: updatedEmployee,
      message: `Employee ${updatedOrNot} successfully!`,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        next(new Error("User already exists!"));
      }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      if (
        error.message.includes(
          "Invalid value for argument `employeeStatus`. Expected EmployeeStatus."
        )
      ) {
        next(
          new Error(
            "Employee Status will have only 'Active' and 'Inactive' keywords as values!"
          )
        );
      }
    }
    next(error);
  }
};
