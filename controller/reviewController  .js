const factory = require("./handlerFactory");
const reviewModel = require("../models/reviewModel");

exports.setProductAndUserIdToBody = (req, res, next) => {
  //Nested route
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;

  next();
};

//Nested Route
//get  /api/v1/product/:productId/review
exports.creatfilterOpj = (req, res, next) => {
  let filterOpject = {};
  if (req.params.productId) filterOpject = { product: req.params.productId };
  req.filterOpj = filterOpject;
  next();
};

//@desc    get list of reviews
//@route   get /api/v1/reviews
//@access  public
exports.getreview = factory.getAll(reviewModel);

//@desc   get specific review by id
//@route  GET api/v1/review/:id
//@access Public
exports.getreviewId = factory.getOneId(reviewModel);

//@desc     Creat review
//@route    post /api/v1/review
//@access   private/Product/user
exports.creatreview = factory.creatOne(reviewModel);

//@desc   update specific review by id
//@route  PUT api/v1/review/:id
//@access Private/Product/user
exports.updatereview = factory.updateOne(reviewModel);

//@desc   Delete specific review by id
//@route  Delete api/v1/review/:id
//@access Private/Product/user-Admin
exports.delereview = factory.deleteOne(reviewModel);
