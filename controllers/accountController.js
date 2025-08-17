const utilities = require("../utilities/")
const acctModel = require("../models/account-model")


/*************************
 * Deliver login view
 ************************/

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "Hello please Log In")
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

/*************************
 * Deliver Registration view
 ************************/

async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "Hello please Register now")
    res.render("account/register", {
        title: "Register",
        nav,
    })
}

/************************
 * Process Registration 
 ************************/

async function registerAccount(req, res, next) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const regResult = await acctModel.registerAccount(
        account_firstname, account_lastname, account_email, account_password
    )

    if (regResult) {
        req.flash("notice", `Congratulations ${account_firstname} ${account_lastname}, you\'re now registered. Please log in.`)
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
} 

module.exports = { buildLogin, buildRegister, registerAccount }