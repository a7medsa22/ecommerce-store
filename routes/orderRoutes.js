const express = require("express");
const {
  createOrderCash,
  getAllOrder,
  getOneOrder,
  createfilewObject,
  updateIsDeliverOrder,
  updateIsPaidOrder,
  checkoutSession,
} = require("../services/orderService");
const { createOrderValidator, getOrderValidator, checkoutSessionValidator } = require("../utils/validators/orderValidation");
const authprotect = require("../services/authService");

const router = express.Router();

router.get('/checkout-session/:cartId', authprotect.protect,authprotect.allowTo('user'), checkoutSessionValidator, checkoutSession);

router.use(authprotect.protect);
router.post(
  "/",
  authprotect.allowTo("user"),
  createOrderValidator,
  createOrderCash
);

router.put(
  "/:id/pay",
  authprotect.allowTo("admin", "manager"),
  updateIsPaidOrder
);
router.put(
  "/:id/deliver",
  authprotect.allowTo("admin", "manager"),
  updateIsDeliverOrder
);

router.use(authprotect.allowTo("user", "admin", "manager"));
router.get("/", createfilewObject, getAllOrder);
router.get("/:id", getOrderValidator, getOneOrder);

module.exports = router;
