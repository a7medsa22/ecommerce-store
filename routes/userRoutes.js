const express = require('express');
const {
    getUserValidator,
    createUserValidator,
    updateUserValidtor,
    updatePasswordUserValidtor,
    deleteUservalidator,
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
} = require("../services/userService");
const authprotect = require('../services/authService');

const router = express.Router();

// User management routes
router
  .route("/")
  .get(getUsers)
  .post(
    authprotect.protect,
    authprotect.allowTo('admin'),
    updateUserimage, 
    resizeUserImage, 
    createUserValidator, 
    createUser
  );

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(
    authprotect.protect,
    authprotect.allowTo('admin'),
    updateUserimage, 
    resizeUserImage, 
    updateUserValidtor, 
    updateUser
  )
  .delete(
    authprotect.protect,
    authprotect.allowTo('admin'),
    deleteUservalidator, 
    deleteUser
  );

// Password management route
router.put(
  "/:id/password", 
  authprotect.protect,
  authprotect.allowTo('admin'),
  updatePasswordUserValidtor, 
  updateUserPassword
);

// Account status management routes
router.put(
  "/:id/activate", 
  authprotect.protect,
  authprotect.allowTo('admin'),
  getUserValidator, 
  activateUser
);
router.put(
  "/:id/deactivate", 
  authprotect.protect,
  authprotect.allowTo('admin'),
  getUserValidator, 
  deactivateUser
);

module.exports = router;