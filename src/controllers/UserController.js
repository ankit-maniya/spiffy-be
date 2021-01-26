import { uploadStorage } from "../functions/uploadfile";
import { errorRes, successRes } from "../functions/helper";
import { model } from "../models";
import { LoginValidate, SignupValidate } from "../validation/UserSchema";
import { createToken } from "../functions/auth";
import { validatePassword } from "../models/User";

const login = async (req, res, next) => {
  try {
    const data = req.body;
    await LoginValidate(data);
    const iData = await model.User.findOne({
      mobile: data.mobile,
    });
    if (!iData) throw "Not Valid User";
    const iRes = await validatePassword(data.password, iData.password);
    if (!iRes) throw "Invalid Password !!";
    iData.authToken = await createToken(iData, "1h");
    res.send(successRes(iData));
  } catch (error) {
    res.send(errorRes(error));
  }
};

const signUp = async (req, res, next) => {
  try {
    // upload file using multer
    await uploadStorage(req, res);
    const data = req.body;

    await new Promise((resolve, reject) => {
      // user data validation
      const userValidate = SignupValidate(data);
      if (userValidate) resolve(userValidate);
    }).then(async () => {
      // check file is uploaded or not!
      if (req.files && req.files.profile[0].filename) {
        data["profile"] = req.files.profile[0].filename;
      }
      let userData = await model.User.create(data);
      userData.authToken = await createToken(userData, "1h");
      res.send(successRes(userData));
    });
  } catch (error) {
    res.send(errorRes(error));
  }
};

export const UserController = {
  login,
  signUp,
};
