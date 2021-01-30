import { model } from "../models";
import {errorRes, successRes} from "../functions/helper"
const checkInsertMenuValidate = (req, LoginId) => {
    return new Promise(async (resolve, reject) => {
        const keys = Object.keys(req);

        // Restaurent id
        // if (Array.isArray(keys) && !keys.includes("restaurentId")) {
        //     resolve(errorRes("Please Enter A restaurentId"));
        // } else {
        //     if (keys.includes("restaurentId") && req.restaurentId == "") {
        //         resolve(errorRes("restaurentId not be empty!"));
        //     }
        // }

        // Menu Name
        if (Array.isArray(keys) && !keys.includes("menuName")) {
            resolve(errorRes("Please Enter A Menu Name"));
        } else {
            if (keys.includes("menuName") && req.menuName != "") {
                const found = await model.Menu.findOne({
                    menuName: req.menuName,
                });
                if (found && JSON.stringify(found.restaurentId) == JSON.stringify(req.restaurentId)) {
                    resolve(errorRes("Menu Name is Alredy Exist! Use Diffrent Name!"));
                }
            }
        }

        // menuBanner image
        if (req.files && req.files == "" && !req.file.menuBanner) {
            resolve(errorRes("Please Upload Menu Image"));
        }

        resolve(successRes("valid data"));
    });
};

const checkUpdateInputValidate = (req, LoginId) => {
    return new Promise(async (resolve, reject) => {
        const keys = Object.keys(req);

        // Menu Id
        if (Array.isArray(keys) && !keys.includes("menuId")) {
            resolve(errorRes("Please Enter A menuId"));
        } else {
            if (keys.includes("menuId") && req.menuId == "") {
                resolve(errorRes("Please Enter A menuId"));   
            }
        }

        // Menu Name
        if (
            Array.isArray(keys) &&
            keys.includes("menuName") &&
            req.menuName == ""
        ) {
            resolve(errorRes("Please Enter Menu Name"));
        } else {
            if (keys.includes("menuName") && req.menuName != "") {
                const found = await model.Menu.findOne({
                    menuName: req.menuName,
                });
                if (found && JSON.stringify(found.restaurentId) == JSON.stringify(req.restaurentId)) {
                    resolve(errorRes("Menu Name is Alredy Exist! Use Diffrent Name!"));
                }
            }
        }

        // Menu Type
        if (
            Array.isArray(keys) &&
            keys.includes("menuType") &&
            ![0, 1, 2, 3].includes(req.menuType)
        ) {
            resolve(errorRes("Please Enter Menu Type!"));
        }

        resolve(successRes("valid data"));
    });
};

const MenuSchema = { checkInsertMenuValidate, checkUpdateInputValidate };
export default MenuSchema;
