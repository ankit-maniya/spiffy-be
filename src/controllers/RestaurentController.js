import { uploadFileToStorage } from "../functions/uploadfile";
import helper, { errorRes, successRes } from "../functions/helper";
import { model } from "../models";
import RestaurentValidationSchema from "../validation/RestaurentSchema";
import { createToken } from "../functions/auth";
import { validatePassword } from "../models/Restaurent";

const logIn = async (req, res, next) => {
  try {
    const bodyData = req.body;

    const isValidate = await RestaurentValidationSchema.checkLoginInputValidate(
      bodyData
    ); //validate a key and value
    if (isValidate.statuscode != 1) {
      throw { message: isValidate.message };
    }
    const iUser = await model.Restaurent.findOne({
      //find Restaurent with this mobile
      mobile: bodyData.mobile,
    });
    if (!iUser) throw { message: "Not Valid Restaurent User" };
    debugger;
    const iMatchPassword = await validatePassword(
      bodyData.password,
      iUser.password
    ); //check password match or not
    if (!iMatchPassword) throw { message: "Invalid Password !!" };
    iUser.authToken = await createToken(iUser, "1h"); // create authtoken
    res.send(successRes(iUser)); // get success response
  } catch (error) {
    res.send(errorRes(error.message)); // get error response
  }
};

const signUp = async (req, res, next) => {
  try {
    await uploadFileToStorage(req, res); // upload file using multer
    const bodyData = req.body;
    if (req.body.address) {
      bodyData.address = JSON.parse(req.body.address); // address is json stringyfied
    }
    const isValidate = await RestaurentValidationSchema.checkSignupInputValidate(
      bodyData
    ); // validate a key and value

    if (isValidate.statuscode != 1) {
      if (req.files && req.files.profile && req.files.profile[0].filename) {
        // if error remove file
        await helper.removeFile(req.files.profile[0].filename, "TEMP");
      }
      if (
        req.files &&
        req.files.restaurentBanner &&
        req.files.restaurentBanner[0].filename
      ) {
        // if error remove file
        await helper.removeFile(req.files.restaurentBanner[0].filename, "TEMP");
      }

      throw { message: isValidate.message }; //   throw error
    }
    if (req.files && req.files.profile && req.files.profile[0].filename) {
      // set profile for add name in database
      bodyData["profile"] = req.files.profile[0].filename;
    }
    if (
      req.files &&
      req.files.restaurentBanner &&
      req.files.restaurentBanner[0].filename
    ) {
      // set restaurent banner for add name in database
      bodyData["restaurentBanner"] = req.files.restaurentBanner[0].filename;
    }

    let RestaurentData = await model.Restaurent.create(bodyData); // add Restaurent bodyData
    if (req.files && req.files.profile) {
      // move file from TEMP location to RESTAURENT
      await helper.moveFile(
        RestaurentData.profile,
        RestaurentData._id,
        "RESTAURENT"
      );
    }
    if (req.files && req.files.restaurentBanner) {
      // move file from TEMP location to RESTAURENT
      await helper.moveFile(
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
    await uploadFileToStorage(req, res); // upload file using multer as a middle ware
    const { _id, profile, restaurentBanner, address } = req.restaurent; // login Restaurent bodyData

    const bodyData = JSON.parse(JSON.stringify(req.body)); // remove unusual [obj]
    // update edited time
    bodyData["updatedAt"] = new Date();
    if (bodyData.address) {
      bodyData.address = JSON.parse(bodyData.address); // address is json stringyfied
      console.log(bodyData.address);
    }
    const isValidate = await RestaurentValidationSchema.checkUpdateInputValidate(
      bodyData,
      _id
    ); // validate a key and value
    if (isValidate.statuscode != 1) {
      if (req.files && req.files.profile && req.files.profile[0].filename) {
        // if error remove file
        await helper.removeFile(req.files.profile[0].filename, "TEMP");
      }
      if (
        req.files &&
        req.files.restaurentBanner &&
        req.files.restaurentBanner[0].filename
      ) {
        // if error remove file
        await helper.removeFile(req.files.restaurentBanner[0].filename, "TEMP");
      }
      throw { message: isValidate.message };
    }

    // combine old Address with new Address
    if (bodyData["address"]) {
      Array.prototype.push.apply(bodyData["address"], address);
    }

    if (req.files && req.files.profile && req.files.profile[0].filename) {
      // set profile for add name in database
      bodyData["profile"] = req.files.profile[0].filename;
      await helper.moveFile(bodyData["profile"], _id, "RESTAURENT"); //move latest file role wise
      if (profile) {
        //delete old file
        helper.removeFile(profile, "RESTAURENT", _id);
      }
    }
    if (
      req.files &&
      req.files.restaurentBanner &&
      req.files.restaurentBanner[0].filename
    ) {
      // add new RestaurentBanner name for update in database
      bodyData["restaurentBanner"] = req.files.restaurentBanner[0].filename;
      await helper.moveFile(bodyData["restaurentBanner"], _id, "RESTAURENT"); //move latest file role wise
      if (restaurentBanner) {
        //delete old uploaded file
        helper.removeFile(restaurentBanner, "RESTAURENT", _id);
      }
    }

    const Restaurent = await model.Restaurent.findByIdAndUpdate(
      // update Restaurent bodyData and get latest bodyData
      {
        _id: _id,
      },
      {
        $set: bodyData,
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
