const express = require("express");

const {
  addProductToCard,
  getLoggedUserCard,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../controller/cartController");
const authController = require("../controller/authController");

const router = express.Router();

router.use(authController.protect, authController.allowedTo("user"));
router
  .route("/")
  .post(addProductToCard)
  .get(getLoggedUserCard)
  .delete(clearCart);

router.put('/applyCoupon', applyCoupon);

router
  .route("/:itemId")
  .delete(removeSpecificCartItem)
  .put(updateCartItemQuantity);

module.exports = router;
