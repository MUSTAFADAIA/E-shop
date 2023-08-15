const express = require("express");
const {
  getbrandValidator,
  createbrandValidator,
  updeatbrandValidator,
  deletebrandValidator,
} = require("../utils/validators/brandValidator ");

const router = express.Router();
const {
  getbrand,
  getbrandId,
  creatbrand,
  updatebrand,
  delebrand,
  uploadBrandImage,
  resizeImage,
} = require("../controller/brandcontroller ");
const authController = require("../controller/authController");

router
  .route("/")
  .get(getbrand)
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    uploadBrandImage,
    resizeImage,
    createbrandValidator,
    creatbrand
  );
router
  .route("/:id")
  .get(getbrandValidator, getbrandId)
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updeatbrandValidator,
    updatebrand
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deletebrandValidator,
    delebrand
  );

module.exports = router;
