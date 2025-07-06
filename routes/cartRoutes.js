const express = require("express");

const {
  addProductToCart,
  getLoggedUserCart,
  deleteLoggedUserCart,
  cleareCart
} = require("../services/cartService");
const authprotect = require("../services/authService");

const router = express.Router();
router.use(authprotect.protect, authprotect.allowTo("user"));
router
  .route("/")
  .get(getLoggedUserCart)
  .post(addProductToCart)
  .delete(cleareCart);
router.route("/:itemId").delete(deleteLoggedUserCart);

module.exports = router;
