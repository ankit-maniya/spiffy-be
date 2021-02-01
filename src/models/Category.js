import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;
const CategorySchema = new mongoose.Schema(
    {
        categoryName: {
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
        categoryBanner: {
            type: String,
            required: true,
        },
        isApproved: {
            type: Number,
            default: 0,
            enum: [0, 1, 2], //0 = pending, 1 = approved, 2 = rejected
        },
        categoryType: {
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

const Category = mongoose.model("category", CategorySchema);
export default Category;
