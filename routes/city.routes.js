const express = require("express");
const router = express.Router();
const cityController = require("../controllers/city.controller");

router.get("/", cityController.getAllCities);
router.post("/", cityController.addCity);
router.put("/:Ci_code", cityController.updateCity);
router.delete("/:Ci_code", cityController.deleteCity);

module.exports = router;
