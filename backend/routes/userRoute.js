const express = require("express");
const {
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser,
    getAllUser,
    getSingleUser,
    forgotPassword,
    resetPassword
} = require("../controller/userController");
const multer = require("multer");

const storage = multer.diskStorage({});
const upload = multer({ storage });
const router = express.Router();

router.post("/register",upload.single("profilePicture"),registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logoutUser);

router.put("/update/:id",upload.single("profilePicture"),updateUser);

router.route("/delete/:id").delete(deleteUser);

router.route("/all-users").get(getAllUser);

router.route("/user/:id").get(getSingleUser);

router.route("/forgot-password").post(forgotPassword);

router.route("/reset-password/:token").put(resetPassword);


module.exports = router;
