import { model } from "../models";
import { errorRes, successMessage } from "../functions/helper"
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

        // Category id
        if (Array.isArray(keys) && !keys.includes("categoryId")) {
            resolve(errorRes("Please Enter A categoryId"));
        } else {
            if (keys.includes("categoryId") && req.categoryId == "") {
                resolve(errorRes("categoryId not be empty!"));
            }
        }

        // Item Name
        if (Array.isArray(keys) && !keys.includes("itemName")) {
            resolve(errorRes("Please Enter A Item Name!"));
        } else {
            if (keys.includes("itemName") && !req.itemName) {
                resolve(errorRes("Item Can't be Empty!"));
            } else {
                const found = await model.Item.findOne({
                    itemName: req.itemName,
                });
                if (found && JSON.stringify(found.restaurentId) == JSON.stringify(req.restaurentId)) {
                    resolve(errorRes("Item Name is Alredy Exist! Use Diffrent Name!"));
                }
            }
        }

        // Item Price
        if (
            Array.isArray(keys) &&
            !keys.includes("itemPrice") && !req.itemPrice
        ) {
            resolve(errorRes("Please Enter Item Price!"));
        }else{
            if (
                Array.isArray(keys) && req.itemPrice < 20
            ) {
                resolve(errorRes("Item Price Should Be greterthen 20!"));
            }
        }

        // // itemBanner image
        // if (!req.file) {
        //     resolve(errorRes("Please Upload Item Image"));
        // }

        resolve(successMessage("valid data"));
    });
};

const checkUpdateInputValidate = (req, LoginId) => {
    return new Promise(async (resolve, reject) => {
        const keys = Object.keys(req);

        // Item Id
        if (Array.isArray(keys) && !keys.includes("itemId")) {
            resolve(errorRes("Please Enter A itemId"));
        } else {
            if (keys.includes("itemId") && req.itemId == "") {
                resolve(errorRes("Please Enter A itemId"));
            }
        }

        // Item Name
        if (
            Array.isArray(keys) &&
            keys.includes("itemName") &&
            req.itemName == ""
        ) {
            resolve(errorRes("Please Enter Item Name"));
        } else {
            if (keys.includes("itemName") && req.itemName != "") {
                const found = await model.Item.findOne({
                    itemName: req.itemName,
                });
                if (found && JSON.stringify(found.restaurentId) == JSON.stringify(req.restaurentId)) {
                    resolve(errorRes("Item Name is Alredy Exist! Use Diffrent Name!"));
                }
            }
        }

        // Item Description
        if (
            Array.isArray(keys) &&
            keys.includes("itemDescription") && !req.itemDescription
        ) {
            resolve(errorRes("Please Enter Item Description!"));
        }

        // Item Price
        if (
            Array.isArray(keys) &&
            keys.includes("itemPrice") && !req.itemPrice
        ) {
            resolve(errorRes("Please Enter Item Price!"));
        }else{
            if (
                Array.isArray(keys) && req.itemPrice < 20
            ) {
                resolve(errorRes("Item Price Should Be greterthen 20!"));
            }
        }

        // Item Type
        if (
            Array.isArray(keys) &&
            keys.includes("itemType") &&
            ![0, 1, 2, 3].includes(req.itemType)
        ) {
            resolve(errorRes("Please Enter Item Type!"));
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

        if (Array.isArray(keys) && !keys.includes("itemId")) {
            resolve(errorRes("ItemId is Required!"));
        } else {
            if (keys.includes("itemId") && !req.itemId) {
                resolve(errorRes("ItemId is Can't be Empty!"));
            }
        }
        resolve(successMessage("valid data"))
    })
}

const ItemSchema = { checkInsertInputValidate, checkUpdateInputValidate, checkDeleteInputValidate };
export default ItemSchema;
