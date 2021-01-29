import helper, { errorRes, successRes } from "../functions/helper";
import { uploadStorage } from "../functions/uploadfile";
import { model } from "../models";
import MenuSchema from "../validation/MenuSchema";
import mongoose from  "mongoose"
const ObjectId = mongoose.Types.ObjectId
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
        if (validation) {
            if (
                req.files &&
                req.files.menuBanner &&
                req.files.menuBanner[0].filename
            ) {
                // if error remove file
                await helper.removeMenuFile(req.files.menuBanner[0].filename);
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
            await helper.moveMenuFile(data["restaurentId"], menuData._id, "MENU", menuData.menuBanner);
        }
        res.send(successRes(menuData)); // get success response
    } catch (error) {
        res.send(errorRes(error.message));
    }
};

const updateMenu = async (req, res, next) => {
    try {
        await uploadStorage(req, res); // upload file using multer as a middle ware
        const { _id } = req.restaurent; // login Restaurent data
        
        const updateData = JSON.parse(JSON.stringify(req.body)); // remove unusual [obj]
        const validation = await MenuSchema.UpdateMenuValidate(updateData, _id); // validate a key and value
        if (validation) {
          if (
            req.files &&
            req.files.menuBanner &&
            req.files.menuBanner[0].filename
          ) {
            // if error in validation remove file
            await helper.removeFile(req.files.menuBanner[0].filename, "TEMP");
          }
          throw { message: validation };
        }

        const oldMenuData = await model.Menu.findOne({
            _id:updateData.menuId
        })

        if(!oldMenuData){
            throw {message:"Menu Id is Invalid"}
        }
        if (
          req.files &&
          req.files.menuBanner &&
          req.files.menuBanner[0].filename
        ) {
          // set Restaurent Banner for add name in database
          updateData["menuBanner"] = req.files.menuBanner[0].filename;
          await helper.moveFile(updateData["menuBanner"], _id, "MENU"); //move latest file role wise
          
          if (oldMenuData && oldMenuData.menuBanner) {
            //delete old file
            helper.removeFile(oldMenuData.menuBanner, "MENU", _id);

          }

        }
        debugger
        console.log(typeof oldMenuData._id);
        // update Menu data and get latest data
        model.Menu.findOne({
            _id:updateData.menuId
        }).then((res)=>{
            res.send(successRes(res)); // get success response
            debugger
        }).catch((err)=>{
            res.send(successRes(err)); // get success response
            debugger
        })
      } catch (error) {
        res.send(errorRes(error.message)); // get error response
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
