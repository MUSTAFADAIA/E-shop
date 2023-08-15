const subCategoryModel = require("../models/subCategoryModel");
const factory = require("./handlerFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  //Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

//Nested Route
//get  /api/v1/categories/:categoryId/subcategory
exports.creatfilterOpj = (req, res, next) => {
  let filterOpject = {};
  if (req.params.categoryId) filterOpject = { category: req.params.categoryId };
  req.filterOpj = filterOpject;
  next();
};

//@desc    get list of subcategories
//@route   get /api/v1/subcategories
//@access  public
exports.getsubcategory = factory.getAll(subCategoryModel);
//@desc   get specific subcategory by id
//@route  GET api/v1/subcategories/:id
//@access Public
exports.getsubcategories = factory.getOneId(subCategoryModel);

//@desc     Creat subCategory
//@route    post /api/v1/subCategories
//@access   private
exports.creatSubCategory = factory.creatOne(subCategoryModel);

//@desc   update specific subcategory by id
//@route  PUT api/v1/subcategories/:id
//@access Private
exports.updatesubCategory = factory.updateOne(subCategoryModel);

//@desc   Delete specific subcategory by id
//@route  Delete api/v1/subcategories/:id
//@access Private
exports.deletsubcategories = factory.deleteOne(subCategoryModel);
