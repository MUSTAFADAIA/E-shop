const express = require("express");
const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const {
  getreview,
  getreviewId,
  creatreview,
  updatereview,
  delereview,
  creatfilterOpj,
  setProductAndUserIdToBody,
} = require("../controller/reviewController  ");
const authController = require("../controller/authController");

const router = express.Router({ mergeParams: true });
router
  .route("/")
  .get(creatfilterOpj, getreview)
  .post(
    authController.protect,
    authController.allowedTo("user"),
    setProductAndUserIdToBody,
    createReviewValidator,
    creatreview
  );
router
  .route("/:id")
  .get(getReviewValidator, getreviewId)
  .put(
    authController.protect,
    authController.allowedTo("user"),

    updateReviewValidator,
    updatereview
  )
  .delete(
    authController.protect,
    authController.allowedTo("user", "admin", "manager"),
    deleteReviewValidator,
    delereview
  );

module.exports = router;
