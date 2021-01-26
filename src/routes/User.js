import express from "express";

import { UserController } from "../controllers/UserController";
import { verifyAuthTocken } from "../functions/auth";
const User = express.Router();

User.get("/", UserController.login);
User.post("/", UserController.signUp);

User.use(async function (req, res, next) {
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

export default User;
