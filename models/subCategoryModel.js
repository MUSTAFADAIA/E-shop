const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      tirm: true,
      unique: [true, "SubCategory must be unique"],
      minlength: [2, "to short SubCategory name"],
      maxlength: [30, "to long SubCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, "SubCategory must be belong to parent category"],
    },
  },

  { timestamps: true }
);

// module.exports = mongoose.model("subCategorySchema", subCategorySchema);
const subCategoryModel = mongoose.model("subCategory", subCategorySchema);
module.exports = subCategoryModel;


   