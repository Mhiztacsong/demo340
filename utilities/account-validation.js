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


/*******************************************************
 * Add Classification in Inventory Data Validation Rules
 *******************************************************/
validate.addClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty().withMessage("Classification name is required")
      .bail()
      .isAlphanumeric().withMessage("Only letters and numbers are allowed (no spaces or special characters).")
  ]
}



/********************************
 * Check add classification Data
 *******************************/
validate.checkAddClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      classification_name,
      errors,
    })
    return
  }
  next()
}


/*******************************************************
 * Add Inventory Data Validation Rules
 *******************************************************/
validate.addInventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty().withMessage("Choose a vehicle classification"),

    body("inv_make")
      .trim()
      .notEmpty().withMessage("Inventory make is required")
      .bail()
      .isLength({ min: 3 }).withMessage("Inventory make must be at least 3 characters"),

    body("inv_model")
      .trim()
      .notEmpty().withMessage("Inventory model is required")
      .bail()
      .isLength({ min: 3 }).withMessage("Inventory model must be at least 3 characters"),

    body("inv_year")
      .notEmpty().withMessage("Inventory year is required")
      .bail()
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Enter a valid year"),

    body("inv_description")
      .trim()
      .notEmpty().withMessage("Inventory description is required"),

    body("inv_image")
      .trim()
      .notEmpty().withMessage("Image path is required"),

    body("inv_thumbnail")
      .trim()
      .notEmpty().withMessage("Thumbnail path is required"),

    body("inv_price")
      .notEmpty().withMessage("Inventory price is required")
      .bail()
      .isFloat({ min: 0 }).withMessage("Price must be a positive number"),

    body("inv_miles")
      .notEmpty().withMessage("Inventory miles is required")
      .bail()
      .isInt({ min: 0 }).withMessage("Miles must be a non-negative integer"),

    body("inv_color")
      .trim()
      .notEmpty().withMessage("Inventory color is required"),
  ]
}



validate.checkAddInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            title: "Add or Update Inventory",
            nav,
            classification_id, 
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color,
            errors,
        })
        return
    }
    next()
}



module.exports = validate