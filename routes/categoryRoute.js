const express = require("express");
const {
  getCategorsValidator,
  createCategorsValidator,
  updeatCategorsValidator,
  deleteCategorsValidator,
} = require("../utils/validators/categoryValidator");

const router = express.Router();
const {
  getcategory,
  creatCategory,
  getcategories,
  updateCategory,
  delecategories,
  uploadCategoryImage,
  resizeImage,
} = require("../controller/categorycontroller");

const authController = require("../controller/authController");

const subCategoryRoute = require("./subCategoryRoute");
router.use("/:categoryId/subcategory", subCategoryRoute);

router
  .route("/")
  .get(getcategory)
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategorsValidator,
    creatCategory
  );
router
  .route("/:id")
  .get(getCategorsValidator, getcategories)
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updeatCategorsValidator,
    updateCategory
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteCategorsValidator,
    delecategories
  );

module.exports = router;
