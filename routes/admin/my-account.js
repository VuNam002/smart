const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const uploadToCloudinary = require("../../helpers/uploadCloudinary");
const controller = require("../../controllers/admin/my-account.controllers");

router.get("/", controller.index);
router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("avatar"),       
  uploadToCloudinary,            
  controller.editPatch         
);


module.exports = router;
