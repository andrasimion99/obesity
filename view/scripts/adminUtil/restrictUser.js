const saveInfo = document.getElementsByClassName("save-info")[0];

saveInfo.addEventListener("click", function () {
  const token = localStorage.getItem("token");
  const restrictEmail = document.getElementById("restrictEmail");
  const unrestrictEmail = document.getElementById("unrestrictEmail");

  if (restrictEmail.value) {
    var data = {
      token: token,
      email: restrictEmail.value,
    };
    restrictUser(data);
  }
  if (unrestrictEmail.value) {
    var data = {
      token: token,
      email: unrestrictEmail.value,
    };
    unrestrictUser(data);
  }
});

async function restrictUser(data) {
  fetch("https://accounts-tw.herokuapp.com/api/users/restrict", {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then(async function (data) {
      if (data.status === "success") {
        document.getElementById("after-save").innerHTML =
          "The user was restricted!";
        document.getElementById("after-save").style.color = "green";
      } else {
        document.getElementById("after-save").innerHTML =
          "The user couldn't be restricted.";
        document.getElementById("after-save").style.color = "red";
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

async function unrestrictUser(data) {
  fetch("https://accounts-tw.herokuapp.com/api/users/unrestrict", {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then(async function (data) {
      if (data.status === "success") {
        document.getElementById("after-save").innerHTML =
          "The user was unrestricted!";
        document.getElementById("after-save").style.color = "green";
      } else {
        document.getElementById("after-save").innerHTML =
          "The user couldn't be unrestricted.";
        document.getElementById("after-save").style.color = "red";
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}
