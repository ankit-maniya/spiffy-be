import express from "express";
import MenuController from "../controllers/MenuController";
import { me } from "../functions/auth";

const Menu = express.Router();
/** For Authentication  */
Menu.use(me);
/** All Menu Routes */
Menu.get("/", MenuController.addMenu);
Menu.post("/", MenuController.deleteMenu);
Menu.patch("/", MenuController.updateMenu);

export default Menu;
