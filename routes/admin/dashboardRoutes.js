//Đây là trang chủ
const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/dashboardcontroller");


router.get("/",controller.dashboard);


module.exports = router;