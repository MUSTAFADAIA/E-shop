const CategoryModel = require("../models/categorymodel");
const factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

//Upload Single Image
exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `catgory-${uuidv4()}-${Date.now()}.jpeg`;
  // await sharp(req.file.buffer)
  //   .resize(600, 600)
  //   .toFormat("jpeg")
  //   .jpeg({ quality: 90 })
  //   .toFile(`uploads/brands/${filename}`);

  //Save image into our db
  req.body.image = filename;
  next();
});

//@desc    get list of categories
//@route   get /api/v1/categories
//@access  public
exports.getcategory = factory.getAll(CategoryModel);

//@desc   get specific category by idf
//@route  GET api/v1/categories/:id
//@access Public
exports.getcategories = factory.getOneId(CategoryModel);
//@desc     Creat category
//@route    post /api/v1/categories
//@access   private
exports.creatCategory = factory.creatOne(CategoryModel);

//  .then((category)=>res.status(201).json({data: category})
//  ).catch((err)=>res.status(400).send(err))

// const newCategory = new CategoryModel({name});
// newCategory.save().then((doc)=>{
//     res.json(doc)
// }).catch((err)=>{
//     res.json(err)
// })

//@desc   update specific category by id
//@route  PUT api/v1/categories/:id
//@access Private
exports.updateCategory = factory.updateOne(CategoryModel);

//@desc   Delete specific category by id
//@route  Delete api/v1/categories/:id
//@access Private
exports.delecategories = factory.deleteOne(CategoryModel);
