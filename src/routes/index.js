import express from "express";
import User from "./User";
import Store from "./Store";
import Menu from "./Menu";
import Item from "./Item";
import Category from "./Category";
import Order from "./Comman/Order";
const route = express.Router();

route.get("/", (req, res, next) => {
  res.send("Api called ");
});

/** User */
route.use("/user", User);

/** Store */
route.use("/store", Store);

/** Menu */
route.use("/menu", Menu);

/** Category */
route.use("/category", Category);

/** Item */
route.use("/item", Item);

/** Order */
route.use("/order", Order);

export default route;
