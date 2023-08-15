const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const { default: slugify } = require("slugify");

//1-rules
exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid SubCategory id"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory requerd")
    .isLength({ min: 2 })
    .withMessage("too short SubCategory name")
    .isLength({ max: 32 })
    .withMessage("too long SubCategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .isMongoId()
    .withMessage("subCategory must be belong to category")
    .isMongoId()
    .withMessage("invalid Category id"),
  validatorMiddleware,
];

exports.updeatSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid SubCategory id"),
  body("name").optional().custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid SubCategory id"),
  validatorMiddleware,
];
