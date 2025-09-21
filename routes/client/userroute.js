const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/usercontroller");
const validate = require("../../validates/client/user.validates")

router.get("/register", controller.register);
router.post("/register", validate.registerPost, controller.registerPost);
router.get("/login", controller.login);
router.post("/login", controller.loginPost);

router.get("/logout", controller.logout)

router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot", validate.forgotPasswordPost, controller.forgotPasswordPost)
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost)

router.get("/password/reset",controller.resetPassWord)
router.post("/password/reset", validate.resetPassWordPost, controller.resetPassWordPost)

module.exports = router;