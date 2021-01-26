import express from "express";

import { UserController } from "../controllers/UserController";

const User = express.Router();

User.get("/", UserController.login);
User.post("/", UserController.signUp);

export default User;
