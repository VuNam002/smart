//Đây là trang products
const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/productcontroller");

router.get("/", controller.index);
router.get("/:slug", controller.detail);
// router.get("/edit", controller.edit);

module.exports = router;