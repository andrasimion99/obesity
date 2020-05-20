const signup_form = document.getElementById("signup-form");
signup_form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email");
  const password = document.getElementById("signup-password");
  var data = {
    email: email.value,
    password: password.value,
  };

  postData(data);
});
async function postData(data) {
  fetch("https://accounts-tw.herokuapp.com/api/users/register", {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then(async function (data) {
      if (data.status === "fail") {
        document.getElementById("signup-error-message").innerHTML = data.error;
      } else {
        document.getElementById("signup-error-message").innerHTML = "";
        document.getElementById("after-signup").innerHTML =
          "You can sign in now!";
        const container = document.getElementById("container");
        container.classList.remove("sign-up-active");
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}
