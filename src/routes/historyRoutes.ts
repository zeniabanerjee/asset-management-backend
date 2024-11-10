import express from "express";
import { getHistory, deleteHistory } from "../controller/historyController";
import tokenVerification from "../middleware/tokenVerification/tokenverification";
import { verifyAdmin } from "../middleware/verifyAdmin/verifyAdmin";

const historyRoutes = express.Router();

historyRoutes.use(tokenVerification);
historyRoutes.use(verifyAdmin);

historyRoutes.get("/all-history", getHistory);
historyRoutes.get("/delete-history/:id", deleteHistory);

export default historyRoutes;
