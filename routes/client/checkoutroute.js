const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/checkoutcontroller");
router.get("/",controller.index);
router.post("/order", controller.order);
router.get("/success/:orderId", controller.success);

module.exports = router;