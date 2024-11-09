import express, { Request, Response, NextFunction } from "express";
import logger from "./middleware/loggerMiddleware";
import authRouter from "./routes/authRoutes";

const app = express();
app.use(express.json());

app.use(logger);
app.use(authRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    message: err.message,
    success: false,
  });
});

app.listen(4000, () =>
  console.log("Server is running on http://localhost:4000")
);
