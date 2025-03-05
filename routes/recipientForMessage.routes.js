// routes/recipientForMessage.routes.js

const express = require("express");
const router = express.Router();
const recipientForMessageController = require("../controllers/recipientForMessage.controller");

// הגדרת הנתיבים עבור RecipientForMessage
router.get("/", recipientForMessageController.getAllRecipientsForMessage);
router.post("/", recipientForMessageController.addRecipientForMessage);
router.put("/:RFM_code", recipientForMessageController.updateRecipientForMessage);
router.delete("/:RFM_code", recipientForMessageController.deleteRecipientForMessage);

module.exports = router;
