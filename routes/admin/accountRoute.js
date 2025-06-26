const express = require("express");
const router = express.Router();
const multer = require("multer"); 
const upload = multer(); 

const controller = require("../../controllers/admin/accountController");
const uploadCloudinary = require("../../helpers/uploadCloudinary");
const validate = require("../../validates/admin/account.validates");

router.get("/", controller.index);
router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("avatar"),       
  validate.createPost,           
  uploadCloudinary,
  controller.createPost
);

router.get("/edit/:id", controller.edit);
router.patch(
    "/edit/:id",
    upload.single("avatar"), 
    validate.editPatch, 
    uploadCloudinary,  
    controller.editPatch
)

router.get("/detail/:id", controller.detail);
router.delete("/delete/:id", controller.deleteItem);
router.patch("/change-status/:status/:id", controller.changeStatus);

module.exports = router;
