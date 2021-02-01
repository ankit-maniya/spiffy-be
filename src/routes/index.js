import express from "express";
import User from "./User";
import Restaurent from "./Restaurent";
import Menu from "./Menu";
import Item from "./Item";
import Category from "./Category";
const route = express.Router();

route.get("/", (req, res, next) => {
  res.send("Api called ");
});

/** User */
route.use("/user", User);

/** Restaurent */
route.use("/restaurent", Restaurent);

/** Menu */
route.use("/menu", Menu);

/** Category */
route.use("/category", Category);

/** Item */
route.use("/item", Item);

export default route;
