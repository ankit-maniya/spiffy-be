import fs from "fs";
import path from "path";
import { config } from "../../config";
const errorRes = (message) => {
    const iRes = {
        statuscode: 0,
        message,
    };
    return iRes;
};

const successRes = (data, message = "Successfully Data Fetched!") => {
    const iRes = {
        statuscode: 1,
        message,
        data,
    };
    return iRes;
};

const removeFile = (file, role = "TEMP", folder = "") => {
    // We have folder user id (update time)
    if (folder) {
        fs.unlink(
            config.FILE_STORE_PATH + "/" + role + "/" + folder + "/" + file,
            (err) => {
                if (err) throw err;
            }
        );
    } else {
        // not have folder user id (signup time)
        fs.unlink(config.FILE_STORE_PATH + "/" + role + "/" + file, (err) => {
            if (err) throw err;
        });
    }
};

const moveFile = (file, userId, role = "TEMP") => {
    const userDirPath = path.join(
        config.FILE_STORE_PATH,
        role,
        userId.toString()
    );
    const currentPath = path.join(config.FILE_STORE_PATH, "TEMP", file);
    const destinationPath = path.join(
        config.FILE_STORE_PATH,
        role,
        userId.toString(),
        file
    );

    if (!fs.existsSync(userDirPath)) {
        fs.mkdir(
            path.join(config.FILE_STORE_PATH, role, userId.toString()),
            (err) => {
                if (err) {
                    throw err;
                }
                fs.rename(currentPath, destinationPath, function (errmove) {
                    if (errmove) {
                        throw errmove;
                    }
                });
            }
        );
    } else {
        fs.rename(currentPath, destinationPath, function (errmove) {
            if (errmove) {
                throw errmove;
            }
        });
    }
};

// MENU Directory CREATE
const moveMenuFile = async (restaurentId, menuId, role = "MENU", file) => {
    const MenuDirPath = path.join(
        config.RESTAURENT_FILE_STORE_PATH,
        restaurentId,
        role
    );
    const currentTempPath = path.join(config.FILE_STORE_PATH, "TEMP", file);
    const destinationPath = path.join(
        config.RESTAURENT_FILE_STORE_PATH,
        restaurentId,
        role,
        file
    );
    debugger
    //Check Directory Exist
    if (!fs.existsSync(MenuDirPath)) {
        //check first MENU Directory exist in RESTAURENT folder or not
        if (!fs.existsSync(path.join(config.RESTAURENT_FILE_STORE_PATH, restaurentId, role))) {
            //Create A MENU directory in RESTAURENT
            if (makeDir(config.RESTAURENT_FILE_STORE_PATH, restaurentId, role)) {
                //perform move file task perticuler location
                fs.rename(currentTempPath, destinationPath, function (errmove) {
                    if (errmove) {
                        throw errmove;
                    }
                });
                debugger
            }
        } else { //MENU Directory exist in RESTAURENT folder 
            //perform move file task perticuler location
            fs.rename(currentTempPath, destinationPath, function (errmove) {
                if (errmove) {
                    throw errmove;
                }
            });
        }
    } else {
        fs.rename(currentTempPath, destinationPath, function (errmove) {
            if (errmove) {
                throw errmove;
            }
        });
    }
}

// CATEGORY DIRECTORY CREATE
const moveCategoryFile = async (restaurentId, menuId, role = "CATEGORY", file) => {
    const CategoryDirPath = path.join(
        config.RESTAURENT_FILE_STORE_PATH,
        restaurentId,
        role
    );
    const currentTempPath = path.join(config.FILE_STORE_PATH, "TEMP", file);
    const destinationPath = path.join(
        config.RESTAURENT_FILE_STORE_PATH,
        restaurentId,
        role,
        file
    );
    debugger
    //Check Directory Exist
    if (!fs.existsSync(CategoryDirPath)) {
        //check first CATEGORY Directory exist in RESTAURENT folder or not
        if (!fs.existsSync(path.join(config.RESTAURENT_FILE_STORE_PATH, restaurentId, role))) {
            //Create A CATEGORY directory in RESTAURENT
            if (makeDir(config.RESTAURENT_FILE_STORE_PATH, restaurentId, role)) {
                //perform move file task perticuler location
                fs.rename(currentTempPath, destinationPath, function (errmove) {
                    if (errmove) {
                        throw errmove;
                    }
                });
                debugger
            }
        } else { //CATEGORY Directory exist in RESTAURENT folder 
            //perform move file task perticuler location
            fs.rename(currentTempPath, destinationPath, function (errmove) {
                if (errmove) {
                    throw errmove;
                }
            });
        }
    } else {
        fs.rename(currentTempPath, destinationPath, function (errmove) {
            if (errmove) {
                throw errmove;
            }
        });
    }
}

// ITEM DIRECTORY CREATE
const moveItemFile = async (restaurentId, categoryId, role = "ITEM", file) => {
    const ItemDirPath = path.join(
        config.RESTAURENT_FILE_STORE_PATH,
        restaurentId,
        role
    );
    const currentTempPath = path.join(config.FILE_STORE_PATH, "TEMP", file);
    const destinationPath = path.join(
        config.RESTAURENT_FILE_STORE_PATH,
        restaurentId,
        role,
        file
    );
    debugger
    //Check Directory Exist
    if (!fs.existsSync(ItemDirPath)) {
        //check first ITEM Directory exist in RESTAURENT folder or not
        if (!fs.existsSync(path.join(config.RESTAURENT_FILE_STORE_PATH, restaurentId, role))) {
            //Create A ITEM Directory in RESTAURENT
            if (makeDir(config.RESTAURENT_FILE_STORE_PATH, restaurentId, role)) {
                //perform move file task perticuler location
                fs.rename(currentTempPath, destinationPath, function (errmove) {
                    if (errmove) {
                        throw errmove;
                    }
                });
                debugger
            }
        } else { //ITEM Directory exist in RESTAURENT folder 
            //perform move file task perticuler location
            fs.rename(currentTempPath, destinationPath, function (errmove) {
                if (errmove) {
                    throw errmove;
                }
            });
        }
    } else {
        fs.rename(currentTempPath, destinationPath, function (errmove) {
            if (errmove) {
                throw errmove;
            }
        });
    }
}


// create Directory 
const makeDir = async (restaurentPath, oldDirName, newDirName, iD) => {
    if (iD) {
        await fs.mkdir(path.join(restaurentPath, oldDirName, newDirName, iD), (err) => { if (err) { throw err } })
    } else {
        await fs.mkdir(path.join(restaurentPath, oldDirName, newDirName), (err) => { if (err) { throw err } })
    }
}

const removeMenuFile = (file, role = "MENU", folder = "") => {

    // We have folder user id (update time)
    if (folder) {
        fs.unlink(
            config.RESTAURENT_FILE_STORE_PATH + "/" + role + "/" + folder + "/" + file,
            (err) => {
                if (err) throw err;
            }
        );
    } else {
        // have && not have folder user id (signup time)
        fs.unlink(config.FILE_STORE_PATH + "/" + "TEMP" + "/" + file, (err) => {
            if (err) throw err;
        });
    }
};

const helper = {
    removeFile,
    moveFile,
    removeMenuFile,
    moveMenuFile,
    moveCategoryFile,
    moveItemFile,
}

export { errorRes, successRes }
export default helper