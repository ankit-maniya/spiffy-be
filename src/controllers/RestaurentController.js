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
  UpdateRestaurentValidate,
} from "../validation/RestaurentSchema";
import { createToken } from "../functions/auth";
import { validatePassword } from "../models/Restaurent";

const logIn = async (req, res, next) => {
  try {
    const data = req.body;

    await LoginValidate(data); //validate a key and value
    const iData = await model.Restaurent.findOne({
      //find Restaurent with this mobile
      mobile: data.mobile,
    });
    if (!iData) throw { message: "Not Valid Restaurent User" };
    debugger;
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
      if (
        req.files &&
        req.files.restaurentBanner &&
        req.files.restaurentBanner[0].filename
      ) {
        // if error remove file
        removeFile(req.files.restaurentBanner[0].filename, "TEMP");
      }

      throw { message: validation }; //   throw error
    }
    if (req.files && req.files.profile && req.files.profile[0].filename) {
      // set profile for add name in database
      data["profile"] = req.files.profile[0].filename;
    }
    if (
      req.files &&
      req.files.restaurentBanner &&
      req.files.restaurentBanner[0].filename
    ) {
      // set restaurent banner for add name in database
      data["restaurentBanner"] = req.files.restaurentBanner[0].filename;
    }

    let RestaurentData = await model.Restaurent.create(data); // add Restaurent data
    if (req.files && req.files.profile) {
      // move file from TEMP location to RESTAURENT
      await moveFile(RestaurentData.profile, RestaurentData._id, "RESTAURENT");
    }
    if (req.files && req.files.restaurentBanner) {
      // move file from TEMP location to RESTAURENT
      await moveFile(
        RestaurentData.restaurentBanner,
        RestaurentData._id,
        "RESTAURENT"
      );
    }
    RestaurentData.authToken = await createToken(RestaurentData, "1h"); // create authtoken
    res.send(successRes(RestaurentData)); // get success response
  } catch (error) {
    res.send(errorRes(error.message)); // get error response
  }
};

const updateRestaurent = async (req, res, next) => {
  try {
    await uploadStorage(req, res); // upload file using multer as a middle ware
    const { _id, profile, restaurentBanner, address } = req.restaurent; // login Restaurent data

    const updateData = JSON.parse(JSON.stringify(req.body)); // remove unusual [obj]
    if (updateData.address) {
      updateData.address = JSON.parse(updateData.address); // address is json stringyfied
      console.log(updateData.address);
    }
    const validation = await UpdateRestaurentValidate(updateData, _id); // validate a key and value
    if (validation) {
      if (req.files && req.files.profile && req.files.profile[0].filename) {
        // if error remove file
        removeFile(req.files.profile[0].filename, "TEMP");
      }
      if (
        req.files &&
        req.files.restaurentBanner &&
        req.files.restaurentBanner[0].filename
      ) {
        // if error remove file
        removeFile(req.files.restaurentBanner[0].filename, "TEMP");
      }
      throw { message: validation };
    }
    if (updateData["address"]) {
      Array.prototype.push.apply(updateData["address"], address);
    }

    if (req.files && req.files.profile && req.files.profile[0].filename) {
      // set profile for add name in database
      updateData["profile"] = req.files.profile[0].filename;
      await moveFile(updateData["profile"], _id, "RESTAURENT"); //move latest file role wise
      if (profile) {
        //delete old file
        removeFile(profile, "RESTAURENT", _id);
      }
    }
    if (
      req.files &&
      req.files.restaurentBanner &&
      req.files.restaurentBanner[0].filename
    ) {
      // set Restaurent Banner for add name in database
      updateData["restaurentBanner"] = req.files.restaurentBanner[0].filename;
      await moveFile(updateData["restaurentBanner"], _id, "RESTAURENT"); //move latest file role wise
      if (restaurentBanner) {
        //delete old file
        removeFile(restaurentBanner, "RESTAURENT", _id);
      }
    }

    const Restaurent = await model.Restaurent.findByIdAndUpdate(
      // update Restaurent data and get latest data
      {
        _id: _id,
      },
      {
        $set: updateData,
      },
      { new: true }
    );
    res.send(successRes(Restaurent)); // get success response
  } catch (error) {
    res.send(errorRes(error.message)); // get error response
  }
};

export const RestaurentController = {
  signUp,
  logIn,
  updateRestaurent,
};
