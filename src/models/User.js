import mongoose from "mongoose";
import { isEmail } from "validator";
import bcrypt from "bcrypt";
import { config } from "../../config";
// const ObjectId = mongoose.Schema.Types.ObjectId;
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: [String],
      required: true,
    },
    email: {
      type: String,
      validate: [isEmail, "Please Enter Valid Email!"],
      unique: true,
      required: true,
    },
    mobile: {
      type: String,
      validate: {
        validator: (value) => {
          return value.length > 9 && value.length < 14;
        },
        message: (value) => {
          return "Please Enter Proper Mobile Number!";
        },
      },
      required: true,
      unique: true,
    },
    password: {
      type: String,
      validate: {
        validator: (value) => {
          var re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
          return re.test(value);
        },
        message: () => {
          return "At least one number,one speacial character, one lowercase and one uppercase letter at least eight characters Ex:ab$AB12@";
        },
      },
      required: true,
    },
    profile: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  this.password = await this.generatePasswordHash();
});

UserSchema.methods.generatePasswordHash = async function () {
  const saltRounds = 10;
  return await bcrypt.hash(this.password, saltRounds);
};

UserSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
