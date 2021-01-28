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

    await LoginValidate(data); //validate a key and value
    const iData = await model.User.findOne({
      //find user with this mobile
      mobile: data.mobile,
    });
    if (!iData) throw { message: "Not Valid User" };
    const iRes = await validatePassword(data.password, iData.password); //check password match or not
    if (!iRes) throw { message: "Invalid Password !!" };
    iData.authToken = await createToken(iData, "1h"); // create authtoken
    res.send(successRes(iData)); // get success response
  } catch (error) {
    res.send(errorRes(error.message)); // get error response
  }
};

const signUp = async (req, res, next) => {
  try {
    await uploadStorage(req, res); // upload file using multer
    const data = req.body;
    if (req.body.address) {
      data.address = JSON.parse(req.body.address); // address is json stringyfied
    }
    const validation = await SignupValidate(data); // validate a key and value

    if (validation) {
      if (req.files && req.files.profile && req.files.profile[0].filename) {
        // if error remove file
        removeFile(req.files.profile[0].filename, "TEMP");
      }
      throw { message: validation }; //   throw error
    }
    if (req.files && req.files.profile && req.files.profile[0].filename) {
      // set profile for add name in database
      data["profile"] = req.files.profile[0].filename;
    }
    let userData = await model.User.create(data); // add user data
    if (req.files && req.files.profile) {
      // move file from TEMP location
      await moveFile(userData.profile, userData._id, "USER");
    }
    userData.authToken = await createToken(userData, "1h"); // create authtoken
    res.send(successRes(userData)); // get success response
  } catch (error) {
    res.send(errorRes(error.message)); // get error response
  }
};

const updateUser = async (req, res, next) => {
  try {
    await uploadStorage(req, res); // upload file using multer as a middle ware
    const { _id, profile } = req.user; // login user data
    const updateData = JSON.parse(JSON.stringify(req.body)); // remove unusual [obj]
    const validation = await UpdateUserValidate(updateData, _id); // validate a key and value
    if (validation) {
      if (req.files && req.files.profile && req.files.profile[0].filename) {
        // if error remove file
        removeFile(req.files.profile[0].filename, "TEMP");
      }
      throw { message: validation };
    }

    // add address with push old address (combine)
    if (updateData["address"]) {
      Array.prototype.push.apply(updateData["address"], address);
    }

    if (req.files && req.files.profile && req.files.profile[0].filename) {
      // set profile for add name in database
      updateData["profile"] = req.files.profile[0].filename;
      await moveFile(updateData["profile"], _id, "USER"); //move latest file role wise
      if (profile) {
        //delete old file
        removeFile(profile, "USER", _id);
      }
    }
    const user = await model.User.findByIdAndUpdate(
      // update user data and get latest data
      {
        _id: _id,
      },
      {
        $set: updateData,
      },
      { new: true }
    );
    res.send(successRes(user)); // get success response
  } catch (error) {
    res.send(errorRes(error.message)); // get error response
  }
};

export const UserController = {
  login,
  signUp,
  updateUser,
};
