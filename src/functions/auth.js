import { config } from "../../config";
import jwt from "jsonwebtoken";

export const createToken = async (data, expire) => {
  const { mobile, name } = data;
  const authToken = await jwt.sign({ mobile, name }, config.JWT_SECRET, {
    expiresIn: expire,
  });
  return authToken;
};
