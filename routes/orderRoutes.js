const express = require("express");
const {
  createOrderCash,
  getAllOrder,
  getOneOrder,
  createfilterObject,
  updateIsDeliverOrder,
  updateIsPaidOrder,
} = require("../services/orderService");
const { createOrderValidator } = require("../utils/validators/orderValidation");
const authprotect = require("../services/authService");

const router = express.Router();
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
router.get("/", createfilterObject, getAllOrder);
router.get("/:id", getOneOrder);

module.exports = router;
