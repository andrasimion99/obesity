const saveInfo = document.getElementsByClassName("save-info")[0];

saveInfo.addEventListener("click", function () {
  const year = document.getElementById("year");
  const state = document.getElementById("state");
  const obesityPercent = document.getElementById("obesityPercent");
  const category = document.getElementById("category");
  const subcategory = document.getElementById("subcategory");

  var data = {
    ID: Math.random() * 100,
    Description: year.value,
    LocationAbbr: "Abreviation",
    LocationDesc: state.value,
    DataSource: "BRFSS",
    Topic: "Obesity / Weight Status",
    Data_Value: obesityPercent.value,
    Sample_Size: Math.random() * 100,
    Stratification1: subcategory.value,
    StratificationId1: subcategory.value,
    LocationDisplayOrder: subcategory.value,
  };

  statsData(data, category.value);
});

async function statsData(data, category) {
    fetch("http://localhost:3001/api/" + category, {
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