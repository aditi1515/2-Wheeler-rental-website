const figures_container = document.querySelector(".figures-container");
const bikeScooterCanvas = document.querySelector("#bike-scooter-canvas");
const likedBrandsCanvas = document.querySelector("#liked-brands-canvas");
const citiesComparison = document.querySelector("#liked-cities-canvas");
const userBookingCanvas = document.querySelector("#user-bookings-canvas");
const revenueChartCanvas = document.querySelector("#revenue-chart-canvas");
const revenueSelect = document.querySelector(".revenue-select");
window.addEventListener('load',()=>{

  const currUser = JSON.parse(localStorage.getItem('currUser'));

  if( currUser===null || currUser.role!=='admin'){

    window.location = './index.html'
  }

}

)
function calculateTotalRevenue() {
  const orders = JSON.parse(localStorage.getItem("orders"));

  let totalAmount = orders.reduce((acc, order) => {
    return acc + order.cost;
  }, 0);
  return totalAmount;
}

function calculateUsers() {
  const users = JSON.parse(localStorage.getItem("users"));

  return users.length;
}

function totalBookings() {
  const orders = JSON.parse(localStorage.getItem("orders"));

  return orders.length;
}

function totalVehicles() {
  const vehicles = JSON.parse(localStorage.getItem("vehicles"));

  return vehicles.length;
}

function displayFigures() {
  const revenue = calculateTotalRevenue();
  const users = calculateUsers();
  const bookings = totalBookings();
  const vehicles = totalVehicles();
  figures_container.innerHTML = ` <div class="figures"><h3> Total Revenue</h3>
  <p> ₹ ${revenue}</p>
</div>
<div class="figures"><h3> Total Users</h3>
<p> ${users}</p></div>
<div class="figures"><h3> Total Bookings</h3>
<p>  ${bookings}</p></div>
<div class="figures"><h3> Total Vehicles</h3>
<p> ${vehicles}</p></div>
</div>`;
}
displayFigures();

function calculateBikesScooters() {
  const orders = JSON.parse(localStorage.getItem("orders"));

  const bikeScooterCount = orders.reduce(
    (acc, order) => {
      const vehicleDetail = getVehicleDetails(order.vehicleId);
      console.log(vehicleDetail);
      if(vehicleDetail===undefined) return acc;
      if (vehicleDetail.vType === "bike") {
        acc.bike += 1;
      } else {
        acc.scooter += 1;
      }
      return acc;
    },
    { bike: 0, scooter: 0 }
  );
  const chartLabels = Object.keys(bikeScooterCount);
  const chartData = Object.values(bikeScooterCount);

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: "Count",
        data: chartData,
        backgroundColor: ["#292950", "#f5738d", "rgb(255, 205, 86)"],
        hoverOffset: 4,
      },
    ],
  };
  const existingChart = Chart.getChart(bikeScooterCanvas);
  if (existingChart) {
    existingChart.destroy();
  }
  new Chart(bikeScooterCanvas, {
    type: "doughnut",
    data: data,
  });
}

function getVehicleDetails(vehicleId) {
  const vehicles = JSON.parse(localStorage.getItem("vehicles"));

  const vehicle = vehicles.filter((vehicle) => vehicleId === vehicle.vId);

  return vehicle[0];
}
calculateBikesScooters();

