document.addEventListener("DOMContentLoaded", function (e) {
  const token = localStorage.getItem("token");

  setUserValues(token);
});

const saveInfo = document.getElementsByClassName("save-info")[0];

saveInfo.addEventListener("click", function () {
  const token = localStorage.getItem("token");
  const firstName = document.getElementById("fname");
  const lastName = document.getElementById("lname");
  const email = document.getElementById("email");

  var data = {
    token: token,
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
  };

  changeInfo(data);
});

async function changeInfo(data) {
  fetch("http://localhost:3002/api/users/profile", {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then(async function (data) {
     
      if (data.status === "success") {
        document.getElementById("after-save").innerHTML =
          "Your data was saved!";
        document.getElementById("after-save").style.color = "green";
      } else {
        document.getElementById("after-save").innerHTML =
          "Your data couldn't be saved!";
        document.getElementById("after-save").style.color = "red";
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

async function setUserValues(token) {
  fetch("http://localhost:3002/api/users?token=" + token)
    .then((response) => response.json())
    .then(async function (data) {
      const firstName = document.getElementById("fname");
      const lastName = document.getElementById("lname");
      const email = document.getElementById("email");

      email.defaultValue = data.data[0].email;
      if (data.data[0].firstName && data.data[0].lastName) {
        firstName.defaultValue = data.data[0].firstName;
        lastName.defaultValue = data.data[0].lastName;

        document.getElementById("profile-title").innerHTML =
          "Hello, " + data.data[0].firstName + " " + data.data[0].lastName;

        document.getElementsByClassName("username")[0].innerHTML =
          data.data[0].firstName + " " + data.data[0].lastName;

        document.getElementsByClassName("profile-name")[0].innerHTML =
          data.data[0].firstName.slice(0,1) + data.data[0].lastName.slice(0,1);
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}
