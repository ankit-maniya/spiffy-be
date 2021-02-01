import { model } from "../../models";
import { errorRes, successMessage } from "../../functions/helper"
const checkInsertInputValidate = (req, LoginId) => {
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

        // Menu id
        if (Array.isArray(keys) && !keys.includes("menuId")) {
            resolve(errorRes("Please Enter A menuId"));
        } else {
            if (keys.includes("menuId") && req.menuId == "") {
                resolve(errorRes("menuId not be empty!"));
            }
        }

        // Category Name
        if (Array.isArray(keys) && !keys.includes("categoryName")) {
            resolve(errorRes("Please Enter A Category Name!"));
        } else {
            if (keys.includes("categoryName") && !req.categoryName) {
                resolve(errorRes("Category Can't be Empty!"));
            }else{
                const found = await model.Category.findOne({
                    categoryName: req.categoryName,
                });
                if (found && JSON.stringify(found.restaurentId) == JSON.stringify(req.restaurentId)) {
                    resolve(errorRes("Category Name is Alredy Exist! Use Diffrent Name!"));
                }
            }
        }

        // // categoryBanner image
        // if (!req.file) {
        //     resolve(errorRes("Please Upload Category Image"));
        // }

        resolve(successMessage("valid data"));
    });
};

const checkUpdateInputValidate = (req, LoginId) => {
    return new Promise(async (resolve, reject) => {
        const keys = Object.keys(req);

        // Category Id
        if (Array.isArray(keys) && !keys.includes("categoryId")) {
            resolve(errorRes("Please Enter A categoryId"));
        } else {
            if (keys.includes("categoryId") && req.categoryId == "") {
                resolve(errorRes("Please Enter A categoryId"));
            }
        }

        // Category Name
        if (
            Array.isArray(keys) &&
            keys.includes("categoryName") &&
            req.categoryName == ""
        ) {
            resolve(errorRes("Please Enter Category Name"));
        } else {
            if (keys.includes("categoryName") && req.categoryName != "") {
                const found = await model.Category.findOne({
                    categoryName: req.categoryName,
                });
                if (found && JSON.stringify(found.restaurentId) == JSON.stringify(req.restaurentId)) {
                    resolve(errorRes("Category Name is Alredy Exist! Use Diffrent Name!"));
                }
            }
        }

        // Category Type
        if (
            Array.isArray(keys) &&
            keys.includes("categoryType") &&
            ![0, 1, 2, 3].includes(req.categoryType)
        ) {
            resolve(errorRes("Please Enter Category Type!"));
        }

        // isActive
        if (
            Array.isArray(keys) &&
            keys.includes("isActive") &&
            ![0, 1].includes(req.isActive)
        ) {
            debugger
            resolve(errorRes("Please Enter isActive type!"));
        }

        // isDelete
        if (
            Array.isArray(keys) &&
            keys.includes("isDelete") &&
            ![0, 1].includes(req.isDelete)
        ) {
            debugger
            resolve(errorRes("Please Enter Proper isDelete type!"));
        }

        resolve(successMessage("valid data"));
    });
};

const checkDeleteInputValidate = (req) => {
    return new Promise(async (resolve, reject) => {
        const keys = Object.keys(req);

        if (Array.isArray(keys) && !keys.includes("categoryId")) {
            resolve(errorRes("CategoryId is Required!"));
        } else {
            if (keys.includes("categoryId") && !req.categoryId) {
                resolve(errorRes("CategoryId is Can't be Empty!"));
            }
        }
        resolve(successMessage("valid data"))
    })
}

const CategorySchema = { checkInsertInputValidate, checkUpdateInputValidate, checkDeleteInputValidate };
export default CategorySchema;
