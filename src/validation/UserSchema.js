import { isEmail } from "validator";
import Joi from "joi";
// const Joi = JoiObj.defaults((schema) => schema.options({ convert: false }));
const signUpSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  mobile: Joi.string().min(10).max(13).required(),
  password: Joi.string().required(),
  repassword: Joi.string().valid(Joi.ref("/password")).required(),
  email: Joi.string().email().required(),
});

export const SignupValidate = async (req) => {
  const keys = Object.keys(req);
  // name
  if (Array.isArray(keys) && !keys.includes("name")) {
    throw "Please Enter A Name";
  }
  // address
  if ((Array.isArray(keys) && !keys.includes("address")) || req.address == "") {
    throw "Please Enter A Address And It will be Array";
  }
  // mobile
  if ((Array.isArray(keys) && !keys.includes("mobile")) || req.mobile == "") {
    throw "Please Enter Mobile";
  } else {
    if (!checkMobile(req.mobile)) {
      throw "Please Enter Valid Mobile";
    }
  }

  // password & repassword
  if (
    (Array.isArray(keys) && !keys.includes("password")) ||
    req.password == ""
  ) {
    throw "Please Enter password";
  } else {
    if (
      (Array.isArray(keys) && !keys.includes("repassword")) ||
      req.repassword == ""
    )
      throw "Both Password Not Match";
    else {
      if (keys.includes("repassword") && req.repassword !== req.password)
        throw "Both Password Not Match";
    }
  }

  // optional emailid
  if ((Array.isArray(keys) && !keys.includes("email")) || req.email == "") {
    throw "Please Enter Email";
  } else {
    if (keys.includes("email") && !isEmail(req.email)) {
      throw "Please Enter Proper Email";
    }
  }
};

const checkMobile = (data) => {
  if (data.length < 10 && 13 > data.length) return false;
  return true;
};

export const Userschema = {};
