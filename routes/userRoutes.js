const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidtor,
  updatePasswordUserValidtor,
  deleteUservalidator,
  updateLoggedPasswordValidator,
  updateLoggedInfoValidator,
} = require("../utils/validators/userValidator");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserimage,
  resizeUserImage,
  updateUserPassword,
  activateUser,
  deactivateUser,
  getloggeduser,
  updateLoggedPassword,
  updateLoggedInfo,
} = require("../services/userService");
const authprotect = require("../services/authService");

const router = express.Router();

// Apply protection to all routes
router.use(authprotect.protect);

// Logged user routes (user can update their own info)
router.get("/getMe", getloggeduser, getUser);
router.put("/updateMyPassword", updateLoggedPasswordValidator, updateLoggedPassword);
router.put("/updateMe", updateLoggedInfoValidator, updateLoggedInfo);

// Admin-only routes
router.use(authprotect.allowTo("admin"));

// User management routes (Admin)
router
  .route("/")
  .get(getUsers)
  .post(
    updateUserimage,
    resizeUserImage,
    createUserValidator,
    createUser
  );

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(
    updateUserimage,
    resizeUserImage,
    updateUserValidtor,
    updateUser
  )
  .delete(
    deleteUservalidator,
    deleteUser
  );

// Password management route
router.put(
  "/:id/password",
  updatePasswordUserValidtor,
  updateUserPassword
);

// Account status management routes
router.put(
  "/:id/activate",
  getUserValidator,
  activateUser
);
router.put(
  "/:id/deactivate",
  getUserValidator,
  deactivateUser
);

module.exports = router;
