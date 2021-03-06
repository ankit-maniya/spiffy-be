import User from "./User";
import Restaurent from "./Restaurent";
import Address from "./Address";
import Menu from "./Menu";
import Category from "./Category";
import Item from "./Item";
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
