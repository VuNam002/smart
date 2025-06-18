//Đây là trang chủ
const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/homecontroller");


router.get("/",controller.index);


module.exports = router;