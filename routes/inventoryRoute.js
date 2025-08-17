//Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/inventoryController")
const utilities = require("../utilities/")

//Route to build inventory by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build inventory detail page
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId))

module.exports = router;