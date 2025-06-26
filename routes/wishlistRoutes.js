const express = require("express");
const {
  addToWishlistValidator,
  removeFromWishlistValidator,
} = require("../utils/validators/wishlistValidator");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../services/wishlistService");
const authprotect = require("../services/authService");

const router = express.Router();

router.use(authprotect.protect,authprotect.allowTo("user"));

router.post("/", addToWishlistValidator, addToWishlist);
router.delete("/:productId", removeFromWishlistValidator, removeFromWishlist);
router.get("/", getWishlist);

module.exports = router;
