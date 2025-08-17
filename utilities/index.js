const invModel = require("../models/inventory-model")
const Util = {}

/****************************************
 * Constructs the nav HTML unordered list
 ***************************************/
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = `<ul>`
  list += `<li><a href="/" title="Home Page">Home</a></li>`
  
  data.rows.forEach((row) => {
    list += `
      <li>
        <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">
          ${row.classification_name}
        </a>
      </li>
    `
  })
  list += `</ul>`
  return list
}

/**************************************
 * Build the classification view HTML
 **************************************/
Util.buildClassificationGrid = async function(data) {
  let grid
  if (data.length > 0) {
    grid = `<ul id="inv-display">`
    data.forEach(vehicle => {
      grid += `
        <li>
          <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
          </a>
          <div class="namePrice">
            <hr />
            <h2>
              <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                ${vehicle.inv_make} ${vehicle.inv_model}
              </a>
            </h2>
            <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
          </div>
        </li>`
    })
    grid += `</ul>`
  } else {
    grid = `<p class="notice">Sorry, no matching vehicles could be found.</p>`
  }
  return grid
}

/* **************************************
* Build the vehicle HTML detail view
* ************************************ */
Util.buildVehicleDetailHTML = function(vehicle) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(vehicle.inv_price);

  const miles = vehicle.inv_miles.toLocaleString()

  return `
    <div class="vehicle-detail">
      <div>
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      </div>
      <div>
        <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
        <p><strong>Price: ${formattedPrice}</strong></p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <strong>Mileage:</strong> ${miles} miles
      </div>
    </div>
  `;
}

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util