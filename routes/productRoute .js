const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const router = express.Router();
const {
  getproduct,
  creatproduct,
  getproductid,
  updateproduct,
  deleproduct,
  uploadProductImages,
  resizeProductImages,
} = require("../controller/productcontroller ");

const authController = require("../controller/authController");
const reviewRoute = require('../routes/reviewRoute  ')
//post   product/854efd45ed45ef45ef/review
//get   product/854efd45ed45ef45ef/review
//get   product/854efd45ed45ef45ef/review/45rf45f45fg45f45df45
router.use("/:productId/reviews", reviewRoute);

router
  .route("/")
  .get(getproduct)
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    creatproduct
  );
router
  .route("/:id")
  .get(getProductValidator, getproductid)
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateproduct
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteProductValidator,
    deleproduct
  );

module.exports = router;
