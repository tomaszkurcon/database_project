const express = require("express");
const multer = require("multer");
const storageController = require("../../controllers/adminControllers/storage");
const router = express.Router();

router.get("/get/:fileName", storageController.getFile);
router.post(
  "/upload",
  multer().single("file"),
  storageController.postUploadFile
);
router.post(
  "/uploadMany",
  multer().array("files", 10),
  storageController.postUploadManyFiles
);
router.delete("/delete", storageController.deleteFile);
module.exports = router;
