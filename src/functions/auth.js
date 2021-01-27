import { config } from "../../config";
import jwt from "jsonwebtoken";
import  mongoose  from "mongoose";

export const me = async (req, res, next) => {
  try {
    if (!req.headers["x-token"]) throw "token is required";
    const user = await verifyAuthTocken(req.headers["x-token"]);
    console.log(user);
    
    // provide user data to access all route
    req.user = user;
    next();
  } catch (error) {
    res.status(403).send({error});
  }
};

export const createToken = async (data, expire) => {
  const { mobile, name, _id } = data;
  console.log(typeof _id);
  
  const authToken = await jwt.sign({ mobile, name ,_id}, config.JWT_SECRET, {
    expiresIn: expire,
  });
  return authToken;
};

export const verifyAuthTocken = async (xtoken) => {
  const token = await jwt.verify(xtoken, config.JWT_SECRET);
  const id = mongoose.Types.ObjectId(token._id)
  console.log("ttt--",typeof id);
  
  const user = await model.User.findById({
    _id: id,
  });
  console.log(user);
  
  if (!user) throw "Your Session Expired! Login Now!!";
  return user;
};
