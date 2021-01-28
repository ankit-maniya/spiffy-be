import express from "express";
import User from "./User";
import Restaurent from "./Restaurent";
const route = express.Router();

route.get("/", (req, res, next) => {
  res.send("Api called ");
});

/** User */ 
route.use("/user", User);

/** Restaurent */ 
route.use("/restaurent",Restaurent)


export default route;
