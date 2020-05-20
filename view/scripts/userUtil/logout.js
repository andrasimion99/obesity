const logout = document.getElementById("logout");
logout.addEventListener("click", (e) => {
  var token = localStorage.getItem("token");
  var data = {
    token: token,
  };
  sendLogoutRequest(data);
});
async function sendLogoutRequest(data) {
  console.log(data);
  var bearer = "Bearer " + token;
  fetch("https://accounts-tw.herokuapp.com/api/users/logout", {
    method: "POST",
    body: JSON.stringify(data),
    // withCredentials: true,
    // credentials: "include",
    // mode: "cors",
    // headers: new Headers({
    //   Authorization: bearer,
    //   "Content-Type": "application/json; charset=utf-8",
    // }),
  })
    .then((response) => response.json())
    .then(async function (res) {
      console.log("raspuns:", res);
      if (res.status != "fail") {
        localStorage.removeItem("token");
        var profileButton = document.getElementById("user_profile");
        profileButton.style.display = "none";
        var loginButton = document.getElementById("loginButton");
        loginButton.style.display = "block";
        var logoutButton = document.getElementById("logoutButton");
        logoutButton.style.display = "none";
        if (
          window.location.href == "http://localhost:3000/profile.html" ||
          window.location.href == "http://localhost:3000/settings.html" ||
          window.location.href == "http://localhost:3000/likedArticles.html" ||
          window.location.href == "http://localhost:3000/uploadPhoto.html" ||
          window.location.href == "http://localhost:3000/adminProfile.html" ||
          window.location.href ==
            "http://localhost:3000/adminStatisticsData.html" ||
          window.location.href == "http://localhost:3000/adminStats.html" ||
          window.location.href == "http://localhost:3000/removeData.html" ||
          window.location.href == "http://localhost:3000/manageUsers.html"
        ) {
          window.location.replace("http://localhost:3000/index.html");
        }
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}
