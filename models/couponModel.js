const mongoose = require("mongoose");
const couponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "coupon name required"],
      unique: true,
    },
    expired:{
       type:Date,
       required:[true,'coupon expired time required']
    },
    discount: {
        type: Number,
        required: [true, "coupon discount required"],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
