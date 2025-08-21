const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/************************************
 * Build inventory  by classification
 ***********************************/
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  console.log(data)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


/* ********************************
 *  Build inventory by inventory Id
 * ***************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const vehicle = await invModel.getInventoryById(inv_id)
  console.log(vehicle)
  const html = await utilities.buildVehicleDetailHTML(vehicle)
  let nav = await utilities.getNav() 
  res.render("./inventory/detail", {
    title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    html,
  })
}


/* ********************************
 *  Management View Display
 * ***************************** */
invCont.managementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Account Management",
    nav,
    errors: null
  })
}


/* ********************************
 *  View to display add-classification form
 * ***************************** */
invCont.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    classification_name: "",
    errors: null,
  })
}


/* ********************************
 *  Process Add Classification
 * ***************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const newClassification = await invModel.addNewClassification(classification_name)

  if (newClassification) {
    req.flash("notice", `Congratulations ${classification_name} classification added.`)
    res.redirect("/inv/management")
  } else {
    req.flash("notice", "Sorry classification not added, try again.")
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null
    })
  }
}

module.exports = invCont
