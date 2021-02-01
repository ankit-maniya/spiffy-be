import helper, { errorRes, successRes, successMessage } from "../functions/helper";
import { uploadFileToStorage } from "../functions/uploadfile";
import { model } from "../models";
import CategorySchema from "../validation/CategorySchema";
import mongoose from "mongoose"

// for convert stringid to objectid
const ObjectId = mongoose.Types.ObjectId
const getCategory = async (req, res, next) => {
    try {
        const {categoryId} = req.params;
        if(!categoryId){
            throw {message:"Please Enter categoryId"}
        }
        const iCategory = await model.Category.findOne({
            _id:ObjectId(categoryId)
        })
        if(!iCategory){
            throw {message:"Data Not Found! Please Enter Proper categoryId!"}
        }
        res.send(successRes(iCategory));
    } catch (error) {
        res.send(errorRes(error.message));
    }
};

const getAllCategory = async (req, res, next) => {
    try {
        const iCategory = await model.Category.find({})
        res.send(successRes(iCategory));
    } catch (error) {
        res.send(errorRes(error.message));
    }
};

const addCategory = async (req, res, next) => {
    try {
        await uploadFileToStorage(req, res); // upload file using multer
        const bodyData = req.body;
        const { _id: restaurentId } = req.restaurent; // login Restaurent Data
        // add login restaurentId to bodydata
        restaurentId ? bodyData["restaurentId"] = restaurentId.toString() : ""
        bodyData.isActive ? bodyData["isActive"] = parseInt(bodyData.isActive) : 0
        bodyData.isDelete ? bodyData["isDelete"] = parseInt(bodyData.isDelete) : 0
        bodyData.isApproved ? bodyData["isApproved"] = parseInt(bodyData.isApproved) : 0
        bodyData.categoryType ? bodyData["categoryType"] = parseInt(bodyData.categoryType) : 0

        const isValidate = await CategorySchema.checkInsertInputValidate(bodyData); // validate a key and value
        if (isValidate.statuscode != 1) {
            if (
                req.files &&
                req.files.categoryBanner &&
                req.files.categoryBanner[0].filename
            ) {
                // if error in validateForm remove file
                await helper.removeCategoryFile(req.files.categoryBanner[0].filename, "TEMP");
            }
            throw { message: isValidate.message };
        }
        if (req.files && req.files.categoryBanner && req.files.categoryBanner[0].filename) {
            // set categoryBanner for add name in database
            bodyData["categoryBanner"] = req.files.categoryBanner[0].filename;
        }
        let categoryData = await model.Category.create(bodyData); // add category bodyData
        if (req.files && req.files.categoryBanner) {
            // move file from TEMP location
            await helper.moveMenuFile(restaurentId.toString(), categoryData._id, "CATEGORY", categoryData.categoryBanner);
        }
        res.send(successRes(categoryData)); // get success response
    } catch (error) {
        res.send(errorRes(error.message));
    }
};

const updateCategory = async (req, res, next) => {
    try {
        await uploadFileToStorage(req, res); // upload file using multer as a middle ware
        const { _id: restaurentId } = req.restaurent; // login Restaurent data
        
        const bodyData = JSON.parse(JSON.stringify(req.body)); // remove unusual [obj]
        bodyData.isActive ? bodyData["isActive"] = parseInt(bodyData.isActive) : 0
        bodyData.isDelete ? bodyData["isDelete"] = parseInt(bodyData.isDelete) : 0
        bodyData.isApproved ? bodyData["isApproved"] = parseInt(bodyData.isApproved) : 0
        bodyData.categoryType ? bodyData["categoryType"] = parseInt(bodyData.categoryType) : 0
        
        const isValidate = await CategorySchema.checkUpdateInputValidate(bodyData, restaurentId); // validate a key and value
        if (isValidate.statuscode != 1) {
            if (
                req.files &&
                req.files.categoryBanner &&
                req.files.categoryBanner[0].filename
            ) {
                // if error in validateForm remove file
                await helper.removeCategoryFile(req.files.categoryBanner[0].filename);
            }
            throw { message: isValidate.message };
        }
        const oldMenuData = await model.Category.findOne({
            _id: ObjectId(bodyData.categoryId),
            restaurentId: restaurentId
        })
        if (!oldMenuData) {
            throw { message: "CategoryId is Invalid" }
        }
        if (req.files && req.files.categoryBanner && req.files.categoryBanner[0].filename) {
            // assign value of MenuBanner for add name in database
            bodyData["categoryBanner"] = req.files.categoryBanner[0].filename;
            await helper.moveMenuFile(bodyData["categoryBanner"], _id, "CATEGORY"); //move latest file role wise

            if (oldMenuData && oldMenuData.categoryBanner) //delete old file
                await helper.removeCategoryFile(oldMenuData.categoryBanner, "CATEGORY", restaurentId);
        }

        // update Category data and get latest data
        const NewCategoryData = await model.Category.findByIdAndUpdate({
            _id: ObjectId(bodyData.categoryId),
        },
            {
                $set: bodyData
            },
            {
                new: true
            })
        if (!NewCategoryData) {
            res.send("Data Not Found")
        } else {
            res.send(successRes(NewCategoryData)); // get success response
        }
    } catch (error) {
        res.send(errorRes(error.message)); // get error response
    }
};

const deleteCategory = async (req, res, next) => {
    try {

        const { _id: restaurentId } = req.restaurent;
        const isValidate = await CategorySchema.checkDeleteInputValidate(req.params)
        if (isValidate.statuscode != 1) {
            throw { message: isValidate.message }
        }
        // extrect the menuid
        const { categoryId } = req.params;
        await model.Category.findOneAndRemove({ _id: categoryId, restaurentId }).exec(async(delError, delResponse) => {
            if (delError) {
                res.send(errorRes(delError));
            } else {
                if (delResponse) {
                    debugger
                    //delete uploaded file
                    if (delResponse.categoryBanner) {
                        debugger
                        await helper.removeCategoryFile(delResponse.categoryBanner, "CATEGORY", delResponse.restaurentId);
                    }
                    res.send(successMessage("Category is Deleted"));
                } else {
                    res.send(successMessage("Category is Not Found in Your Restaurent!"));
                }
            }
        });
    } catch (error) {
        res.send(errorRes(error.message));
    }
};

const CategoryController = { addCategory, updateCategory, deleteCategory, getCategory, getAllCategory };
export default CategoryController;
