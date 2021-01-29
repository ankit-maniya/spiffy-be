import { errorRes, successRes } from "../functions/helper";
import { uploadStorage } from "../functions/uploadfile";
import { model } from "../models";
import MenuSchema from "../validation/MenuSchema";
const getMenu = async (req, res, next) => {
  try {
    res.send(successRes("Get Menu"));
  } catch (error) {
    res.send(errorRes(error.message));
  }
};

const addMenu = async (req, res, next) => {
  try {
    await uploadStorage(req, res); // upload file using multer
    const data = req.body;
    const validation = await MenuSchema.InsertMenuValidate(data); // validate a key and value
    debugger;
    if (validation) {
      if (
        req.files &&
        req.files.menuBanner &&
        req.files.menuBanner[0].filename
      ) {
        // if error remove file
        removeFile(req.files.menuBanner[0].filename, "TEMP");
      }
      throw { message: validation }; //   throw error
    }
    if (req.files && req.files.menuBanner && req.files.menuBanner[0].filename) {
      // set menuBanner for add name in database
      data["menuBanner"] = req.files.menuBanner[0].filename;
    }
    let menuData = await model.Menu.create(data); // add menu data
    if (req.files && req.files.menuBanner) {
      // move file from TEMP location
      await moveFile(menuData.menuBanner, menuData._id, "MENU");
    }
    res.send(successRes(menuData)); // get success response
  } catch (error) {
    res.send(errorRes(error.message));
  }
};

const updateMenu = async (req, res, next) => {
  try {
    res.send(successRes("Update Menu"));
  } catch (error) {
    res.send(errorRes(error.message));
  }
};

const deleteMenu = async (req, res, next) => {
  try {
    res.send(successRes("Delete Menu"));
  } catch (error) {
    res.send(errorRes(error.message));
  }
};

const MenuController = { addMenu, updateMenu, deleteMenu, getMenu };
export default MenuController;
