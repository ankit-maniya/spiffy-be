import { config } from "../../config";
import jwt from "jsonwebtoken";

export const me = async (req, res, next) => {
  try {
    if (!req.headers["x-token"]) throw "token is required";
    const user = await verifyAuthTocken(req.headers["x-token"]);
    // provide user data to access all route
    req.user = user;
    next();
  } catch (error) {
    res.status(403).send(error);
  }
};

export const createToken = async (data, expire) => {
  const { mobile, name } = data;
  const authToken = await jwt.sign({ mobile, name }, config.JWT_SECRET, {
    expiresIn: expire,
  });
  return authToken;
};

export const verifyAuthTocken = async (data) => {
  const token = await jwt.verify(data, process.env.TOKEN_SECRET);
  const user = await model.User.findById({
    _id: token._id,
  });
  if (!user) throw "Your Session Expired! Login Now!!";
  return user;
};
