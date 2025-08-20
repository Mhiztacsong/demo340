const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const acctController = require("../controllers/accountController")
const validate = require("../utilities/account-validation")


// Route to deliver login view
router.get("/login", utilities.handleErrors(acctController.buildLogin))

//Route to deliver registration view
router.get("/register", utilities.handleErrors(acctController.buildRegister))

//Route to register a new account
router.post("/register",
    validate.registrationRules(),
    validate.checkRegData, 
    utilities.handleErrors(acctController.registerAccount)
)

//Route to process the login attempt
router.post("/login",
    validate.loginRules(),
    validate.checkLoginData,
    (req,res) => {
    res.send("Login process")
})

module.exports = router;