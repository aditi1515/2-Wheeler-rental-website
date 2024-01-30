const detailsContainer = document.querySelector(".details");
const ongoingTable = document.querySelector(".ongoing-table");
const activeTable = document.querySelector(".active-table");
const passiveTable = document.querySelector(".passive-table");
const changePassBtn = document.querySelector(".change-password");
const changePassDialog = document.querySelector("#changePass-dialog");
const currPass = document.querySelector("#curr-pass");
const newPass = document.querySelector("#new-pass");
const confirmNewPass = document.querySelector("#confirm-new-pass");
const passChangeBtn = document.querySelector(".pass-change");
const cancelChangeBtn = document.querySelector(".pass-cancel");
const passChangeForm = document.querySelector(".pass-container");
const passChangeSnackbar = document.querySelector('#passChange-snackbar')
window.addEventListener("load", () => {
  const currUser = JSON.parse(localStorage.getItem("currUser"));

  
  if (currUser === null) {
    window.location = "./index.html";
  }
});

//change password button
changePassBtn.addEventListener("click", () => {

  changePassDialog.show();
  passChangeForm.reset();
  resetError();

});
newPass.addEventListener("blur", passwordValidation);

//submit pass change form
passChangeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  resetError();
  passwordValidation();
  validateInputs(newPass.value);
});

//validate inputs of form
function validateInputs(newPass) {
  const errorMessageMap = new Map();
  const currUser = JSON.parse(localStorage.getItem("currUser"));

  const users = JSON.parse(localStorage.getItem("users"));


  const filterUser = users.filter((user) => {
    return user.userId === currUser.userId;
  });
  
  //passWord
  const currPassMess = [];

  if (currPass.value === "") {
    currPassMess.push("Password Required");
    errorMessageMap.set(currPass, currPassMess);
  } else if (currPass.value !== filterUser[0].password) {
    currPassMess.push("Incorrect Password");
    errorMessageMap.set(currPass, currPassMess);
  }
  //cnfirm password check

  if (newPass !== confirmNewPass.value) {
    const confirmPassMess = [];
    confirmPassMess.push("Password does not match");
    errorMessageMap.set(confirmNewPass, confirmPassMess);
  }

  setError(errorMessageMap);

  if (errorMessageMap.size === 0) {
    filterUser[0].password = newPass;
    
    for (const user of users) {
    
      if (user.userId === currUser.userId) {
        user.password = newPass;
        localStorage.setItem("users", JSON.stringify(users));
        showSnackbar("Password changed successfully",2000)
        changePassDialog.close();
        
      }
    }
  }
}

//validate new password
function passwordValidation() {
  const passVal = newPass.value;
  const errMessArr = [];
  if (!/[A-Z]/.test(passVal)) {
    errMessArr.push("Password must include at least one uppercase letter");
  }

  // Check if the password includes at least one lowercase letter
  if (!/[a-z]/.test(passVal)) {
    errMessArr.push("Password must include at least one lowercase letter");
  }

  // Check if the password includes at least one number
  if (!/\d/.test(passVal)) {
    errMessArr.push("Password must include at least one number");
  }

  // Check if the password includes at least one special character
  if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(passVal)) {
    errMessArr.push("Password must include at least one special character");
  }

  // Check if the password meets the overall length requirement
  if (passVal.length < 8) {
    errMessArr.push("Password must be at least 8 characters long");
  }

  const errorMessages = new Map();
  errorMessages.set(newPass, errMessArr);


  setError(errorMessages);
}

//set error messages in form 
function setError(errorMessages) {
  errorMessages.forEach((messArr, element) => {
    const errorListElement = document.createElement("ul");
    for (const mess of messArr) {
      const listElement = document.createElement("li");
      listElement.innerText = mess;
      errorListElement.appendChild(listElement);
    }
    // console.log(messArr, element);
    const inputField = element.parentElement;
    // console.log(inputField);
    const errorDisplay = inputField.querySelector(".error");
    errorDisplay.innerText = "";
    errorDisplay.appendChild(errorListElement);
    // console.log(errorListElement);
  });
}
//reset errors 
function resetError() {
  const allErrorElements = document.querySelectorAll(".error");
  allErrorElements.forEach((element) => {
    element.innerHTML = "";
  });
}




cancelChangeBtn.addEventListener("click", () => {
  changePassDialog.close();
});
window.addEventListener("load", () => {
  const currUser = JSON.parse(localStorage.getItem("currUser"));
  if (currUser) {
    const nameTag = document.createElement("h3");
    nameTag.innerHTML = ` Name : ${currUser.fname} ${currUser.lname}`;
    detailsContainer.appendChild(nameTag);
    const phoneTag = document.createElement("h3");
    phoneTag.innerHTML = `Phone Number : ${currUser.mobile}`;
    detailsContainer.appendChild(phoneTag);
    const emailTag = document.createElement("h3");
    emailTag.innerHTML = `Email : ${currUser.email} `;
    detailsContainer.appendChild(emailTag);
  }
  // console.log(currUser);
});
// window.onload = setProfileDetails;

