const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "too short produect title"],
      maxlength: [100, "too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [20, "too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [200000, "Too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      // required: [true, "Product image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product mest be belong to category"],
    },
    subcategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "brand",
    },
    retingsAverage: {
      type: Number,
      min: [1, "Reting must be above or equal 1.0"],
      max: [5, "Reting must be below or equal 5.0"],
    },
    retingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true ,
  // to enable virtual populate
  toJSON:{virtuals:true},
  toObject:{virtuals:true}

  }
);
productSchema.virtual("review", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${doc.images}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};
//getone ,getAll,update
productSchema.post("init", (doc) => {
  setImageURL(doc);
});

//ceate
productSchema.post("save", (doc) => {
  setImageURL(doc);
});

//Mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    delect: "name-_id",
  });
  next();
});

module.exports = mongoose.model("Product", productSchema);
