// routes/messageForCall.routes.js

const express = require("express");
const router = express.Router();
const messageForCallController = require("../controllers/messageForCall.controller");

// הגדרת הנתיבים עבור MessageForCall
router.get("/", messageForCallController.getAllMessagesForCall);
router.post("/", messageForCallController.addMessageForCall);
router.put("/:MFC_code", messageForCallController.updateMessageForCall);
router.delete("/:MFC_code", messageForCallController.deleteMessageForCall);

module.exports = router;
