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

module.exports = invCont
