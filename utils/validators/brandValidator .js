const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const { default: slugify } = require("slugify");

//1-rules
exports.getbrandValidator = [
  check("id").isMongoId().withMessage("invalid brand id"),
  validatorMiddleware,
];

exports.createbrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("brand requerd")
    .isLength({ min: 3 })
    .withMessage("too short brand name")
    .isLength({ max: 30 })
    .withMessage("too long brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updeatbrandValidator = [
  check("id").isMongoId().withMessage("invalid brand id"),
  body("name").optional().custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deletebrandValidator = [
  check("id").isMongoId().withMessage("invalid brand id"),
  validatorMiddleware,
];
