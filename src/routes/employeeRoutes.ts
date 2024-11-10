import express from "express";
import {
  getAllEmployees,
  //   deleteEmployee,
  addOrUpdateEmployee,
} from "../controller/employeeController";
import tokenVerification from "../middleware/tokenVerification/tokenverification";
import { verifyAdmin } from "../middleware/verifyAdmin/verifyAdmin";
import employeeValidation from "../middleware/validators/employeeValidationMiddleware";

const employeeRoute = express.Router();

employeeRoute.use(tokenVerification);
employeeRoute.use(verifyAdmin);

employeeRoute.get("/all-employee", getAllEmployees);
employeeRoute.post(
  "/create-employee",
  [employeeValidation],
  addOrUpdateEmployee
);
employeeRoute.put(
  "/update-employee/:id",
  [employeeValidation],
  addOrUpdateEmployee
);
// employeeRoute.delete("/delete-employee/:id", deleteEmployee);

export default employeeRoute;
