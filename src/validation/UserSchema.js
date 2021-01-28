import { isEmail } from "validator";
import Joi from "joi";
import { model } from "../models";
// const Joi = JoiObj.defaults((schema) => schema.options({ convert: false }));
const signUpSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  mobile: Joi.string().min(10).max(13).required(),
  password: Joi.string().required(),
  repassword: Joi.string().valid(Joi.ref("/password")).required(),
  email: Joi.string().email().required(),
});

export const SignupValidate = (req) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req);
    // name
    if (Array.isArray(keys) && !keys.includes("name")) {
      resolve("Please Enter A Name");
    }
    // emailid
    if ((Array.isArray(keys) && !keys.includes("email")) || req.email == "") {
      resolve("Please Enter Email");
    } else {
      if (keys.includes("email") && !isEmail(req.email)) {
        resolve("Please Enter Proper Email");
      } else {
        const found = await model.User.findOne({ email: req.email });
        if (found) {
          resolve("Email is Alredy Register! Use Diffrent Email!");
        }
      }
    }
    // mobile
    if ((Array.isArray(keys) && !keys.includes("mobile")) || req.mobile == "") {
      resolve("Please Enter Mobile");
    } else {
      if (!checkMobile(req.mobile)) {
        resolve("Please Enter Valid Mobile");
      } else {
        const found = await model.User.findOne({ mobile: req.mobile });
        if (found) {
          resolve("Mobile is Alredy Register! Use Diffrent Mobile!");
        }
      }
    }
    // address
    if (
      (Array.isArray(keys) && !keys.includes("address")) ||
      req.address == []
    ) {
      resolve("Please Enter A Address And It will be Array of Object");
    } else {
      req.address.map((addr) => {
        console.log(addr.latitude.length);
        const latitude = addr.latitude;
        const longitude = addr.longitude;
        if (
          (latitude == "" && latitude.length == 0) ||
          (longitude == "" && longitude.length == 0)
        )
          resolve("Please Enter a Address");
      });
    }
    // password & repassword
    if (
      (Array.isArray(keys) && !keys.includes("password")) ||
      req.password == ""
    ) {
      resolve("Please Enter password");
    } else {
      if (req.password != "") {
        const regx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
        if (!regx.test(req.password)) {
          resolve(
            "Warning Password Contain at least 1 special character,1 uppercase letter,1 lowercase letter,1 numeric character And 8 characters!! Ex:Test@123"
          );
        }
      }
      if (
        (Array.isArray(keys) && !keys.includes("repassword")) ||
        req.repassword == ""
      )
        resolve("Please Enter password");
      else {
        if (keys.includes("repassword") && req.repassword !== req.password)
          resolve("password && repassword! Both Password Not Match");
      }
    }
    resolve("");
  });
};

export const LoginValidate = async (req) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req);

    // mobile
    if ((Array.isArray(keys) && !keys.includes("mobile")) || req.mobile == "") {
      reject({ message: "Please Enter Mobile" });
    } else {
      if (!checkMobile(req.mobile)) {
        reject({ message: "Please Enter Valid Mobile" });
      }
    }
    // password & repassword
    if (
      (Array.isArray(keys) && !keys.includes("password")) ||
      req.password == ""
    ) {
      reject({ message: "Please Enter password" });
    }

    resolve("");
  });
};

export const UpdateUserValidate = (req, LoginId) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req);
    // name
    if (Array.isArray(keys) && keys.includes("name") && req.name == "") {
      resolve("Please Enter A Name");
    }
    // address
    if (Array.isArray(keys) && keys.includes("address") && req.address == []) {
      resolve("Please Enter A Address And It will be Array");
    } else {
      if (keys.includes("address") && req.address != []) {
        req.address.map((addr) => {
          console.log(addr.latitude.length);
          const latitude = addr.latitude;
          const longitude = addr.longitude;
          if (
            (latitude == "" && latitude.length == 0) ||
            (longitude == "" && longitude.length == 0)
          )
            resolve("Please Enter a Address");
        });
      }
    }

    // mobile
    if (Array.isArray(keys) && keys.includes("mobile") && req.mobile == "") {
      resolve("Please Enter Mobile");
    } else {
      if (keys.includes("mobile") && req.mobile != "") {
        if (!checkMobile(req.mobile)) {
          resolve("Please Enter Valid Mobile");
        } else {
          const found = await model.User.findOne({ mobile: req.mobile });
          if (found && JSON.stringify(found._id) != JSON.stringify(LoginId)) {
            resolve("Mobile is Alredy Register! Use Diffrent Mobile!");
          }
        }
      }
    }

    // password & repassword
    if (
      Array.isArray(keys) &&
      keys.includes("password") &&
      req.password == ""
    ) {
      resolve("Please Enter password");
    } else {
      if (keys.includes("password") && req.password != "") {
        const regx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
        if (!regx.test(req.password)) {
          resolve(
            "Warning Password Contain at least 1 special character,1 uppercase letter,1 lowercase letter,1 numeric character And 8 characters!! Ex:Test@123"
          );
        }
        if (
          (Array.isArray(keys) && !keys.includes("repassword")) ||
          req.repassword == ""
        )
          resolve("Please Enter password");
        else {
          if (keys.includes("repassword") && req.repassword !== req.password)
            resolve("password && repassword! Both Password Not Match");
        }
      }
    }

    // optional emailid
    if (Array.isArray(keys) && keys.includes("email") && req.email == "") {
      resolve("Please Enter Email");
    } else {
      if (keys.includes("email") && !isEmail(req.email)) {
        resolve("Please Enter Proper Email");
      } else if (keys.includes("email") && req.email != "") {
        const found = await model.User.findOne({ email: req.email });
        if (found && JSON.stringify(found._id) != JSON.stringify(LoginId)) {
          resolve("Email is Alredy Register! Use Diffrent Email!");
        }
      }
    }
    resolve("");
  });
};

const checkMobile = (data) => {
  if (data.length < 10 && 13 > data.length) return false;
  return true;
};

export const Userschema = {};
