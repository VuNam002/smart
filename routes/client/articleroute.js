const express = require("express");
const router = express.Router();


const controller = require("../../controllers/client/articlecontroller");

router.get("/", controller.index);

router.get("/category/:slugCategory", controller.category);
router.get("/:slug", controller.detail);
router.post("/:slug/comments", controller.createComment);

module.exports = router;