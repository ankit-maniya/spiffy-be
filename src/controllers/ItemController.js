import helper, {
  errorRes,
  successRes,
  successMessage,
} from "../functions/helper";
import { uploadFileToStorage } from "../functions/uploadfile";
import { model } from "../models";
import ItemSchema from "../validation/ItemSchema";
import mongoose from "mongoose";

// for convert stringid to objectid
const ObjectId = mongoose.Types.ObjectId;
const getItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    if (!itemId) {
      throw { message: "Please Enter itemId" };
    }
    const iItem = await model.Item.findOne({
      _id: ObjectId(itemId),
    });
    if (!iItem) {
      throw { message: "Data Not Found! Please Enter Proper itemId!" };
    }
    res.send(successRes(iItem));
  } catch (error) {
    res.send(errorRes(error.message));
  }
};

const getAllItem = async (req, res, next) => {
  try {
    const iItem = await model.Item.find({});
    res.send(successRes(iItem));
  } catch (error) {
    res.send(errorRes(error.message));
  }
};

const addItem = async (req, res, next) => {
  try {
    await uploadFileToStorage(req, res); // upload file using multer
    const bodyData = req.body;
    const { _id: restaurentId } = req.restaurent; // login Restaurent Data
    // add login restaurentId to bodydata
    restaurentId ? (bodyData["restaurentId"] = restaurentId.toString()) : "";
    bodyData.isActive
      ? (bodyData["isActive"] = parseInt(bodyData.isActive))
      : 0;
    bodyData.isDelete
      ? (bodyData["isDelete"] = parseInt(bodyData.isDelete))
      : 0;
    bodyData.isApproved
      ? (bodyData["isApproved"] = parseInt(bodyData.isApproved))
      : 0;
    bodyData.itemType
      ? (bodyData["itemType"] = parseInt(bodyData.itemType))
      : 0;

    const isValidate = await ItemSchema.checkInsertInputValidate(bodyData); // validate a key and value
    if (isValidate.statuscode != 1) {
      if (
        req.files &&
        req.files.itemBanner &&
        req.files.itemBanner[0].filename
      ) {
        // if error in validateForm remove file
        await helper.removeItemFile(req.files.itemBanner[0].filename, "TEMP");
      }
      throw { message: isValidate.message };
    }
    if (req.files && req.files.itemBanner && req.files.itemBanner[0].filename) {
      // set itemBanner for add name in database
      bodyData["itemBanner"] = req.files.itemBanner[0].filename;
    }
    let itemData = await model.Item.create(bodyData); // add item bodyData
    if (req.files && req.files.itemBanner) {
      // move file from TEMP location
      await helper.moveMenuFile(
        restaurentId.toString(),
        itemData._id,
        "ITEM",
        itemData.itemBanner
      );
    }
    res.send(successRes(itemData)); // get success response
  } catch (error) {
    res.send(errorRes(error.message));
  }
};

const updateItem = async (req, res, next) => {
  try {
    await uploadFileToStorage(req, res); // upload file using multer as a middle ware
    const { _id: restaurentId } = req.restaurent; // login Restaurent data

    const bodyData = JSON.parse(JSON.stringify(req.body)); // remove unusual [obj]
    bodyData.isActive
      ? (bodyData["isActive"] = parseInt(bodyData.isActive))
      : 0;
    bodyData.isDelete
      ? (bodyData["isDelete"] = parseInt(bodyData.isDelete))
      : 0;
    bodyData.isApproved
      ? (bodyData["isApproved"] = parseInt(bodyData.isApproved))
      : 0;
    bodyData.itemType
      ? (bodyData["itemType"] = parseInt(bodyData.itemType))
      : 0;
    // update edited time
    bodyData["updatedAt"] = new Date();
    const isValidate = await ItemSchema.checkUpdateInputValidate(
      bodyData,
      restaurentId
    ); // validate a key and value
    if (isValidate.statuscode != 1) {
      if (
        req.files &&
        req.files.itemBanner &&
        req.files.itemBanner[0].filename
      ) {
        // if error in validateForm remove file
        await helper.removeItemFile(req.files.itemBanner[0].filename);
      }
      throw { message: isValidate.message };
    }
    const oldMenuData = await model.Item.findOne({
      _id: ObjectId(bodyData.itemId),
      restaurentId: restaurentId,
    });
    if (!oldMenuData) {
      throw { message: "ItemId is Invalid" };
    }
    if (req.files && req.files.itemBanner && req.files.itemBanner[0].filename) {
      // assign value of MenuBanner for add name in database
      bodyData["itemBanner"] = req.files.itemBanner[0].filename;
      await helper.moveMenuFile(bodyData["itemBanner"], _id, "ITEM"); //move latest file role wise

      if (oldMenuData && oldMenuData.itemBanner)
        //delete old file
        await helper.removeItemFile(
          oldMenuData.itemBanner,
          "ITEM",
          restaurentId
        );
    }

    // update Item data and get latest data
    const NewItemData = await model.Item.findByIdAndUpdate(
      {
        _id: ObjectId(bodyData.itemId),
      },
      {
        $set: bodyData,
      },
      {
        new: true,
      }
    );
    if (!NewItemData) {
      res.send("Data Not Found");
    } else {
      res.send(successRes(NewItemData)); // get success response
    }
  } catch (error) {
    res.send(errorRes(error.message)); // get error response
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { _id: restaurentId } = req.restaurent;
    const isValidate = await ItemSchema.checkDeleteInputValidate(req.params);
    if (isValidate.statuscode != 1) {
      throw { message: isValidate.message };
    }
    // extrect the menuid
    const { itemId } = req.params;
    await model.Item.findOneAndRemove({ _id: itemId, restaurentId }).exec(
      async (delError, delResponse) => {
        if (delError) {
          res.send(errorRes(delError));
        } else {
          if (delResponse) {
            debugger;
            //delete uploaded file
            if (delResponse.itemBanner) {
              debugger;
              await helper.removeItemFile(
                delResponse.itemBanner,
                "ITEM",
                delResponse.restaurentId
              );
            }
            res.send(successMessage("Item is Deleted"));
          } else {
            res.send(successMessage("Item is Not Found in Your Category!"));
          }
        }
      }
    );
  } catch (error) {
    res.send(errorRes(error.message));
  }
};

const ItemController = { addItem, updateItem, deleteItem, getItem, getAllItem };
export default ItemController;
