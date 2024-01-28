const signInForm = document.querySelector(".signIn-form");
const email = document.querySelector("#email");
const password = document.querySelector("#password");

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  resetError();
  validateUser();
});

function setErrorMessage(message) {
  const errorElement = document.querySelector(".error");

  errorElement.innerText = message;
}
function resetError() {
  const errorElement = document.querySelector(".error");

  errorElement.innerText = "";
}
function validateUser() {
  const emailVal = email.value;

  const passwordVal = password.value;

  const users = JSON.parse(localStorage.getItem("users"));

  if (users === null) setErrorMessage("Email does not exist");
  if (users !== null) {
    const filteredUser = users.filter((user) => emailVal === user.email);

    if (filteredUser.length === 0 || filteredUser[0].password != passwordVal) {
      setErrorMessage("* Email or password is incorrect");
    } else {
      saveCurrUserObj(filteredUser[0]);
    }
  }
}

function saveCurrUserObj(currUser) {
  console.log(currUser);

  const { password, ...user } = currUser;
  localStorage.setItem("currUser", JSON.stringify(user));
  const URLParams = new URLSearchParams(window.location.search);
  for (const p of URLParams) {
    console.log(p);
  }
  const redirectLink =
    URLParams.get("redirect") || "http://127.0.0.1:5500/index.html";
  console.log(redirectLink);
  window.location = redirectLink;

  // handleNavbarVisibility();
}
