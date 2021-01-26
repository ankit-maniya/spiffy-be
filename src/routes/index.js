import express from "express";

import User from "./User";
const route = express.Router();

route.get("/", (req, res, next) => {
  res.send("Api called ");
});

route.use("/user", User);

export default route;
