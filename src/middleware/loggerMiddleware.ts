import { RequestHandler } from "express";

const logger: RequestHandler = (req, res, next) => {
  console.log("Request URL : ", req.url);
  console.log("Request Method : ", req.method);
  console.log(`Request Time: ${new Date().toLocaleTimeString()}`);
  console.log(`Request Headers: ${JSON.stringify(req.headers)}`);
  console.log(`Request Body: ${JSON.stringify(req.body)}`);

  next();
};

export default logger;
