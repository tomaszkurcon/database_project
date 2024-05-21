const express = require("express");

const storageController = require("../../controllers/adminControllers/storage");
const router = express.Router();

router.post("/upload", storageController.postUploadFile);

module.exports = router;