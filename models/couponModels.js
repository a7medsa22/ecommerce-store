const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const CouponSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Coupon name is required!"],
      minlength: [3, "Too short coupon name!"],
      maxlength: [30, "Too long coupon name!"],
        },
      
    discount: {
      type: Number,
      required: [true, "Discount value is required!"],
      min: [1, "Discount must be at least 1%"],
      max: [100, "Discount cannot exceed 100%"],
    },
    expire: {
      type: Date,
      required: [true, "Expiration date is required!"],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const CouponModel = mongoose.model("Coupon", CouponSchema);

module.exports = CouponModel;