//view user orders

//prepare order data function

function prepareOrderData() {
  const orders = JSON.parse(localStorage.getItem("orders"));

  const currUser = JSON.parse(localStorage.getItem("currUser"));

  const userOrders = orders.filter((order) => order.userId === currUser.userId);

  //categorize orders on basis of date

  const categorizedOrders = userOrders.reduce(
    (acc, order) => {
      const currDate = new Date().toISOString().split("T")[0];
      // const now = new Date();
      // const currTime = now.getHours() + ':' + now.getMinutes();

      // console.log(currTime);
      if (order.end_date < currDate) {
        //order has ended
        acc.passiveOrders.push(order);
      } else if (order.start_date <= currDate && order.end_date >= currDate) {
        //order is ongoing
        acc.ongoingOrders.push(order);
      } else {
        //future orders
        acc.activeOrders.push(order);
      }
      return acc;
    },

    {
      ongoingOrders: [],
      activeOrders: [],
      passiveOrders: [],
    }
  );

  for (const ongoingOrder of categorizedOrders.ongoingOrders) {
    const vehicle = getVehicleDetails(ongoingOrder.vehicleId);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${vehicle.vbrand} ${vehicle.vmodel}</td>
      
      <td>${vehicle.vType}</td>
      <td>${vehicle.location}</td>
      <td>${ongoingOrder.start_date} , ${ongoingOrder.start_time}</td>
      <td>${ongoingOrder.end_date} ,  ${ongoingOrder.end_time}</td>
      <td><img src = '${vehicle.vimg}' ></td>
      <td>ongoing</td>
    `;
    ongoingTable.appendChild(row);
  }
  for (const activeOrder of categorizedOrders.activeOrders) {
    const vehicle = getVehicleDetails(activeOrder.vehicleId);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${vehicle.vbrand} ${vehicle.vmodel}</td>
      
      <td>${vehicle.vType}</td>
      <td>${vehicle.location}</td>
      <td>${activeOrder.start_date} , ${activeOrder.start_time}</td>
      <td>${activeOrder.end_date} ,  ${activeOrder.end_time}</td>
      <td><img src = '${vehicle.vimg}' ></td>
      <td><button class="active-cancel-btn" orderId=${activeOrder.orderId}>Cancel</button></td>
    `;
    activeTable.appendChild(row);
  }
  for (const passiveOrder of categorizedOrders.passiveOrders) {
    const vehicle = getVehicleDetails(passiveOrder.vehicleId);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${vehicle.vbrand} ${vehicle.vmodel}</td>
      
      <td>${vehicle.vType}</td>
      <td>${vehicle.location}</td>
      <td>${passiveOrder.start_date} , ${passiveOrder.start_time}</td>
      <td>${passiveOrder.end_date} ,  ${passiveOrder.end_time}</td>
      <td><img src = '${vehicle.vimg}' ></td>
      <td>completed </td>
    `;
    passiveTable.appendChild(row);
  }

}

prepareOrderData();

function getVehicleDetails(vehicleId) {
  const vehicles = JSON.parse(localStorage.getItem("vehicles"));

  const vehicle = vehicles.filter((vehicle) => vehicleId === vehicle.vId);

  return vehicle[0];
}

const activeOrderCancelBtn = document.querySelectorAll(".active-cancel-btn");

for (const cancelBtn of activeOrderCancelBtn) {
  cancelBtn.addEventListener("click", () => {
    const orderId = cancelBtn.getAttribute("orderId");
    const orders = JSON.parse(localStorage.getItem("orders"));
    const canceledOrder = orders.filter((order) => order.orderId === orderId);
    const otherOrders = orders.filter((order) => order.orderId !== orderId);
    const vehicles = JSON.parse(localStorage.getItem("vehicles"));
    vehicles.forEach((vehicle) => {
      if (vehicle.vId === canceledOrder[0].vehicleId) {
        vehicle.orderIds = vehicle.orderIds.filter((orderId) => {
          return orderId !== canceledOrder[0].orderId;
        });
        
      }
    });
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
    localStorage.setItem("orders", JSON.stringify(otherOrders));
    window.location.reload();
  });
}

//snackbar
function showSnackbar(message, timeout = 3000) {
  passChangeSnackbar.className = "show";
  passChangeSnackbar.textContent = message;
  setTimeout(function () {
   passChangeSnackbar.className = passChangeSnackbar.className.replace(
    "show",
    ""
   );
  }, timeout);
 }