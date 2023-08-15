const express = require("express");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  deleteSubCategoryValidator,
  updeatSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator ");

//mergeParams:Allow us to access mergeParams on other routers
const router = express.Router({ mergeParams: true });
const {
  creatSubCategory,
  getsubcategories,
  getsubcategory,
  updatesubCategory,
  deletsubcategories,
  setCategoryIdToBody,
  creatfilterOpj,
} = require("../controller/subCategoryController");
const authController = require("../controller/authController");

router
  .route("/")
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    creatSubCategory
  )
  .get(creatfilterOpj, getsubcategory);
router
  .route("/:id")
  .get(getSubCategoryValidator, getsubcategories)
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    updeatSubCategoryValidator,
    updatesubCategory
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteSubCategoryValidator,
    deletsubcategories
  );
module.exports = router;
