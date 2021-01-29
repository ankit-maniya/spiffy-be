import express from "express";
import MenuController from "../controllers/MenuController";
import { me } from "../functions/auth";

const Menu = express.Router();
/** For Authentication  */
Menu.use(me);
/** All Menu Routes */
Menu.get("/", MenuController.getMenu);
Menu.post("/", MenuController.addMenu);
Menu.patch("/", MenuController.updateMenu);
Menu.get("/:id", MenuController.deleteMenu);

export default Menu;
