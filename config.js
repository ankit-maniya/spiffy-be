import dotenv from "dotenv";
dotenv.config();
const {
  PORT,
  HOST,
  PORT_URL,
  MONGO_URL,
  FILE_STORE_PATH,
  SALT,
  JWT_SECRET,
} = process.env;
export const config = {
  PORT,
  HOST,
  PORT_URL,
  MONGO_URL,
  FILE_STORE_PATH,
  SALT,
  JWT_SECRET,
};
