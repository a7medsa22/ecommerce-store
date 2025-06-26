const express = require("express");
const {
  addAddressValidator,
  removeAddressValidator,
} = require("../utils/validators/addressValidator");
const {
  addAddress,
  removeAddress,
  getAddresses,
} = require("../services/adressService");
const authprotect = require("../services/authService");

const router = express.Router();

router.use(authprotect.protect, authprotect.allowTo("user"));

router.post("/", addAddressValidator, addAddress);
router.delete("/:addressId", removeAddressValidator, removeAddress);
router.get("/", getAddresses);

module.exports = router; 