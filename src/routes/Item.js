import express from "express";
import ItemController from "../controllers/ItemController";
import { me } from "../functions/auth";

const Item = express.Router();
/** For Authentication  */
Item.use(me);
/** All Item Routes */
Item.get("/", ItemController.getAllItem);
Item.get("/:itemId", ItemController.getItem);
Item.post("/", ItemController.addItem);
Item.patch("/", ItemController.updateItem);
Item.delete("/:itemId?", ItemController.deleteItem);

export default Item;
