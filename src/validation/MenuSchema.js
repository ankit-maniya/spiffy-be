import { model } from "../models";

const MenuValidate = (req, LoginId) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req);

    // Restaurent id
    if (Array.isArray(keys) && keys.includes("restaurentId")) {
      resolve("Please Enter A restaurentId");
    }

    // Menu Name
    if (Array.isArray(keys) && !keys.includes("menuName")) {
      resolve("Please Enter A Menu Name");
    } else {
      if (keys.includes("menuName") && req.menuName != "") {
        const found = await model.Menu.findOne({
          menuName: req.menuName,
        });
        if (found && JSON.stringify(found._id) == JSON.stringify(LoginId)) {
          resolve("Menu Name is Alredy Exist! Use Diffrent Name!");
        }
      }
    }

    // menuBanner image
    if (req.files && req.files == "" && !req.file.menuBanner) {
      resolve("Please Upload Menu Image");
    }

    resolve("");
  });
};

const UpdateMenuValidate = (req, LoginId) => {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(req);

    // Restaurent Id
    if (
      Array.isArray(keys) &&
      keys.includes("restaurentId") &&
      req.restaurentId == ""
    ) {
      resolve("Please Enter A restaurentId");
    }

    // Menu Name
    if (
      Array.isArray(keys) &&
      keys.includes("menuName") &&
      req.menuName == ""
    ) {
      resolve("Please Enter Menu Name");
    } else {
      if (keys.includes("menuName") && req.menuName != "") {
        const found = await model.Menu.findOne({
          menuName: req.menuName,
        });
        if (found && JSON.stringify(found._id) == JSON.stringify(LoginId)) {
          resolve("Menu Name is Alredy Exist! Use Diffrent Name!");
        }
      }
    }

    // Menu Type
    if (
      Array.isArray(keys) &&
      keys.includes("menuType") &&
      ![0, 1, 2, 3].includes(req.menuType)
    ) {
      resolve("Please Enter Menu Type!");
    }

    resolve("");
  });
};

export const MenuSchema = { MenuValidate, UpdateMenuValidate };
