import { uploadStorage } from "../functions/uploadfile";
import { errorRes, successRes } from "../functions/helper";
import { model } from "../models";
import { SignupValidate } from "../validation/UserSchema";
import { createToken } from "../functions/auth";

// const login = async (req, res, next) => {
//   await model.User.validatePassword()
// };

const signUp = async (req, res, next) => {
  try {
    // upload file using multer
    await uploadStorage(req, res);
    const data = req.body;

    await new Promise((resolve, reject) => {
      // user data validation
      const userValidate = SignupValidate(data);
      if (userValidate) resolve(userValidate);
      reject(userValidate);
    }).then(async () => {
      // check file is uploaded or not!
      if (req.files && req.files.profile[0].filename) {
        data["profile"] = req.files.profile[0].filename;
      }
      await model.User.create(data).exec((fres, ferr) => {
        if (fres) {
          console.log(fres);
        } else {
          // console.log("ds", ferr);
        }
      });
      const iRes = [];
      // const token = await createToken(userData, "1h");
      // userData.token = token;
      // console.log(userData);
      res.send(successRes("dvkh"));
    });
  } catch (error) {
    res.send(errorRes(error));
  }
};

export const UserController = {
  // login,
  signUp,
};
