import { config } from "../../config";
import jwt from "jsonwebtoken";

export const createToken = async (data, expire) => {
  const { mobile, name } = data;
  console.log("tokenn----fsajd---", data);
  const authToken = await jwt.sign({ mobile, name }, config.JWT_SECRET, {
    expiresIn: expire,
  });
  return authToken;
};

export const verifyAuthTocken = async (data) => {
  const token = jwt.verify(data, process.env.TOKEN_SECRET);
  const user = await model.User.findById({
    _id: token._id,
  });
  if (!user) throw "Your Session Expired! Login Now!!";
  return user;
};
