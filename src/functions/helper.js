import fs from "fs";
import path from "path";
import { config } from "../../config";
const errorRes = (error) => {
    const iRes = {
        statuscode: 0,
        data: { error },
    };
    return iRes;
};

const successRes = (data) => {
    const iRes = {
        statuscode: 1,
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

// MENU DIR CREATE
const moveMenuFile = async (RestaurentId, MenuId, role = "MENU", file) => {
    const MenuDirPath = path.join(
        config.RESTAURENT_FILE_STORE_PATH,
        RestaurentId,
        role,
        MenuId.toString()
    );
    const currentTempPath = path.join(config.FILE_STORE_PATH, "TEMP", file);
    const destinationPath = path.join(
        config.RESTAURENT_FILE_STORE_PATH,
        RestaurentId,
        role,
        MenuId.toString(),
        file
    );
    //Check Dir Exist
    if (!fs.existsSync(MenuDirPath)) {
        //check first MENU Dir exist in RESTAURENT folder or not
        if (!fs.existsSync(path.join(config.RESTAURENT_FILE_STORE_PATH, RestaurentId, role))) {
            //Create A MENU directory in RESTAURENT
            if (makeDir(config.RESTAURENT_FILE_STORE_PATH, RestaurentId, role)) {
                //check first MENU_ID Dir exist in MENU folder or not
                if (!fs.existsSync(path.join(config.RESTAURENT_FILE_STORE_PATH, RestaurentId, role, MenuId.toString()))) {
                    //Create A MENU_ID directory in MENU
                    if (makeDir(config.RESTAURENT_FILE_STORE_PATH, RestaurentId, role, MenuId.toString())) {
                        //perform move file task perticuler location
                        fs.rename(currentTempPath, destinationPath, function (errmove) {
                            if (errmove) {
                                throw errmove;
                            }

                        });

                    }
                } else {//MENU_ID directory Exist in MENU
                    //perform move file task perticuler location
                    fs.rename(currentTempPath, destinationPath, function (errmove) {
                        if (errmove) {
                            throw errmove;
                        }
                    });
                }
            }
        } else { //MENU Dir exist in RESTAURENT folder 
            if (makeDir(config.RESTAURENT_FILE_STORE_PATH, RestaurentId, role, MenuId.toString())) {
                //perform move file task perticuler location
                fs.rename(currentTempPath, destinationPath, function (errmove) {
                    if (errmove) {
                        throw errmove;
                    }
                });
            } else {//MENU_ID directory Exist in MENU
                //perform move file task perticuler location
                fs.rename(currentTempPath, destinationPath, function (errmove) {
                    if (errmove) {
                        throw errmove;
                    }
                });
            }
        }
    } else {
        fs.rename(currentTempPath, destinationPath, function (errmove) {
            if (errmove) {
                throw errmove;
            }
        });
    }
}

// CATEGORY DIR CREATE
const moveCategoryFile = async (RestaurentId, CategoryId, role = "CATEGORY", file) => {
    const CategoryDirPath = path.join(
        config.RESTAURENT_FILE_STORE_PATH,
        RestaurentId,
        role,
        CategoryId.toString()
    );
    const currentTempPath = path.join(config.FILE_STORE_PATH, "TEMP", file);
    const destinationPath = path.join(
        config.RESTAURENT_FILE_STORE_PATH,
        RestaurentId,
        role,
        CategoryId.toString(),
        file
    );
    //Check Dir Exist
    if (!fs.existsSync(MenuDirPath)) {
        //check first CATEGORY Dir exist in RESTAURENT folder or not
        if (!fs.existsSync(path.join(config.RESTAURENT_FILE_STORE_PATH, RestaurentId, role))) {
            //Create A CATEGORY directory in RESTAURENT
            if (makeDir(config.RESTAURENT_FILE_STORE_PATH, RestaurentId, role)) {
                //check first CATEGORY_ID Dir exist in CATEGORY folder or not
                if (!fs.existsSync(path.join(config.RESTAURENT_FILE_STORE_PATH, RestaurentId, role, CategoryId.toString()))) {
                    //Create A CATEGORY_ID directory in CATEGORY
                    if (makeDir(config.RESTAURENT_FILE_STORE_PATH, RestaurentId, role, CategoryId.toString())) {
                        //perform move file task perticuler location
                        fs.rename(currentTempPath, destinationPath, function (errmove) {
                            if (errmove) {
                                throw errmove;
                            }

                        });

                    }
                } else {//CATEGORY_ID directory Exist in CATEGORY
                    //perform move file task perticuler location
                    fs.rename(currentTempPath, destinationPath, function (errmove) {
                        if (errmove) {
                            throw errmove;
                        }
                    });
                }
            }
        } else { //CATEGORY Dir exist in RESTAURENT folder 
            if (makeDir(config.RESTAURENT_FILE_STORE_PATH, RestaurentId, role, CategoryId.toString())) {
                //perform move file task perticuler location
                fs.rename(currentTempPath, destinationPath, function (errmove) {
                    if (errmove) {
                        throw errmove;
                    }
                });
            } else {//CATEGORY_ID directory Exist in CATEGORY
                //perform move file task perticuler location
                fs.rename(currentTempPath, destinationPath, function (errmove) {
                    if (errmove) {
                        throw errmove;
                    }
                });
            }
        }
    } else {
        fs.rename(currentTempPath, destinationPath, function (errmove) {
            if (errmove) {
                throw errmove;
            }
        });
    }
}


// ITEM DIR CREATE
const moveItemFile = async (RestaurentId, CategoryId, role = "ITEM", file) => {
    const CategoryDirPath = path.join(
        config.RESTAURENT_FILE_STORE_PATH,
        RestaurentId,
        role,
        CategoryId.toString()
    );
    const currentTempPath = path.join(config.FILE_STORE_PATH, "TEMP", file);
    const destinationPath = path.join(
        config.RESTAURENT_FILE_STORE_PATH,
        RestaurentId,
        role,
        CategoryId.toString(),
        file
    );
    //Check Dir Exist
    if (!fs.existsSync(MenuDirPath)) {
        //check first ITEM Dir exist in RESTAURENT folder or not
        if (!fs.existsSync(path.join(config.RESTAURENT_FILE_STORE_PATH, RestaurentId, role))) {
            //Create A ITEM directory in RESTAURENT
            if (makeDir(config.RESTAURENT_FILE_STORE_PATH, RestaurentId, role)) {
                //check first ITEM_ID Dir exist in ITEM folder or not
                if (!fs.existsSync(path.join(config.RESTAURENT_FILE_STORE_PATH, RestaurentId, role, ItemId.toString()))) {
                    //Create A ITEM_ID directory in ITEM
                    if (makeDir(config.RESTAURENT_FILE_STORE_PATH, RestaurentId, role, ItemId.toString())) {
                        //perform move file task perticuler location
                        fs.rename(currentTempPath, destinationPath, function (errmove) {
                            if (errmove) {
                                throw errmove;
                            }

                        });

                    }
                } else {//ITEM_ID directory Exist in ITEM
                    //perform move file task perticuler location
                    fs.rename(currentTempPath, destinationPath, function (errmove) {
                        if (errmove) {
                            throw errmove;
                        }
                    });
                }
            }
        } else { //ITEM Dir exist in RESTAURENT folder 
            if (makeDir(config.RESTAURENT_FILE_STORE_PATH, RestaurentId, role, ItemId.toString())) {
                //perform move file task perticuler location
                fs.rename(currentTempPath, destinationPath, function (errmove) {
                    if (errmove) {
                        throw errmove;
                    }
                });
            } else {//ITEM_ID directory Exist in ITEM
                //perform move file task perticuler location
                fs.rename(currentTempPath, destinationPath, function (errmove) {
                    if (errmove) {
                        throw errmove;
                    }
                });
            }
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