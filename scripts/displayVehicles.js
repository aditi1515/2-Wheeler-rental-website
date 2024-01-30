const bikesTableBody = document.querySelector("tbody");
const searchByNameInput = document.querySelector("#searchByName");
// const sortInput = document.querySelector("#sort");
const itemsPerPageInput = document.querySelector("#itemPerPage");
const pageNoSpan = document.querySelector("#pageNo");
const totalPagesSpan = document.querySelector("#totalPages");
const prevPageBtn = document.querySelector("#prevPage");
const nextPageBtn = document.querySelector("#nextPage");
const snackbarDisplayPage = document.getElementById("snackbar-displaypage");
const dialog = document.getElementById("displayBooking-dialog");
const itemPerPageWarning = document.querySelector("#item-per-page-warning");

function getBikes() {
 const bikesInLocalStorage = JSON.parse(localStorage.getItem("vehicles"));
 const bikes = bikesInLocalStorage.filter((bike) => {
  const searchByNameResult = bike.vmodel
   .toLowerCase()
   .includes(searchByNameInput.value.toLowerCase());
  let searchByLocation = true;
  let availablity = true;
  return searchByNameResult && searchByLocation && availablity;
 });

 return bikes;
}

function displayBikes(
 searchByName = "",
 sortBy = "HighToLowPrice",
 paginationDetails = {
  pageNo: 1,
  itemsPerPage: 10,
 }
) {
 if (
  paginationDetails.itemsPerPage < 1 ||
  isNaN(paginationDetails.itemsPerPage)
 ) {
  itemPerPageWarning.textContent = "Value must be greater than 0";
  itemPerPageWarning.style.display = "block";
  bikesTableBody.innerHTML = "";
  pageNoSpan.textContent = 0;
  totalPagesSpan.textContent = 0;
  prevPageBtn.disabled = true;
  nextPageBtn.disabled = true;
  return;
 } else {
  itemPerPageWarning.style.display = "none";
 }

 // empty prev table
 bikesTableBody.innerHTML = "";

 // get bikes to display
 const bikes = getBikes();
 const sortedBikes = sortBikes(bikes, sortBy);

 // pagination handle
 // calculate total pages
 const totalPages = Math.ceil(
  sortedBikes.length / parseInt(itemsPerPageInput.value)
 );
 // display total pages in UI
 totalPagesSpan.textContent = totalPages;

 // edge case
 if (paginationDetails.pageNo > totalPages) {
  paginationDetails.pageNo = totalPages;
 }

 // get bikes for current page

 const bikesAsPerPagination = paginate(sortedBikes, paginationDetails);
 console.log("bikesAsPerPagination", bikesAsPerPagination);
 // display current page number in UI
 pageNoSpan.textContent = paginationDetails.pageNo;
 // enable/disable buttons
 prevPageBtn.disabled =
  paginationDetails.pageNo === 1 || bikesAsPerPagination.length === 0;
 nextPageBtn.disabled =
  paginationDetails.pageNo === totalPages || bikesAsPerPagination.length === 0;
 console.log("currentPage items :", bikesAsPerPagination.length);

 // display bikes in UI
 bikesAsPerPagination.forEach((bike) => {
  const row = document.createElement("tr");
  const isAnyActiveOrder = isAnyActiveOrderOnBike(bike);
  console.log(isAnyActiveOrder);
  row.innerHTML = `
      <td>${bike.vbrand}</td>
      <td>${bike.vmodel}</td>
      <td>${bike.vType}</td>
      <td>${bike.location}</td>
      <td>${bike.priceHour}</td>
      <td>${bike.nightPrice}</td>
    
      <td><img src = '${bike.vimg}' ></td>
      <td class="action-wrapper">
        <button onClick='editVehicle(event)' class='vehicle-edit' vehicle=${JSON.stringify(
         removeSpaceFromObjectField(bike)
        )}>Edit</button>
       <button onClick=${
        isAnyActiveOrder ? "" : "deletevehicledialog(event)"
       } vehicleId = ${bike.vId} class='${
   isAnyActiveOrder ? "vehicle-delete disable" : "vehicle-delete"
  }'>Delete</button>
      </td>
    `;
  bikesTableBody.appendChild(row);
 });
}

function deletevehicledialog(event) {
 const vehicleId = event.target.getAttribute("vehicleId");
 dialog.innerHTML = `
  <div class="delete-dialog">
  <p>Are you sure you want to delete this vehicle?</p>
  <button class="delete-btn" vehicleId = ${vehicleId}>Delete</button>
  <button class="cancel-btn">Cancel</button>
  </div>
  `;
 dialog.style.marginTop = "15rem";
 dialog.show();
 const deleteBtn = document.querySelector(".delete-btn");
 const cancelBtn = document.querySelector(".cancel-btn");
 deleteBtn.addEventListener("click", () => {
  deleteVehicleById(event);
  dialog.close();
 });
 cancelBtn.addEventListener("click", () => {
  dialog.close();
 });
}
function sortBikes(bikes, sortBy) {
 // Implement your sorting logic here
 if (sortBy === "HighToLowPrice") {
  return bikes.sort((a, b) => b.dayPrice - a.dayPrice);
 } else if (sortBy === "LowToHighPrice") {
  return bikes.sort((a, b) => a.dayPrice - b.dayPrice);
 } else {
  return bikes; // Default case, no sorting
 }
}

