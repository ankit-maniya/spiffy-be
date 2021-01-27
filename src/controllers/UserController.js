import { uploadStorage } from "../functions/uploadfile";
import {
  errorRes,
  successRes,
  removeFile,
  moveFile,
} from "../functions/helper";
import { model } from "../models";
import {
  LoginValidate,
  SignupValidate,
  UpdateUserValidate,
} from "../validation/UserSchema";
import { createToken } from "../functions/auth";
import { validatePassword } from "../models/User";

const login = async (req, res, next) => {
  try {
    const data = req.body;
    await LoginValidate(data);
    const iData = await model.User.findOne({
      mobile: data.mobile,
    });
    if (!iData) throw { message: "Not Valid User" };
    const iRes = await validatePassword(data.password, iData.password);
    if (!iRes) throw { message: "Invalid Password !!" };
    iData.authToken = await createToken(iData, "1h");
    res.send(successRes(iData));
  } catch (error) {
    res.send(errorRes(error.message));
  }
};

const signUp = async (req, res, next) => {
  try {
    // upload file using multer
    await uploadStorage(req, res);
    const data = req.body;
    const validation = await SignupValidate(data);
    if (validation) {
      if (req.files && req.files.profile && req.files.profile[0].filename) {
        removeFile(req.files.profile[0].filename, "TEMP");
      }

      throw { message: validation };
    }
    if (req.files && req.files.profile && req.files.profile[0].filename) {
      data["profile"] = req.files.profile[0].filename;
    }
    let userData = await model.User.create(data);
    if (req.files && req.files.profile) {
      await moveFile(userData.profile, userData._id, "USER");
    }
    userData.authToken = await createToken(userData, "1h");
    res.send(successRes(userData));
  } catch (error) {
    res.send(errorRes(error.message));
  }
};

const updateUser = async (req, res, next) => {
  try {
    // upload file using multer
    await uploadStorage(req, res);
    const { _id, profile } = req.user;
    const updateData = JSON.parse(JSON.stringify(req.body));
    const validation = await UpdateUserValidate(updateData);
    if (validation) {
      if (req.files && req.files.profile && req.files.profile[0].filename) {
        removeFile(req.files.profile[0].filename, "TEMP");
      }
      throw { message: validation };
    }
    if (req.files && req.files.profile && req.files.profile[0].filename) {
      updateData["profile"] = req.files.profile[0].filename;
      await moveFile(updateData["profile"], _id, "USER");
      if (profile) {
        removeFile(profile, "USER", _id);
      }
    }
    const user = await model.User.findByIdAndUpdate(
      {
        _id: _id,
      },
      {
        $set: updateData,
      },
      { new: true }
    );
    res.send(successRes(user));
  } catch (error) {
    res.send(errorRes(error.message));
  }
};

export const UserController = {
  login,
  signUp,
  updateUser,
};
