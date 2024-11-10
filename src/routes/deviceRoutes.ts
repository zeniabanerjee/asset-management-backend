import express from "express";
import {
  getAllDevices,
  addOrUpdateDevice,
  deleteDevice,
} from "../controller/deviceController";
import tokenVerification from "../middleware/tokenVerification/tokenverification";
import { verifyAdmin } from "../middleware/verifyAdmin/verifyAdmin";
import { deviceValidation } from "../middleware/validators/deviceValidationMiddleware";

const deviceRoutes = express.Router();

deviceRoutes.use(tokenVerification);
deviceRoutes.use(verifyAdmin);

deviceRoutes.get("/all-devices", getAllDevices);
deviceRoutes.post("/create-device", [deviceValidation], addOrUpdateDevice);
deviceRoutes.put("/update-device/:id", [deviceValidation], addOrUpdateDevice);
deviceRoutes.delete("/delete-device/:id", deleteDevice);

export default deviceRoutes;
