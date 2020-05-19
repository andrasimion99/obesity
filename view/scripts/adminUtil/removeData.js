const saveInfo = document.getElementsByClassName("save-info")[0];

saveInfo.addEventListener("click", function () {
  const year = document.getElementById("year");
  const state = document.getElementById("state");
  const category = document.getElementById("category");
  const subcategory = document.getElementById("subcategory");

  var data = {
    Description: year.value,
    LocationDesc: state.value,
    Stratification1: subcategory.value,
  };

  removeStatsData(data, category.value);
});

async function removeStatsData(data, category) {
  fetch(
    "http://localhost:3001/api/" +
      category +
      "?country=" +
      data.LocationDesc +
      "&year=" +
      data.Description,
    {
      method: "DELETE",
    }
  )
    .then((response) => response.json())
    .then(async function (data) {
      if (data.status === "success") {
        document.getElementById("after-save").innerHTML =
          "Your data was deleted!";
        document.getElementById("after-save").style.color = "green";
      } else {
        document.getElementById("after-save").innerHTML =
          "Your data couldn't be deleted!";
        document.getElementById("after-save").style.color = "red";
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}
