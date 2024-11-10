import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allDeviceHistory = await prisma.history.findMany();

    res.json({
      data: allDeviceHistory,
      success: true,
      message: "All device history fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const deletedHistory = await prisma.history.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isDeleted: true,
      },
    });
    res.json({
      data: deletedHistory,
      message: "History deleted successfully",
      success: true,
    });
  } catch (error) {}
};
