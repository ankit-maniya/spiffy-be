import User from "./User/User";
import Restaurent from "./Restaurent/Restaurent";
import Address from "./Address";
import Menu from "./Restaurent/Menu";
import Category from "./Restaurent/Category";
import Item from "./Restaurent/Item";
import mongoose from "mongoose";
import { config } from "../../config";

const connectDB = async () => {
  return await mongoose.connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};

export { connectDB };
export const model = {
  User,
  Restaurent,
  Address,
  Menu,
  Category,
  Item,
};
