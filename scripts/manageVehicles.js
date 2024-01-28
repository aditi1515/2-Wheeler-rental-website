const vehicleFormDialog = document.querySelector("#vehicleForm-dialog");
const vehicleForm = document.querySelector(".vehicle-form-container");
const addVehicleBtn = document.querySelector(".addVehicle-btn");
const vehicleFormSubmit = document.querySelector(".submit-btn");
const closeFormButton = document.querySelector(".closeForm-btn");
const snackbar = document.querySelector("#snackbar");

const vType = document.getElementsByName("radio-group");
const vbrand = document.querySelector("#vbrand");
const vmodel = document.querySelector("#vmodel");
const vnum = document.querySelector("#vnum");
const vimg = document.querySelector("#vimg");
const selectLocation = document.querySelector(".locationSelect");
const priceHourly = document.querySelector("#price");
const nightPrice = document.querySelector("#nightPrice");
// const availability = document.querySelector("#availability");

window.addEventListener('load',()=>{

  const currUser = JSON.parse(localStorage.getItem('currUser'));

  if( currUser===null || currUser.role!=='admin' ){

    window.location = './index.html'
  }

}

)
function prepareData() {}

//show dialog form 
addVehicleBtn.addEventListener("click", () => {
  vehicleFormDialog.show();
});

// vehicleFormSubmit.addEventListener("click", () => {
//   vehicleFormDialog.close();
// });
closeFormButton.addEventListener("click", () => {
  vehicleFormDialog.close();
});

window.addEventListener("load", () => {
  const locationArr = JSON.parse(localStorage.getItem("locations"));
  console.log(locationArr);

  for (let i = 0; i < locationArr.length; i++) {
    let opt = locationArr[i];
    let el = document.createElement("option");
    el.textContent = opt.city;
    el.value = opt.city;
    selectLocation.appendChild(el);
  }
});

function prepareData() {
  let vTypeval = "";
  for (let radio of vType) {
    if (radio.checked) {
      vTypeval = radio.value;
      console.log(vTypeval);
    }
  }
  const vbrandVal = vbrand.value;
  const vmodelVal = vmodel.value;
  const vnumVal = vnum.value;
  const vimgVal = vimg.files[0];
  const selectLocationVal = selectLocation.value;
  const priceHourVal = priceHourly.value;
  const nightPriceVal = nightPrice.value;
  console.log(vimgVal);
  let vId = generateBikeID();
  const vehicleData = {
    vId: vId,
    vType: vTypeval,
    vbrand: vbrandVal,
    vmodel: vmodelVal,
    vnum: vnumVal,
    location: selectLocationVal,
    priceHour: priceHourVal,
    nightPrice: nightPriceVal,
    available: true,
  };
  compressImg64(vimgVal).then((image) => {
    vehicleData.vimg = image;
    saveVehicleData(vehicleData);

    vehicleForm.reset();
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
function generateBikeID() {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substring(2);
  return dateString + randomness;
}

vehicleForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const bikeData = prepareData();
});

function saveVehicleData(vehicleData) {
  const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
  vehicles.push(vehicleData);
  localStorage.setItem("vehicles", JSON.stringify(vehicles));
  console.log(vehicles);
  showSnackbar();
  // window.alert("Vehicle added successfully");
}
//snackbar
function showSnackbar() {
  // Get the snackbar DIV

  // Add the "show" class to DIV
  snackbar.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}



