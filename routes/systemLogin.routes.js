// routes/systemLogin.routes.js

const express = require("express");
const router = express.Router();
const systemLoginController = require("../controllers/systemLogin.controller");

// הגדרת הנתיבים עבור SystemLogin
router.get("/", systemLoginController.getFirstSystemLogin);
router.post("/", systemLoginController.addSystemLogin);
router.put("/:SL_code", systemLoginController.updateSystemLogin);
router.delete("/:SL_code", systemLoginController.deleteSystemLogin);

module.exports = router;
