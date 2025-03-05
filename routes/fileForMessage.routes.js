// routes/fileForMessage.routes.js

const express = require("express");
const router = express.Router();
const fileForMessageController = require("../controllers/fileForMessage.controller");

// הגדרת הנתיבים עבור FileForMessage
router.get("/", fileForMessageController.getAllFilesForMessage);
router.post("/", fileForMessageController.addFileForMessage);
router.put("/:FFM_code", fileForMessageController.updateFileForMessage);
router.delete("/:FFM_code", fileForMessageController.deleteFileForMessage);

module.exports = router;