function prepareSearchPredicate() {
 const searchByName = searchByNameInput.value;
 const sortBy = undefined;
 const paginationDetails = prepareBasePaginationDetails();
 displayBikes(searchByName, sortBy, paginationDetails);
}

function prepareBasePaginationDetails() {
 const paginationDetails = {
  pageNo: parseInt(pageNoSpan.innerHTML) || 1,
  itemsPerPage: parseInt(itemsPerPageInput.value),
 };
 console.log("paginationDetails", paginationDetails);

 console.log(paginationDetails);
 return paginationDetails;
}

searchByNameInput.addEventListener("input", () => {
 prepareSearchPredicate();
});

// sortInput.addEventListener("input", () => {
//  const paginationDetails = prepareBasePaginationDetails();
//  prepareSearchPredicate(searchByNameInput.value, paginationDetails);
// });
itemsPerPageInput.addEventListener("input", (e) => {
 console.log("page items entered", e.target.value);

 const paginationDetails = prepareBasePaginationDetails();
 console.log("calling display with ", paginationDetails);

 displayBikes(searchByNameInput.value, undefined, paginationDetails);
});
function paginate(bikes, paginationDetails) {
 const itemsPerPage = paginationDetails.itemsPerPage;
 const currentPage = paginationDetails.pageNo;
 const startIndex = (currentPage - 1) * itemsPerPage;
 let endIndex = startIndex + itemsPerPage;

 // Ensure endIndex doesn't exceed the length of the array
 endIndex = Math.min(endIndex, bikes.length);

 console.log(itemsPerPage, currentPage, startIndex, endIndex);

 return bikes.slice(startIndex, endIndex);
}

nextPageBtn.addEventListener("click", () => {
 const currentPage = parseInt(pageNoSpan.innerHTML);
 const paginationDetails = prepareBasePaginationDetails();
 paginationDetails.pageNo = currentPage + 1;
 displayBikes(searchByNameInput.value, undefined, paginationDetails);
});

prevPageBtn.addEventListener("click", () => {
 const paginationDetails = prepareBasePaginationDetails();
 paginationDetails.pageNo = paginationDetails.pageNo - 1;
 displayBikes(searchByNameInput.value, undefined, paginationDetails);
});

// crud for vehicles

function isAnyActiveOrderOnBike(bike) {
 const orders = JSON.parse(localStorage.getItem("orders")) || [];
 const activeOrdersOnThisVehicle = orders.filter((order) => {
  return (
   order.vehicleId === bike.vId &&
   new Date(`${order.end_date}T${order.end_time}:00.000Z`) > new Date()
  );
 });
 return activeOrdersOnThisVehicle.length > 0;
}

