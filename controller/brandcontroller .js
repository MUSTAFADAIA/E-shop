const brandModel = require("../models/brandmodel ");
const factory = require("./handlerFactory");
const {uploadSingleImage}=require('../middleware/uploadImageMiddleware')
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");





//Upload Single Image
exports.uploadBrandImage = uploadSingleImage('image')

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);

    //Save image into our db
    req.body.image = filename
  next();
});

//@desc    get list of brand
//@route   get /api/v1/brand
//@access  public
exports.getbrand = factory.getAll(brandModel);

//@desc   get specific brand by id
//@route  GET api/v1/brand/:id
//@access Public
exports.getbrandId = factory.getOneId(brandModel);

//@desc     Creat brand
//@route    post /api/v1/brand
//@access   private
exports.creatbrand = factory.creatOne(brandModel);

//@desc   update specific brand by id
//@route  PUT api/v1/brand/:id
//@access Private
exports.updatebrand = factory.updateOne(brandModel);

//@desc   Delete specific brand by id
//@route  Delete api/v1/brand/:id
//@access Private
exports.delebrand = factory.deleteOne(brandModel);
