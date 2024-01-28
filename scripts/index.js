const selectLocation = document.querySelector(".locationSelect");
const dateTimeForm = document.querySelector(".form-container")
const locationElement = document.querySelector('.locationSelect')
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



