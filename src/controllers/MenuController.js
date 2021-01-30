import helper, { errorRes, successRes } from "../functions/helper";
import { uploadFileToStorage } from "../functions/uploadfile";
import { model } from "../models";
import MenuSchema from "../validation/MenuSchema";
import mongoose from "mongoose"
const ObjectId = mongoose.Types.ObjectId
const getMenu = async (req, res, next) => {
    try {
        res.send(successRes("Get One Menu"));
    } catch (error) {
        res.send(errorRes(error.message));
    }
};

const getAllMenu = async (req, res, next) => {
    try {
        const iMenu = await model.Menu.find({})
        res.send(successRes(iMenu));
    } catch (error) {
        res.send(errorRes(error.message));
    }
};

const addMenu = async (req, res, next) => {
    try {
        await uploadFileToStorage(req, res); // upload file using multer
        const data = req.body;
        const { _id: restaurentId } = req.restaurent; // login Restaurent data
        // add login restaurentId to bodydata
        if (restaurentId) {
            data["restaurentId"] = restaurentId.toString()
        }
        const isValidate = await MenuSchema.checkInsertMenuValidate(data); // validate a key and value
        if (isValidate.statuscode != 1) {
            if (
                req.files &&
                req.files.menuBanner &&
                req.files.menuBanner[0].filename
            ) {
                // if error in validateForm remove file
                await helper.removeFile(req.files.menuBanner[0].filename, "TEMP");
            }
            throw { message: isValidate.message };
        }
        if (req.files && req.files.menuBanner && req.files.menuBanner[0].filename) {
            // set menuBanner for add name in database
            data["menuBanner"] = req.files.menuBanner[0].filename;
        }
        let menuData = await model.Menu.create(data); // add menu data
        if (req.files && req.files.menuBanner) {
            // move file from TEMP location
            await helper.moveMenuFile(restaurentId.toString(), menuData._id, "MENU", menuData.menuBanner);
        }
        res.send(successRes(menuData)); // get success response
    } catch (error) {
        res.send(errorRes(error.message));
    }
};

const updateMenu = async (req, res, next) => {
    try {
        await uploadFileToStorage(req, res); // upload file using multer as a middle ware
        const { _id: restaurentId } = req.restaurent; // login Restaurent data
        const bodyData = JSON.parse(JSON.stringify(req.body)); // remove unusual [obj]
        const isValidate = await MenuSchema.checkUpdateInputValidate(bodyData, restaurentId); // validate a key and value
        if (isValidate.statuscode != 1) {
            if (
                req.files &&
                req.files.menuBanner &&
                req.files.menuBanner[0].filename
            ) {
                // if error in validateForm remove file
                await helper.removeFile(req.files.menuBanner[0].filename, "TEMP");
            }
            throw { message: isValidate.message };
        }
        console.log(typeof ObjectId(bodyData.menuId),typeof restaurentId);
        
        const oldMenuData = await model.Menu.findOne({
            _id: ObjectId(bodyData.menuId),
            restaurentId:ObjectId("60150a8d38616b14d878cba8")
        })
        if (!oldMenuData) {
            throw { message: "MenuId is Invalid" }
        }
        if (req.files && req.files.menuBanner && req.files.menuBanner[0].filename) {
            // assign value of MenuBanner for add name in database
            bodyData["menuBanner"] = req.files.menuBanner[0].filename;
            await helper.moveFile(bodyData["menuBanner"], _id, "MENU"); //move latest file role wise

            if (oldMenuData && oldMenuData.menuBanner) //delete old file
                helper.removeFile(oldMenuData.menuBanner, "MENU", _id);
        }
        debugger
        console.log(typeof oldMenuData._id);
        // update Menu data and get latest data
        // model.Menu.findOne({
        //     _id:bodyData.menuId
        // }).then((res)=>{
        //     res.send(successRes(res)); // get success response
        //     debugger
        // }).catch((err)=>{
        //     res.send(successRes(err)); // get success response
        //     debugger
        // })
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

const MenuController = { addMenu, updateMenu, deleteMenu, getMenu,getAllMenu };
export default MenuController;
