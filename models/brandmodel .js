const mongoose = require("mongoose");

//1 creatSchema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter brand"],
      unique: [true, "brand must be unique"],
      maxlength: [30, "name cant exceed more than {max} characters"],
      minlength: [3, "Name should have at least {min} character"],
    },
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
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};
//getone ,getAll,update
brandSchema.post("init", (doc) => {
  setImageURL(doc);
});

//ceate
brandSchema.post("save", (doc) => {
  setImageURL(doc);
});


//2 creatModel
module.exports= mongoose.model("brand", brandSchema);

