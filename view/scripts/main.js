function openNav(x) {
  var sideNav = document.getElementById("mySidenav");
  var main = document.getElementById("main");
  if (
    (sideNav.style.width == 0 && main.style.marginLeft == 0) ||
    (sideNav.style.width == "0px" && main.style.marginLeft == "0px")
  ) {
    if (x.matches) {
      document.getElementById("mySidenav").style.width = "45%";
      document.getElementById("main").style.marginLeft = "45%";
      document.getElementsByClassName("main-nav")[0].style.zIndex = "1";
    } else {
      document.getElementById("mySidenav").style.width = "20%";
      document.getElementById("main").style.marginLeft = "20%";
      document.getElementsByClassName("main-nav")[0].style.zIndex = "1";
    }
  } else {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  }
}

document.addEventListener("DOMContentLoaded", function (e) {
  const token = localStorage.getItem("token");
  if (token) {
    setProfileRoute(token);
  }
});

async function setProfileRoute(token) {
  fetch("http://localhost:3002/api/users?token=" + token)
    .then((response) => response.json())
    .then(async function (data) {
      if (data.data[0].userType === "user") {
        document.getElementsByClassName("user_profile")[0].href =
          "profile.html";
      } else if (data.data[0].userType === "admin") {
        document.getElementsByClassName("user_profile")[0].href =
          "adminProfile.html";
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}
