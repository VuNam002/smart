const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); 


const validate = require("../../validates/admin/product-categoryController.js");
const controller = require("../../controllers/admin/product-categoryController");
const uploadCloudinary = require("../../helpers/uploadCloudinary");

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.get("/create", controller.create);

// [POST] Xử lý tạo mới danh mục
router.post(
  "/create",
  upload.single("thumbnail"),       
  uploadCloudinary,                 
  validate.createPost,              
  controller.updatePost             
);
router.get("/detail/:id", controller.detail);
router.delete("/delete/:id", controller.deleteItem);
router.get("/edit/:id", controller.edit);

// [PATCH] Xử lý cập nhật danh mục
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),        
  uploadCloudinary,                  
  controller.editPatch               
);


module.exports = router;
