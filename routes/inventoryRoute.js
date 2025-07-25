//Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

//Route to build inventory by classification
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;