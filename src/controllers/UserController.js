import { uploadStorage } from "../functions/uploadfile";
import { errorRes, successRes, removeFile, moveFile } from "../functions/helper";
import { model } from "../models";
import { LoginValidate, SignupValidate } from "../validation/UserSchema";
import { createToken } from "../functions/auth";
import { validatePassword } from "../models/User";

const login = async (req, res, next) => {
    try {
        const data = req.body;
        await LoginValidate(data);
        const iData = await model.User.findOne({
            mobile: data.mobile,
        });
        if (!iData) throw {message:"Not Valid User"}
        const iRes = await validatePassword(data.password, iData.password);
        if (!iRes) throw {message:"Invalid Password !!"};
        iData.authToken = await createToken(iData, "1h");
        res.send(successRes(iData));
    } catch (error) {
        res.send(errorRes(error.message));
    }
};

const signUp = async (req, res, next) => {
    try {
        // upload file using multer
        await uploadStorage(req, res);
        const data = req.body;
        const validation =  await SignupValidate(data);
        if (validation) {
            if (req.files && req.files.profile) {
                removeFile(req.files.profile[0].filename);
            }

            throw {message:validation}
        }
        if (req.files && req.files.profile) {
            data["profile"] = req.files.profile[0].filename;
            
        }
        let userData = await model.User.create(data);
        await moveFile(userData.profile,userData._id)
        debugger
        userData.authToken = await createToken(userData, "1h");
        res.send(successRes(userData));
    } catch (error) {
        res.send(errorRes(error.message));
    }
};


const updateUser = async(req, res, next) =>{
    const {_id}=req.user
    try {
        res.send(successRes(_id))
    } catch (error) {
        res.send(errorRes(error.message))
    }
}

export const UserController = {
    login,
    signUp,
    updateUser,
};
