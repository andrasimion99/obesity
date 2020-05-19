var token = localStorage.getItem("token");
if (token != null) {
  showAccount();
  var loginButton = document.getElementById("loginButton");
  loginButton.style.display = "none";
  var logoutButton = document.getElementById("logoutButton");
  logoutButton.style.display = "block";
}

function showAccount() {
  var profileButton = document.getElementById("user_profile");
  profileButton.style.display = "block";
}
