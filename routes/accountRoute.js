const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const acctController = require("../controllers/accountController")


// Route to deliver login view
router.get("/login", utilities.handleErrors(acctController.buildLogin))

//Route to deliver registration view
router.get("/register", utilities.handleErrors(acctController.buildRegister))

//Route to register a new account
router.post("/register", utilities.handleErrors(acctController.registerAccount))

module.exports = router;