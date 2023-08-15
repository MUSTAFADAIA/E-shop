const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const { default: slugify } = require("slugify");

//1-rules
exports.getCategorsValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  validatorMiddleware,
];

exports.createCategorsValidator = [
  check("name")
    .notEmpty()
    .withMessage("catergory requerd")
    .isLength({ min: 3 })
    .withMessage("too short category name")
    .isLength({ max: 30 })
    .withMessage("too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updeatCategorsValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  body("name").optional().custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteCategorsValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  validatorMiddleware,
];
