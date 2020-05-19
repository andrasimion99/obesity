document.addEventListener("DOMContentLoaded", function (e) {
  const token = localStorage.getItem("token");

  setUserValues(token);
});

async function setUserValues(token) {
  fetch("http://localhost:3002/api/users?token=" + token)
    .then((response) => response.json())
    .then(async function (data) {
      if (data.data[0].firstName && data.data[0].lastName) {
        document.getElementById("profile-title").innerHTML =
          "Hello, " + data.data[0].firstName + " " + data.data[0].lastName;

        document.getElementsByClassName("username")[0].innerHTML =
          data.data[0].firstName + " " + data.data[0].lastName;

        document.getElementsByClassName("profile-name")[0].innerHTML =
          data.data[0].firstName.slice(0, 1) +
          data.data[0].lastName.slice(0, 1);
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}