function mostLikedVehicleBrand() {
  const vehicles = JSON.parse(localStorage.getItem("vehicles"));
  const brandsCount = vehicles.reduce((acc, vehicle) => {
    if (acc[vehicle.vbrand] === undefined) {
      acc[vehicle.vbrand] = 0;
    }
    acc[vehicle.vbrand] += 1;
    return acc;
  }, {});
  console.log(brandsCount);

  const graphLabels = Object.keys(brandsCount);
  const graphData = Object.values(brandsCount);

  const data = {
    labels: graphLabels,
    datasets: [
      {
        label: "Bookings Count",
        data: graphData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const existingChart = Chart.getChart(likedBrandsCanvas);
  if (existingChart) {
    existingChart.destroy();
  }
  new Chart(likedBrandsCanvas, {
    type: "bar",
    data: data,
  });
}
mostLikedVehicleBrand();

function mostBookingCities() {
  const orders = JSON.parse(localStorage.getItem("orders"));
  const locations = JSON.parse(localStorage.getItem("locations"));

  const initialState = {};
  locations.forEach((location) => {
    initialState[location.city] = 0;
  });
  const cityWiseOrder = orders.reduce((acc, order) => {
    if (acc[order.location] === undefined) acc[order.location] = 0;
    acc[order.location] += 1;

    return acc;
  }, initialState);
  const graphLabels = Object.keys(cityWiseOrder);
  const graphData = Object.values(cityWiseOrder);
  console.log(cityWiseOrder);
  const data = {
    labels: graphLabels,
    datasets: [
      {
        label: "Bookings Count",
        data: graphData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const existingChart = Chart.getChart(citiesComparison);
  if (existingChart) {
    existingChart.destroy();
  }
  new Chart(citiesComparison, {
    type: "bar",
    data: data,
  });
}
mostBookingCities();

function userRegisterBookingsRatio() {
  const users = JSON.parse(localStorage.getItem("users"));
  const usersCount = users.length;

  const orders = JSON.parse(localStorage.getItem("orders"));

  const uniqueOrder = new Set();

  orders.forEach((order) => {
    uniqueOrder.add(order.userId);
  });

  const percentageForBookingUsers = (uniqueOrder.size / usersCount) * 100;
  const percentageForNonBookingUsers = 100 - percentageForBookingUsers;
  const data = {
    labels: ["HaveBooked", "NeverBooked"],
    datasets: [
      {
        label: "%",
        data: [percentageForBookingUsers, percentageForNonBookingUsers],
        backgroundColor: ["#292950", "#f5738d", "rgb(255, 205, 86)"],
        hoverOffset: 4,
      },
    ],
  };
  const existingChart = Chart.getChart(userBookingCanvas);
  if (existingChart) {
    existingChart.destroy();
  }
  new Chart(userBookingCanvas, {
    type: "pie",
    data: data,
  });
}
userRegisterBookingsRatio();

//revenue by location

//timmewise revenue
function sortOrders(orders) {
  orders.sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return dateA - dateB;
  });
  return orders;
}
function calculateRevenue() {
  let orders = JSON.parse(localStorage.getItem("orders"));
  orders = sortOrders(orders); 
  const filterOption = revenueSelect.value;
  console.log(filterOption);
  const revenue = orders.reduce((stats, order) => {
    const orderDate = new Date(order.start_date);
    // const isWithinTimeRange =
    //   orderDate >= TIME_RANGE.start_date && orderDate <= TIME_RANGE.end_date;
    if (true) {
      let key;
      switch (filterOption) {
        case "day-wise":
          key = orderDate.toISOString().split("T")[0];
          break;
        case "month-wise": {
          const month = orderDate.getMonth() + 1;
          const year = orderDate.getFullYear();
          const formattedMonth = month < 10 ? `0${month}` : month;
          const joinedDate = `${formattedMonth}-${year}`;
          console.log(joinedDate);
          key = joinedDate;
          break;
        }
        case "year-wise":
          key = orderDate.getFullYear().toString();
          break;
        default:
          key = orderDate.toISOString().slice(0, 7);
      }

      if (!stats[key]) {
        stats[key] = 0;
      }

      stats[key] += order.cost;
    }
    return stats;
  }, {});

  console.log(revenue);
  const graphLabels = Object.keys(revenue);
  const graphData = Object.values(revenue);
  const data = {
    labels: graphLabels,
    datasets: [
      {
        label: "revenue",
        data: graphData,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };
  const existingChart = Chart.getChart(revenueChartCanvas);
  if (existingChart) {
    existingChart.destroy();
  }
  new Chart(revenueChartCanvas, {
    type: "line",
    data: data,
  });
}
revenueSelect.addEventListener('change',() => {
  calculateRevenue();
});

calculateRevenue();

