const express = require("express");

const storageController = require("../../controllers/adminControllers/storage");
const router = express.Router();

router.get("/get/:fileName", storageController.getFile);
router.post("/upload", storageController.postUploadFile);
router.delete("/delete", storageController.deleteFile);
module.exports = router;