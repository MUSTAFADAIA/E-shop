const mongoose = require("mongoose");

//1 creatSchema
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter category"],
      unique: [true, "category must be unique"],
      maxlength: [30, "name cant exceed more than {max} characters"],
      minlength: [3, "Name should have at least {min} character"],
    },
    //A and B ==> shoping.com/a-asnd-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
//getone ,getAll,update
CategorySchema.post("init", (doc) => {
  setImageURL(doc);
});

//ceate
CategorySchema.post("save", (doc) => {
  setImageURL(doc);
});

//2 creatModel
const CategoryModel = mongoose.model("Category", CategorySchema);
module.exports = CategoryModel;
