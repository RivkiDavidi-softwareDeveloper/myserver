// routes/call.routes.js

const express = require("express");
const router = express.Router();
const callController = require("../controllers/call.controller");

// הגדרת הנתיבים עבור Call
router.get("/", callController.getAllCalls);
router.post("/", callController.addCall);
router.put("/:Ca_code", callController.updateCall);
router.delete("/:Ca_code", callController.deleteCall);

module.exports = router;
