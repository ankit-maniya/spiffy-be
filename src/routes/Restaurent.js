import express from "express";
import { RestaurentController } from "../controllers/RestaurentController";
import { me } from "../functions/auth";

const Restaurent = express.Router();

Restaurent.get("/", RestaurentController.logIn);
Restaurent.post("/", RestaurentController.signUp);
Restaurent.patch("/", me, RestaurentController.updateRestaurent);

export default Restaurent;
