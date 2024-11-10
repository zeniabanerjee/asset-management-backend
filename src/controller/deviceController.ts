import { Prisma, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export const getAllDevices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      deviceType,
      deviceName,
      serialNo,
      deviceAssignmentId,
      assignee,
      page = "1",
      limit = "10",
    } = req.query;

    const searchFilters: any = {};

    const skip = (Number(page) - 1) * Number(limit);

    if (deviceType) {
      searchFilters.deviceType = {
        contains: deviceType as string,
        mode: "insensitive",
      };
    }
    if (deviceName) {
      searchFilters.deviceName = {
        contains: deviceName as string,
        mode: "insensitive",
      };
    }
    if (serialNo) {
      searchFilters.serialNo = {
        contains: serialNo as string,
        mode: "insensitive",
      };
    }
    if (deviceAssignmentId) {
      searchFilters.deviceAssignmentId = {
        contains: deviceAssignmentId as string,
        mode: "insensitive",
      };
    }
    if (assignee) {
      searchFilters.assignee = {
        contains: assignee as string,
        mode: "insensitive",
      };
    }

    const allDevices = await prisma.devices.findMany({
      where: { ...searchFilters, isDeleted: false },
      skip,
      take: Number(limit),
    });

    const totalDevices = await prisma.employees.count({
      where: searchFilters,
    });

    const totalPages = Math.ceil(totalDevices / Number(limit));

    res.json({
      data: allDevices,
      success: true,
      message: "Devices fetched successfully",
      pagination: {
        totalDevices,
        totalPages,
        currentPage: Number(page),
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create or Update a device
export const addOrUpdateDevice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { id } = req.params;

  let addOrUpdate = "updated";

  if (!id) {
    id = crypto.randomUUID();
    addOrUpdate = "added";
  }

  const {
    deviceType,
    deviceName,
    deviceDescription,
    deviceAssignmentId,
    serialNo,
    assignee,
    isOutdated,
  } = req.body;

  try {
    let linkedEmployee;

    if (deviceAssignmentId) {
      let month = new Date().toLocaleDateString().split("/")[0];
      Number(month) < 10 ? (month = `0${month}`) : (month = month);
      const year = new Date().toLocaleDateString().split("/")[2].substring(2);
      if (
        deviceAssignmentId.substring(3, 5) !== month ||
        deviceAssignmentId.substring(5, 7) !== year
      ) {
        next(
          new Error(
            "The month and year of deviceAssignmentId needs to be the present month and year"
          )
        );
      }
    }

    let historyId;
    let historyDetails;

    if (assignee) {
      linkedEmployee = await prisma.employees.findUnique({
        where: {
          employeeEmail: assignee,
        },
      });

      historyDetails = await prisma.history.findUnique({
        where: {
          deviceId: id,
        },
      });

      if (!historyDetails) {
        historyId = crypto.randomUUID();
      } else {
        historyId = historyDetails.id;
      }
    }

    if (!linkedEmployee) {
      next(new Error("Assignee does not exist!"));
    }

    const updatedDevice = await prisma.devices.upsert({
      where: { id },
      create: {
        id,
        deviceType,
        deviceName,
        serialNo,
        assignee,
        employeeId: linkedEmployee?.id,
        deviceDescription,
        deviceAssignmentId,
        isOutdated,
      },
      update: {
        deviceType,
        deviceName,
        serialNo,
        assignee,
        employeeId: linkedEmployee?.id,
        updatedAt: new Date(),
        deviceDescription,
        deviceAssignmentId,
        isOutdated,
      },
    });

    if (linkedEmployee) {
      await prisma.history.upsert({
        where: {
          id: historyId,
        },
        create: {
          id: historyId,
          deviceId: id,
          currentUser: linkedEmployee?.id,
          previousUsers: [],
        },
        update: {
          deviceId: id,
          currentUser: linkedEmployee?.id,
          previousUsers: {
            set: [
              ...(historyDetails?.previousUsers ?? []),
              historyDetails?.currentUser ?? "",
            ],
          },
          updatedAt: new Date(),
        },
      });
    }

    res.json({
      data: updatedDevice,
      message: `Device ${addOrUpdate} successfully`,
      success: true,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (
        error.message.includes(
          "Unique constraint failed on the fields: (`device_assignment_id`)"
        )
      ) {
        next(new Error("device_assignment_id will be unique!"));
      } else if (
        error.message.includes(
          "Unique constraint failed on the fields: (`serial_no`)"
        )
      ) {
        next(new Error("Serial number will be unique!"));
      }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      if (
        error.message.includes(
          "Invalid value for argument `deviceType`. Expected Devices."
        )
      )
        next(
          new Error(
            "Device Type will have only 'Phone' 'Watch' 'IMac' 'MacMini' 'MacBook' keywords as values!"
          )
        );
    }
    next(error);
  }
};

// Delete a device
export const deleteDevice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const deletedDevice = await prisma.devices.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isDeleted: true,
      },
    });
    res.json({
      data: deletedDevice,
      message: "Employee deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
