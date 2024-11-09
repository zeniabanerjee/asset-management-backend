import express from "express";
import { signIn } from "../controller/authController";

const authRouter = express.Router();

authRouter.post("/sign-in", signIn);

export default authRouter;
