import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;
const ItemSchema = new mongoose.Schema(
    {
        itemName: {
            type: String,
            required: true,
        },
        restaurentId: {
            type: ObjectId,
            ref: "restaurent",
            required: true,
        },
        menuId: {
            type: ObjectId,
            ref: "menu",
            required: true,
        },
        categoryId: {
            type: ObjectId,
            ref: "category",
            required: true,
        },
        itemBanner: {
            type: String,
            required: true,
        },
        itemPrice: {
            type: Number,
            required: true,
        },
        itemDescription: {
            type: String,
            default: "",
        },
        isApproved: {
            type: Number,
            default: 0,
            enum: [0, 1, 2], //0 = pending, 1 = approved, 2 = rejected
        },
        itemType: {
            type: Number,
            default: 0,
            enum: [0, 1, 2, 3], //0 = not decided, 1 = veg, 2 = nonveg, 3 = both
        },
        isActive: {
            type: Boolean,
            default: 1,
            enum: [0, 1] //0 = not Active, 1 = Active
        },
        isDelete: {
            type: Boolean,
            default: 0,
            enum: [0, 1] //0 = Not Deleted, 1 = Deleted
        },
    },
    { timestamps: true }
);

const Item = mongoose.model("item", ItemSchema);
export default Item;
