import express from "express";
import MenuController from "../controllers/MenuController";
import { me } from "../functions/auth";

const Menu = express.Router();
/** For Authentication  */
Menu.use(me);
/** All Menu Routes */
Menu.get("/", MenuController.getAllMenu);
Menu.get("/:menuId", MenuController.getMenu);
Menu.post("/", MenuController.addMenu);
Menu.patch("/", MenuController.updateMenu);
Menu.delete("/:menuId?", MenuController.deleteMenu);

export default Menu;
