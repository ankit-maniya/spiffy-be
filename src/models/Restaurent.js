import mongoose from "mongoose";
import { isEmail } from "validator";
import bcrypt from "bcrypt";

const ObjectId = mongoose.Schema.Types.ObjectId;
const RestaurentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
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
      required: true,
      unique: true,
    },
    restaurentName: {
      type: String,
      required: true,
      unique: true,
    },
    restaurentBanner: {
      type: String,
      required: true,
    },
    address: {
      type: [
        {
          // _id:false,
          latitude: String,
          longitude: String,
        },
      ],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Number,
      default: 0,
      enum: [0, 1, 2], //0 for pending, 1 for approved, 2 for rejected
    },
    role: {
      type: String,
      default: "RESTAURENT",
      enum: ["USER", "RESTAURENT", "ADMIN"],
    },
    deliveryCharges: {
      type: Number,
      default: 0,
    },
    foodType: {
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3], //0 for not decided, 1 for veg, 2 for nonveg, 3 for both
    },
    profile: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    authToken: {
      type: String,
    },
  },
  { timestamps: true }
);

RestaurentSchema.pre("save", async function () {
  this.password = await this.generatePasswordHash();
});

RestaurentSchema.methods.generatePasswordHash = async function () {
  const saltRounds = 10;
  return await bcrypt.hash(this.password, saltRounds);
};

export const validatePassword = async function (password, hashPassword) {
  debugger;
  return await bcrypt.compare(password, hashPassword);
};

const Restaurent = mongoose.model("Restaurent", RestaurentSchema);
export default Restaurent;
