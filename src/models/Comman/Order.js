import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;

const OrderSchema = new mongoose.Schema(
  {
    restaurentId: {
      type: ObjectId,
      ref: "restaurent",
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: "user",
      required: true,
    },
    orderIds: {
      type: [ObjectId],
      ref: "Order",
      required: true,
    },
    itemQuantity: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    discountType: {
      type: String,
      default: 0,
    },
    grandTotal: {
      type: Number,
      default: 0,
      required: true,
    },
    orderStatus: {
      type: Number,
      default: 0,
      enum: [0, 1, 2], //0 = pending, 1 = approved, 2 = rejected
    },
    isDelete: {
      type: Boolean,
      default: 0,
      enum: [0, 1], //0 = Not Deleted, 1 = Deleted
    },
  },
  { timestamps: true }
);

const OrderDetailsSchema = new mongoose.Schema(
  {
    restaurentId: {
      type: ObjectId,
      ref: "restaurent",
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: "user",
      required: true,
    },
    itemId: {
      type: ObjectId,
      ref: "item",
      required: true,
    },
    itemQuantity: {
      type: Number,
      required: true,
    },
    itemApproved: {
      type: Number,
      default: 0,
      enum: [0, 1, 2], //0 = pending, 1 = approved, 2 = rejected
    },
    isDelete: {
      type: Boolean,
      default: 0,
      enum: [0, 1], //0 = Not Deleted, 1 = Deleted
    },
  },
  { timestamps: true }
);

const OrderDetail = mongoose.model("orderDetail", OrderDetailsSchema);
const Order = mongoose.model("order", OrderSchema);
export { OrderDetail, Order };
