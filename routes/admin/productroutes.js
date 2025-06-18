//Đây là trang sảm phẩm
const express = require("express");
const router = express.Router();
const multer = require("multer")
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter()});

const controller = require("../../controllers/admin/productcontrollers");
const validate = require("../../validates/admin/product.validates")

router.get("/", controller.index);
router.patch("/change-status/:status/:id",controller.changeStatus);
router.patch("/change-nulti/",controller.changeNulti);
router.delete("/delete/:id",controller.deleteItem);
router.patch("/change-position", controller.changePosition);
router.get("/create", controller.create);
router.post("/create",
    upload.single('thumbnail'),      // Multer phải chạy trước
    validate.createPost,             // Validate sau khi đã có req.body
    controller.createPost
);
router.get("/edit/:id", controller.edit);
router.get("/detail/:id", controller.detail);


module.exports = router;