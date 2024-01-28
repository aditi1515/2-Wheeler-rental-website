const detailsContainer = document.querySelector(".details");
const ongoingTable = document.querySelector(".ongoing-table");
const activeTable = document.querySelector(".active-table");
const passiveTable = document.querySelector(".passive-table");

window.addEventListener('load',()=>{

  const currUser = JSON.parse(localStorage.getItem('currUser'));
  console.log(currUser);
  if( currUser===null){

    window.location = './index.html'
  }

}

)
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
  console.log("Ongoing Orders:", categorizedOrders.ongoingOrders);
  console.log("Active Orders:", categorizedOrders.activeOrders);
  console.log("Passive Orders:", categorizedOrders.passiveOrders);
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
    console.log(orderId);
    const orders = JSON.parse(localStorage.getItem("orders"));
    console.log(orders);
    const canceledOrder = orders.filter((order) => order.orderId === orderId);
    console.log(canceledOrder);
    const otherOrders = orders.filter((order) => order.orderId !== orderId);
    console.log(otherOrders);
    const vehicles = JSON.parse(localStorage.getItem("vehicles"));
    vehicles.forEach((vehicle) => {
      if (vehicle.vId === canceledOrder[0].vehicleId) {
        console.log(vehicle.orderIds);
        vehicle.orderIds = vehicle.orderIds.filter((orderId) => {
          return orderId !== canceledOrder[0].orderId;
        });
        console.log(vehicle.orderIds);
      }
    });
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
    localStorage.setItem("orders", JSON.stringify(otherOrders));
    window.location.reload();
  });
}
