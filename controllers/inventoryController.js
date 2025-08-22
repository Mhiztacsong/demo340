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
  res.render("inventory/classification", {
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
  res.render("inventory/detail", {
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
  res.render("inventory/management", {
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
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null
    })
  }
}

/* ********************************
 *  View to display add-inventory form
 * ***************************** */

invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add or Update Inventory",
    nav, 
    classificationSelect,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    errors: null
  })
}


/* ***********************
 *  Process Add Inventory
 * ******************** */

invCont.addInventory = async function (req, res) {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image,
          inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  const newInventory = await invModel.addNewInventory(classification_id, inv_make, inv_model,
         inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)

  if (newInventory) {
    req.flash("notice", `New inventory item "${inv_make} ${inv_model}" added successfully`);
    res.redirect("/inv/management");
  } else {
    req.flash("notice", "Failed to add new inventory item.")
    res.redirect("/inv/add-inventory");
  }
}

module.exports = invCont
