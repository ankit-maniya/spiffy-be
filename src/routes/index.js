import express from "express";
import User from "./User/User";
import Restaurent from "./Restaurent";
const route = express.Router();

route.get("/", (req, res, next) => {
    res.send("Api called ");
});

/** User */
route.use("/user", User);

/** Restaurent */
route.use("/restaurent", Restaurent.Restaurent);

/** Menu */
route.use("/menu", Restaurent.Menu);

/** Category */
route.use("/category", Restaurent.Category);

/** Item */
route.use("/item", Restaurent.Item);

export default route;
