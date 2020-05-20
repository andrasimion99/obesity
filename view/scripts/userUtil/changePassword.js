document.addEventListener("DOMContentLoaded", function (e) {
  const token = localStorage.getItem("token");

  setUserValues(token);
});

const saveInfo = document.getElementsByClassName("save-info")[0];

saveInfo.addEventListener("click", function () {
  const token = localStorage.getItem("token");
  const currentPass = document.getElementById("password1");
  const newPass = document.getElementById("password2");
  const confirmPass = document.getElementById("password3");

  if (newPass.value === confirmPass.value) {
    var data = {
      token: token,
      currentPassword: currentPass.value,
      newPassword: newPass.value,
    };

    changePassword(data);
  } else {
    document.getElementById("after-save").innerHTML =
      "The passwords don't match.";
    document.getElementById("after-save").style.color = "red";
  }
});

async function changePassword(data) {
  fetch("https://accounts-tw.herokuapp.com/api/users/changePassword", {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then(async function (data) {
      if (data.status === "success") {
        document.getElementById("after-save").innerHTML =
          "Your password was saved!";
        document.getElementById("after-save").style.color = "green";
      } else {
        document.getElementById("after-save").innerHTML =
          "Your password couldn't be saved!";
        document.getElementById("after-save").style.color = "red";
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

async function setUserValues(token) {
  fetch("https://accounts-tw.herokuapp.com/api/users?token=" + token)
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
