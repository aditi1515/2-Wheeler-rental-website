const selectLocation = document.querySelector(".locationSelect");
const dateTimeForm = document.querySelector(".form-container")
const locationElement = document.querySelector('.locationSelect')
const startDateTime = document.querySelector('#start-date');
const endDateTime = document.querySelector('#end-date');
const submitBtn = document.querySelector('#submit-btn');
const dateValidationSnackbar = document.querySelector('#datesValidation-snackbar');
window.addEventListener("load", () => {
  const locationArr = JSON.parse(localStorage.getItem("locations"));
  console.log(locationArr);

  for(let i = 0; i < locationArr.length; i++) {
    let opt = locationArr[i];
    let el = document.createElement("option");
    el.textContent = opt.city;
    el.value = opt.city; 
    selectLocation.appendChild(el);
}
});


//snackbar
function showSnackbar(message, timeout = 3000) {
  dateValidationSnackbar.className = "show";
  dateValidationSnackbar.textContent = message;
  setTimeout(function () {
   dateValidationSnackbar.className = dateValidationSnackbar.className.replace(
    "show",
    ""
   );
  }, timeout);
 }
 


