import fs from "fs"
import path from "path"
import { config } from "../../config";
export const errorRes = (error) => {
    const iRes = {
        statuscode: 0,
        data: { error },
    };
    return iRes;
};

export const successRes = (data) => {
    const iRes = {
        statuscode: 1,
        data,
    };
    return iRes;
};

export const removeFile = (file) => {
    fs.unlink(config.FILE_STORE_PATH + '/' + file, (err) => {
        if (err) throw err;
    });
}


export const moveFile = (file, userId) => {
    const userDirPath = path.join(config.FILE_STORE_PATH, userId.toString())

    const currentPath = path.join(config.FILE_STORE_PATH, file);
    const destinationPath = path.join(config.FILE_STORE_PATH, userId.toString(), file);
    if (!fs.existsSync(userDirPath)) {
        fs.mkdir(path.join(config.FILE_STORE_PATH, userId.toString()), (err) => {
            if (err) {
                throw err
            }
            fs.rename(currentPath, destinationPath, function (errmove) {
                if (errmove) {
                    throw errmove
                }
            });
        });
    } else {
        fs.rename(currentPath, destinationPath, function (errmove) {
            if (errmove) {
                throw errmove
            }
        });
    }
}