function editVehicle(event) {
 const vehicle = restoreSpacesInObject(
  JSON.parse(event.target.getAttribute("vehicle"))
 );
 console.log("editing vehicle");
 console.log(vehicle);

 const locationString = JSON.parse(localStorage.getItem("locations"))
  .map((location) => {
   const isSelected = location.city === vehicle.location ? "selected" : "";
   return `<option value="${location.city}" ${isSelected}>${location.city}</option>`;
  })
  .join("");

 dialog.innerHTML = `
 <form vehicleId = ${
  vehicle.vId
 } class="vehicle-edit-form-container vehicle-form-container">
 <h2>Welcome to <span>2WheelWander</span></h2>
  <div class="vehicle-image-container">
  <img src="${vehicle.vimg}" alt="vehicle image" />
  </div>
 <div class="input-field-vehicle">
   <label for="bike">Bike:</label>
   <p>
     <input type="radio" id="bike" name="radio-group" value="bike" required ${
      vehicle.vType === "bike" ? "checked" : ""
     }>
     <label for="bike">Bike</label>
   </p>
   <p>
     <input type="radio" id="scooter" name="radio-group" value="scooter" required ${
      vehicle.vType === "scooter" ? "checked" : ""
     }>
     <label for="scooter">Scooter</label>
   </p>
 </div>

 <div class="input-field">
   <label for="vbrand">Vehicle Brand:</label>
   <input type="text" name="vbrand" id="vbrand" required value="${
    vehicle.vbrand
   }">
 </div>

 <div class="input-field">
   <label for="vmodel">Vehicle Model:</label>
   <input type="text" name="vmodel" id="vmodel" value="${vehicle.vmodel}">
 </div>

 <div class="input-field">
   <label for="vnum">Vehicle Number:</label>
   <input type="text" name="vnum" id="vnum" value="${vehicle.vnum}">
 </div>

 <div class="input-field">
   <label for="vimg">Change Vehicle Image:</label>
   <input type="file" name="vimg" id="vimg" accept=".jpg,.png">
 </div>

 <div class="input-field">
   <label for="location">Location:</label>
   <select class="locationSelect" required>
    ${locationString}
   </select>
 </div>

 <div class="input-field">
   <label for="price">Price per hour:</label>
   <input type="text" name="price" id="price" required value="${
    vehicle.priceHour
   }">
 </div>

 <div class="input-field">
   <label for="nightPrice">Price (10pm - 6am):</label>
   <input type="text" name="nightPrice" id="nightPrice" required value="${
    vehicle.nightPrice
   }">
 </div>

 <div class="form-btn-container">
   <button type="submit" class="submit-btn">save Vehicle</button>
   <button class="close-editForm-btn">Close</button>
 </div>

 <div id="snackbar">Vehicle added successfully</div>
</form>`;

 // apply event listeners
 dialog.show();
 const vehicleEditForm = document.querySelector(".vehicle-edit-form-container");
 const closeFormButton = document.querySelector(".close-editForm-btn");

 vehicleEditForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const vType = vehicleEditForm.querySelector(
   'input[name="radio-group"]:checked'
  ).value;
  const vbrand = vehicleEditForm.querySelector("#vbrand").value;
  const vmodel = vehicleEditForm.querySelector("#vmodel").value;
  const vnum = vehicleEditForm.querySelector("#vnum").value;
  let vimg = vehicleEditForm.querySelector("#vimg").files[0];
  const location = vehicleEditForm.querySelector(".locationSelect").value;
  const priceHour = vehicleEditForm.querySelector("#price").value;
  const nightPrice = vehicleEditForm.querySelector("#nightPrice").value;

  if (vimg) {
   const compressedImg = await compressImg64(vimg);
   vimg = compressedImg;
  } else vimg = vehicle.vimg;

  const newVehicle = {
   vId: vehicle.vId,
   vType,
   vbrand,
   vmodel,
   vnum,
   vimg,
   location,
   priceHour,
   nightPrice,
   available: vehicle.available,
   orderIds: vehicle.orderIds,
  };

  const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];

  const updatedVehicles = vehicles.map((vehicle) => {
   if (vehicle.vId === newVehicle.vId) {
    return newVehicle;
   }
   return vehicle;
  });

  localStorage.setItem("vehicles", JSON.stringify(updatedVehicles));
  dialog.close();
  showSnackbar("Vehicle Updated Successfully", 2000);
  displayBikes();
 });

 closeFormButton.addEventListener("click", () => {
  console.log("close form");
  dialog.close();
 });
}

function compressImg64(imgFile) {
 const file = imgFile;
 const reader = new FileReader();

 return new Promise((resolve, reject) => {
  reader.onload = function (event) {
   const img = new Image();
   img.src = event.target.result;

   img.onload = function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions to the size you desire
    canvas.width = 300;
    canvas.height = 200;

    // Draw the image on the canvas (this will resize it)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Convert the canvas content to a data URL
    const compressedImageDataUrl = canvas.toDataURL("image/jpeg", 0.8);

    // Resolve with the compressed image data URL
    resolve(compressedImageDataUrl);
   };
  };

  reader.onerror = function (error) {
   // Reject with the error if any
   reject(error);
  };

  reader.readAsDataURL(imgFile);
 });
}

function deleteVehicleById(event) {
 console.log(event.target);
 const vehicleId = event.target.getAttribute("vehicleid");
 const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
 const updatedVehicles = vehicles.filter((vehicle) => {
  return vehicle.vId !== vehicleId;
 });
 localStorage.setItem("vehicles", JSON.stringify(updatedVehicles));
 showSnackbar("Vehicle Deleted Successfully", 2000);
 displayBikes();
}

//remove space from image field in vehicle object
function removeSpaceFromObjectField(object) {
 for (let key in object) {
  if (typeof object[key] === "string") {
   object[key] = object[key].replace(/\s/g, "_"); // Replace spaces with underscores
  }
 }
 return object;
}

function restoreSpacesInObject(obj) {
 for (let key in obj) {
  if (typeof obj[key] === "string") {
   obj[key] = obj[key].replace(/_/g, " "); // Replace underscores with spaces
  }
 }
 return obj;
}

function showSnackbar(message, timeout = 3000) {
 snackbarDisplayPage.className = "show";
 snackbarDisplayPage.textContent = message;
 setTimeout(function () {
  snackbarDisplayPage.className = snackbarDisplayPage.className.replace(
   "show",
   ""
  );
 }, timeout);
}

window.onload = () => {
 displayBikes();
};
