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
          window.location.href ==
            "https://obesity-tw.herokuapp.com/profile.html" ||
          window.location.href ==
            "https://obesity-tw.herokuapp.com/settings.html" ||
          window.location.href ==
            "https://obesity-tw.herokuapp.com/likedArticles.html" ||
          window.location.href ==
            "https://obesity-tw.herokuapp.com/uploadPhoto.html" ||
          window.location.href ==
            "https://obesity-tw.herokuapp.com/adminProfile.html" ||
          window.location.href ==
            "https://obesity-tw.herokuapp.com/adminStatisticsData.html" ||
          window.location.href ==
            "https://obesity-tw.herokuapp.com/adminStats.html" ||
          window.location.href ==
            "https://obesity-tw.herokuapp.com/removeData.html" ||
          window.location.href ==
            "https://obesity-tw.herokuapp.com/manageUsers.html"
        ) {
          window.location.replace(
            "https://obesity-tw.herokuapp.com/index.html"
          );
        }
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}
