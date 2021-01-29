import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;
const MenuSchema = new mongoose.Schema(
  {
    menuName: {
      type: String,
      required: true,
    },
    restaurentId: {
      type: ObjectId,
      ref: "restaurent",
      required: true,
    },
    menuBanner: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Number,
      default: 0,
      enum: [0, 1, 2], //0 for pending, 1 for approved, 2 for rejected
    },
    menuType: {
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3], //0 for not decided, 1 for veg, 2 for nonveg, 3 for both
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Menu = mongoose.model("menu", MenuSchema);
export default Menu;
