import express from "express";
import CategoryController from "../controllers/CategoryController";
import { me } from "../../functions/auth";

const Category = express.Router();
/** For Authentication  */
Category.use(me);
/** All Category Routes */
Category.get("/", CategoryController.getAllCategory);
Category.get("/:categoryId", CategoryController.getCategory);
Category.post("/", CategoryController.addCategory);
Category.patch("/", CategoryController.updateCategory);
Category.delete("/:categoryId?", CategoryController.deleteCategory);

export default Category;
