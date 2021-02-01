import express from "express";
import { StoreController } from "../controllers/RestaurentController";
import { me } from "../functions/auth";

const Store = express.Router();

Store.get("/", StoreController.logIn);
Store.post("/", StoreController.signUp);
Store.patch("/", me, StoreController.updateRestaurent);

export default Store;
