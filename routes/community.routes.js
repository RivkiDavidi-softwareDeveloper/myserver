// routes/community.routes.js

const express = require("express");
const router = express.Router();
const communityController = require("../controllers/community.controller");

// הגדרת הנתיבים עבור Community
router.get("/", communityController.getAllCommunities);
router.post("/", communityController.addCommunity);
router.put("/:Com_code", communityController.updateCommunity);
router.delete("/:Com_code", communityController.deleteCommunity);

module.exports = router;
