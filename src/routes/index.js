import express from "express";
import { verifyAuthTocken } from "../functions/auth";
import { errorRes } from "../functions/helper";

import User from "./User";
const route = express.Router();

route.get("/", (req, res, next) => {
  res.send("Api called ");
});

route.use("/user", User);

route.use(async function (req, res, next) {
  try {
    if (!req.headers["x-token"]) throw "token is required";
    const user = await verifyAuthTocken(req.headers["x-token"]);
    // provide user data to access all route
    req.user = user;
    next();
  } catch (error) {
    res.status(403).send(errorRes(error));
  }
});

export default route;
