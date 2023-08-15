const productModel = require("../models/productmodel");
const factory = require("./handlerFactory");

const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadMixOfImages } = require("../middleware/uploadImageMiddleware");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  console.log(req.files);
  // 1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `products-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  // 2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `products-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );
    }
    next();
  // }
});

//@desc    get list of product
//@route   get /api/v1/product
//@access  public
exports.getproduct = factory.getAll(productModel, "products");

//@desc   get specific product by idf
//@route  GET api/v1/product/:id
//@access Public
exports.getproductid = factory.getOneId(productModel,'review');

//@desc     Creat product
//@route    post /api/v1/product
//@access   private
exports.creatproduct = factory.creatOne(productModel);

//@desc   update specific product by id
//@route  PUT api/v1/product/:id
//@access Private
exports.updateproduct = factory.updateOne(productModel);

//@desc   Delete specific product by id
//@route  Delete api/v1/product/:id
//@access Private
exports.deleproduct = factory.deleteOne(productModel);
