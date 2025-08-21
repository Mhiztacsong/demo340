const utilities = require("../utilities/")
const acctModel = require("../models/account-model")
const bcrypt = require("bcryptjs")


/*************************
 * Deliver login view
 ************************/

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "Hello please Log In")
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/****************************
 * Deliver Registration view
 ***************************/

async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "Hello please Register now")
    res.render("account/register", {
        title: "Register",
        nav,
        account_firstname: "",
        account_lastname: "",
        account_email: "",
        errors: null,
    })
}

/************************
 * Process Registration 
 ************************/

async function registerAccount(req, res, next) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    //Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hash(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry there was an error preocessing the registraion.")
        res.status(500).render("acccont/register", {
            title: "Registration",
            nav,
            errors: null
        })
    }

    const regResult = await acctModel.registerAccount(
        account_firstname, account_lastname, account_email, hashedPassword
    )

    if (regResult) {
        req.flash("notice", `Congratulations ${account_firstname} ${account_lastname}, you\'re now registered. Please log in.`)
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null
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