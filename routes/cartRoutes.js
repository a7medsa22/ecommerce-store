const express = require("express");
const {
  addProductToCartValidator,
  updateCartItemQuantityValidator,
  applyCouponValidator
} = require("../utils/validators/cartValidation");

const {
  addProductToCart,
  getLoggedUserCart,
  deleteLoggedUserCart,
  cleareCart,
  updateLoggedUserCart,
  applyCoupon,
} = require("../services/cartService");
const authprotect = require("../services/authService");

const router = express.Router();
router.use(authprotect.protect, authprotect.allowTo("user"));
router
  .route("/")
  .get(getLoggedUserCart)
  .post(addProductToCartValidator, addProductToCart)
  .put(updateCartItemQuantityValidator, updateLoggedUserCart)
  .delete(cleareCart);
  router.put('/applycoupon',applyCouponValidator,applyCoupon)

router.route("/:itemId").delete(deleteLoggedUserCart);

module.exports = router;
