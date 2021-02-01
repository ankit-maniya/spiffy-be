import helper, { errorRes, successRes, successMessage } from "../functions/helper";
import { uploadFileToStorage } from "../functions/uploadfile";
import { model } from "../models";
import MenuSchema from "../validation/MenuSchema";
import mongoose from "mongoose"

// for convert stringid to objectid
const ObjectId = mongoose.Types.ObjectId
const getMenu = async (req, res, next) => {
    try {
        const {menuId} = req.params;
        if(!menuId){
            throw {message:"Please Enter menuId"}
        }
        const iMenu = await model.Menu.findOne({
            _id:ObjectId(menuId)
        })
        if(!iMenu){
            throw {message:"Data Not Found! Please Enter Proper menuId!"}
        }
        res.send(successRes(iMenu));
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
        restaurentId ? bodyData["restaurentId"] = restaurentId.toString() : ""
        bodyData.isActive ? bodyData["isActive"] = parseInt(bodyData.isActive) : 0
        bodyData.isDelete ? bodyData["isDelete"] = parseInt(bodyData.isDelete) : 0
        bodyData.isApproved ? bodyData["isApproved"] = parseInt(bodyData.isApproved) : 0
        bodyData.menuType ? bodyData["menuType"] = parseInt(bodyData.menuType) : 0
        // update edited time
        bodyData["updatedAt"] = new Date();
        const isValidate = await MenuSchema.checkInsertMenuValidate(data); // validate a key and value
        if (isValidate.statuscode != 1) {
            if (
                req.files &&
                req.files.menuBanner &&
                req.files.menuBanner[0].filename
            ) {
                // if error in validateForm remove file
                await helper.removeMenuFile(req.files.menuBanner[0].filename, "TEMP");
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

        bodyData.isActive ? bodyData["isActive"] = parseInt(bodyData.isActive) : 0
        bodyData.isDelete ? bodyData["isDelete"] = parseInt(bodyData.isDelete) : 0
        bodyData.isApproved ? bodyData["isApproved"] = parseInt(bodyData.isApproved) : 0
        bodyData.menuType ? bodyData["menuType"] = parseInt(bodyData.menuType) : 0

        const isValidate = await MenuSchema.checkUpdateInputValidate(bodyData, restaurentId); // validate a key and value
        if (isValidate.statuscode != 1) {
            if (
                req.files &&
                req.files.menuBanner &&
                req.files.menuBanner[0].filename
            ) {
                // if error in validateForm remove file
                await helper.removeMenuFile(req.files.menuBanner[0].filename);
            }
            throw { message: isValidate.message };
        }
        const oldMenuData = await model.Menu.findOne({
            _id: ObjectId(bodyData.menuId),
            restaurentId: restaurentId
        })
        if (!oldMenuData) {
            throw { message: "MenuId is Invalid" }
        }
        if (req.files && req.files.menuBanner && req.files.menuBanner[0].filename) {
            // assign value of MenuBanner for add name in database
            bodyData["menuBanner"] = req.files.menuBanner[0].filename;
            await helper.moveMenuFile(bodyData["menuBanner"], _id, "MENU"); //move latest file role wise

            if (oldMenuData && oldMenuData.menuBanner) //delete old file
                await helper.removeMenuFile(oldMenuData.menuBanner, "MENU", restaurentId);
        }

        // update Menu data and get latest data
        const NewMenuData = await model.Menu.findByIdAndUpdate({
            _id: ObjectId(bodyData.menuId),
        },
            {
                $set: bodyData
            },
            {
                new: true
            })
        if (!NewMenuData) {
            res.send("Data Not Found")
        } else {
            res.send(successRes(NewMenuData)); // get success response
        }
    } catch (error) {
        res.send(errorRes(error.message)); // get error response
    }
};

const deleteMenu = async (req, res, next) => {
    try {

        const { _id: restaurentId } = req.restaurent;
        const isValidate = await MenuSchema.checkDeleteInputValidate(req.params)
        if (isValidate.statuscode != 1) {
            throw { message: isValidate.message }
        }
        // extrect the menuid
        const { menuId } = req.params;
        console.log(typeof menuId);

        await model.Menu.findOneAndRemove({ _id: menuId, restaurentId }).exec(async(delError, delResponse) => {
            if (delError) {
                res.send(errorRes(delError));
            } else {
                if (delResponse) {
                    debugger
                    //delete uploaded file
                    if (delResponse.menuBanner) {
                        debugger
                        await helper.removeMenuFile(delResponse.menuBanner, "MENU", delResponse.restaurentId);
                    }
                    res.send(successMessage("Menu is Deleted"));
                } else {
                    res.send(successMessage("Menu is Not Found in Your Restaurent!"));
                }
            }
        });
    } catch (error) {
        res.send(errorRes(error.message));
    }
};

const MenuController = { addMenu, updateMenu, deleteMenu, getMenu, getAllMenu };
export default MenuController;
