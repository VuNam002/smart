const express = require("express");
const router = express.Router();
const multer = require("multer"); 
const upload = multer();

const controller = require("../../controllers/admin/article-categoryController");
const uploadCloudinary = require("../../helpers/uploadCloudinary");
const validate = require("../../validates/admin/article.validates");


router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloudinary,
    validate.createPost,
    controller.updatePost
)
//[PATCH] xửa lý sự kiện hoạt động hay không hoạt động
router.patch("/change-status/:status/:id", controller.changeStatus);
//[POST] xử lý chi tiết sản phẩm
router.get("/detail/:id", controller.detail);
//[DELETE] xóa sản phẩm
router.delete("/delete/:id", controller.deleteItem);
router.get("/edit/:id", controller.edit);

//[PATCH] xử lý cập nhật danh mục
router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadCloudinary,
    controller.editPatch
)




module.exports = router;
