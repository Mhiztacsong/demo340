//Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/inventoryController")
const utilities = require("../utilities/")
const validate = require("../utilities/account-validation")


//Route to build inventory by classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build inventory detail page
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId))

// Route to inventory Management View
router.get("/management", utilities.handleErrors(invController.managementView))

//Route to add classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

//Route to add new classification
router.post("/add-classification",
    validate.addClassificationRules(),
    validate.checkAddClassificationData,
    utilities.handleErrors(invController.addClassification)
)

module.exports = router;