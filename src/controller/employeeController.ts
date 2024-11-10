import { employees, Prisma, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

export const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      employeeName,
      employeeEmail,
      employeePhone,
      employeeTeam,
      employeeStatus,
      page = "1",
      limit = "10",
    } = req.query;

    const searchFilters: any = {};

    if (employeeName) {
      searchFilters.employeeName = {
        contains: employeeName as string,
        mode: "insensitive",
      };
    }

    if (employeeEmail) {
      searchFilters.employeeEmail = {
        contains: employeeEmail as string,
        mode: "insensitive",
      };
    }

    if (employeePhone) {
      searchFilters.employeePhone = {
        contains: employeePhone as string,
        mode: "insensitive",
      };
    }

    if (employeeTeam) {
      searchFilters.employeeTeam = {
        contains: employeeTeam as string,
        mode: "insensitive",
      };
    }

    if (employeeStatus) {
      searchFilters.employeeStatus = {
        contains: employeeStatus as string,
        mode: "insensitive",
      };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const allEmployees = await prisma.employees.findMany({
      where: { ...searchFilters, isDeleted: false },
      skip,
      take: Number(limit),
    });

    const totalEmployees = await prisma.employees.count({
      where: searchFilters,
    });

    const totalPages = Math.ceil(totalEmployees / Number(limit));

    res.status(StatusCodes.OK).json({
      data: {
        data: allEmployees,
        pagination: {
          totalPages,
          totalEmployees,
          currentPage: Number(page),
          limit,
        },
      },
      message: "All employees fetched successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

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
    const updatedEmployee: employees = await prisma.employees.upsert({
      where: {
        id,
      },
      update: {
        employeeEmail,
        employeeName,
        employeePhone,
        employeeStatus,
        employeeTeam,
        updatedAt: new Date(),
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

// Delete a user
export const deleteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const deletedEmployee: employees = await prisma.employees.update({
      where: { id: id },
      data: {
        deletedAt: new Date(),
        isDeleted: true,
      },
    });
    res.json({
      data: deletedEmployee,
      message: "Employee deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
