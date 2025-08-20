const utilities = require("./index")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/************************************
 * Registration Data Validation Rules
 ************************************/
validate.registrationRules = () => {
  return [
    // firstname is required and must be at least 1 character
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty().withMessage("Please provide a first name")
      .bail()
      .isLength({ min: 1 }).withMessage("First name must be at least 1 character"),

    // lastname is required and must be at least 2 characters
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty().withMessage("Please provide a last name")
      .bail()
      .isLength({ min: 2 }).withMessage("Last name must be at least 2 characters"),

    // email is required and must be valid
    body("account_email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .bail()
      .isEmail().withMessage("A valid email is required")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
            throw new Error("Email exists. Please log in or use a different email")
        }
      })
      .normalizeEmail(),

    // password is required and must be strong
    body("account_password")
      .trim()
      .notEmpty().withMessage("Password is required")
      .bail()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }).withMessage("Password does not meet requirements")
  ]
}

/**********************************************************
 * Check data and return errors or continue to registration
 **********************************************************/

validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            errors,
        })
        return
    }
    next()
}

/************************************
 * Login Data Validation Rules
 ************************************/
validate.loginRules = () => {
  return [  
    // email is required and must be valid
    body("account_email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .bail()
      .isEmail().withMessage("A valid email is required")
      .normalizeEmail(),

    // password is required
    body("account_password")
      .trim()
      .notEmpty().withMessage("Password is required")
  ]
}


/*******************
 * Check Login Data
 *******************/
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      account_email, 
      errors,        
    })
    return
  }
  next()
}


module.exports = validate