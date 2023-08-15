const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeuserPasswordValidator,
  updateLoggedUserValidator
} = require("../utils/validators/userValidator");

const router = express.Router();
const {
  getuser,
  getuserId,
  creatuser,
  updateuser,
  deleuser,
  uploadUserImage,
  resizeImage,
  changeuserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData
} = require("../controller/userController");
const authController = require("../controller/authController");

router.get("/getMe", authController.protect, getLoggedUserData, getuser);
router.put("/changeMyPassword", authController.protect, updateLoggedUserPassword);
router.put("/updateMe", authController.protect,updateLoggedUserValidator, updateLoggedUserData);
router.delete("/deletMe", authController.protect,deleteLoggedUserData);




router.put(
  "/changePassword/:id",
  changeuserPasswordValidator,
  changeuserPassword
);

router
  .route("/")
  .get(authController.protect, authController.allowedTo("admin"), getuser)
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    creatuser
  );
router
  .route("/:id")
  .get(
    authController.protect,
    authController.allowedTo("admin"),
    getUserValidator,
    getuserId
  )
  .put(
    authController.protect,
    authController.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateuser
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteUserValidator,
    deleuser
  );

module.exports = router;
