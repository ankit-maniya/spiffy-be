import express from "express";
import { me } from "../functions/auth";
import { errorRes } from "../functions/helper";
import User from "./User";
const route = express.Router();

route.get("/", (req, res, next) => {
  res.send("Api called ");
});
route.use("/user", User);

// verify all requests after called user
route.use(me);

export default route;
