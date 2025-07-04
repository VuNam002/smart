const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const controller = require("../../controllers/admin/articlecontrollers");
const validate = require("../../validates/admin/product.validates");
const uploadToCloudinary = require("../../helpers/uploadCloudinary");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post (
    "/create",
    upload.single('thumbnail'),
    uploadToCloudinary,
    validate.createPost,
    controller.createPost
);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-nulti/", controller.changeNulti);
router.get("/create", controller.create);
router.post(
    "/create",
    upload.single('thumbnail'),
    uploadToCloudinary,
    validate.createPost,
    controller.createPost
)

router.get("/edit/:id", controller.edit);
router.post(
    "/edit/:id",
    upload.single('thumbnail'),
    uploadToCloudinary,
    validate.createPost,
    controller.updatePost
);
router.get("/detail/:id", controller.detail);
router.delete("/delete/:id", controller.deleteItem);

module.exports = router;






module.exports = router;