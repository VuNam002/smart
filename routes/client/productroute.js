const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/productcontroller");

router.get("/", controller.index);

// Route cho danh mục sản phẩm. Đặt trước route chi tiết để tránh xung đột.
router.get("/category/:slugCategory", controller.category);
router.get("/:slug", controller.detail);
router.post("/:slug/comments", controller.createComment);

module.exports = router;