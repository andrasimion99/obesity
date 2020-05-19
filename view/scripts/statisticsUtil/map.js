document.addEventListener("DOMContentLoaded", function (e) {
  var countries = document.getElementsByTagName("path");
  var valuesObj = {};
  var csvData = [];
  (async () => {
    const years = await document.getElementById("years");
    var year = years.options[years.selectedIndex].value;

    const categories = await document.getElementById("categories");
    var category = categories.options[categories.selectedIndex].value;

    var subcategories = await document.getElementById("subcategories");
    var subcategory;

    years.addEventListener("change", async function (event) {
      year = years.options[years.selectedIndex].value;
      category = categories.options[categories.selectedIndex].value;
      await getCsvData(year, category);
      downloadCsv(year, category);
      await apiReq(year, category);
      downloadWebP(year, category);
      downloadSvg(year, category);
    });

    categories.addEventListener("change", async function (event) {
      year = years.options[years.selectedIndex].value;
      category = categories.options[categories.selectedIndex].value;

      if (category === "states") {
        var subcategoriesSelect = document.getElementById("subcategories");
        var subcategoryLabel = document.getElementById("subcategoryLabel");
        if (subcategoriesSelect) {
          subcategoriesSelect.remove();
        }
        if (subcategoryLabel) {
          subcategoryLabel.remove();
        }
        await getCsvData(year, category);
        downloadCsv(year, category);
        await apiReq(year, category);
        downloadWebP(year, category);
        downloadSvg(year, category);
      } else {
        var selectNode;
        var subcategoriesElem = document.getElementById("subcategories");
        if (subcategoriesElem) {
          selectNode = subcategoriesElem;
          var first = subcategoriesElem.firstElementChild;
          while (first) {
            first.remove();
            first = subcategoriesElem.firstElementChild;
          }
        } else {
          var labelNode = document.createElement("label");
          labelNode.setAttribute("for", "subcategory");
          labelNode.setAttribute("id", "subcategoryLabel");
          var textnode = document.createTextNode("Choose subcategory: ");
          labelNode.appendChild(textnode);
          document.getElementById("year").appendChild(labelNode);

          selectNode = document.createElement("select");
          selectNode.setAttribute("id", "subcategories");
          selectNode.setAttribute("name", "subcategory");
        }

        var subcategoriesArr = [];
        if (category === "age") {
          subcategoriesArr = [
            "18 - 24",
            "25 - 34",
            "35 - 44",
            "45 - 54",
            "55 - 64",
            "65 or older",
          ];
        } else if (category === "education") {
          subcategoriesArr = [
            "Less than high school",
            "High school graduate",
            "Some college or technical school",
            "College graduate",
          ];
        } else if (category === "gender") {
          subcategoriesArr = ["Female", "Male"];
        } else if (category === "income") {
          subcategoriesArr = [
            "Less than $15000",
            "$15000 - $24999",
            "$25000 - $34999",
            "$35000 - $49999",
            "$50000 - $74999",
            "$75000 or greater",
          ];
        } else if (category === "ethnicity") {
          subcategoriesArr = [
            "Non-Hispanic White",
            "Non-Hispanic Black",
            "Hispanic",
            "Asian",
            "Hawaiian / Pacific Islander",
            "2 or more races",
            "Other",
          ];
        }
        for (let i = 0; i < subcategoriesArr.length; i++) {
          var optionNode = document.createElement("option");
          optionNode.setAttribute("value", subcategoriesArr[i]);
          var optionText = document.createTextNode(subcategoriesArr[i]);
          optionNode.appendChild(optionText);
          selectNode.appendChild(optionNode);
        }

        document.getElementById("year").appendChild(selectNode);

        subcategories = await document.getElementById("subcategories");
        subcategory = subcategories.options[subcategories.selectedIndex].value;

        subcategories.addEventListener("change", async function (event) {
          year = years.options[years.selectedIndex].value;
          category = categories.options[categories.selectedIndex].value;
          subcategory =
            subcategories.options[subcategories.selectedIndex].value;
          await getCsvData(year, category, subcategory);
          downloadCsv(year, category, subcategory);
          await apiReq(year, category, subcategory);
          downloadWebP(year, category, subcategory);
          downloadSvg(year, category, subcategory);
        });

        await getCsvData(year, category, subcategory);
        downloadCsv(year, category, subcategory);
        await apiReq(year, category, subcategory);
        downloadWebP(year, category, subcategory);
        downloadSvg(year, category, subcategory);
      }
    });

    await getCsvData(year, category);
    downloadCsv(year, category);
    await apiReq(year, category);
    downloadSvg(year, category);
    downloadWebP(year, category);
    return valuesObj;
  })().then((valuesData) => {
    for (var i = 0; i < countries.length; i++) {
      countries[i].addEventListener("mouseover", function (event) {
        this.style.opacity = 0.5;
      });
      countries[i].addEventListener("mouseout", function (event) {
        this.style.opacity = 1;
      });
      countries[i].addEventListener("mousemove", function (event) {
        document.getElementById("box").style.display = "block";
        var data = "<div>" + this.getAttribute("data-name") + "</div>";
        data +=
          "<div>" + valuesData[this.getAttribute("data-name")] + "%" + "</div>";
        document.getElementById("box").innerHTML = data;
        document.getElementById("box").style.top = event.offsetY - 30 + "px";
        document.getElementById("box").style.left = event.offsetX + "px";
      });
      countries[i].addEventListener("mouseleave", function (event) {
        document.getElementById("box").style.display = "none";
      });
    }
  });

  var apiReq = async function (year, category, subcategory) {
    var url = "";
    for (const country of countries) {
      await (async () => {
        var countryName = await country.getAttribute("data-name");
        if (subcategory) {
          url =
            "http://localhost:3001/api/" +
            category +
            "?country=" +
            countryName +
            "&year=" +
            year +
            "&" +
            category +
            "=" +
            subcategory;
        } else {
          url =
            "http://localhost:3001/api/" +
            category +
            "?country=" +
            countryName +
            "&year=" +
            year;
        }
        await fetch(url)
          .then((data) => {
            return data.json();
          })
          .then((res) => {
            valuesObj[countryName] = res.data[0].Data_Value;
          })
          .catch((error) => {
            console.log(error);
          });
      })();
      if (valuesObj[country.getAttribute("data-name")] === "~") {
        country.style.fill = "#888888";
      } else if (15 > valuesObj[country.getAttribute("data-name")]) {
        country.style.fill = "#cbe9f7";
      } else if (
        20 > valuesObj[country.getAttribute("data-name")] &&
        valuesObj[country.getAttribute("data-name")] >= 15
      ) {
        country.style.fill = "#a4d8eb";
      } else if (
        25 > valuesObj[country.getAttribute("data-name")] &&
        valuesObj[country.getAttribute("data-name")] >= 20
      ) {
        country.style.fill = "#71cef0";
      } else if (
        30 > valuesObj[country.getAttribute("data-name")] &&
        valuesObj[country.getAttribute("data-name")] >= 25
      ) {
        country.style.fill = "#1ca4d6";
      } else if (
        35 > valuesObj[country.getAttribute("data-name")] &&
        valuesObj[country.getAttribute("data-name")] >= 30
      ) {
        country.style.fill = "#3282b8";
      } else if (
        valuesObj[country.getAttribute("data-name")] >= 35 &&
        valuesObj[country.getAttribute("data-name")] < 40
      ) {
        country.style.fill = "#027fad";
      } else if (valuesObj[country.getAttribute("data-name")] >= 30) {
        country.style.fill = "#142850";
      }
    }
  };

  var getCsvData = async function (year, category, subcategory) {
    var url = "";
    if (subcategory) {
      url =
        "http://localhost:3001/api/" +
        category +
        "?year=" +
        year +
        "&" +
        category +
        "=" +
        subcategory;
    } else {
      url = "http://localhost:3001/api/" + category + "?year=" + year;
    }
    await fetch(url)
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        csvData = res.data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  var downloadWebP = function (year, category, subcategory) {
    var svg = document.querySelector("svg").outerHTML;
    var img = document.querySelector("#image");
    var canvas = document.querySelector("canvas");
    img.src = "data:image/svg+xml;base64," + btoa(svg);
    img.onload = function () {
      canvas.getContext("2d").drawImage(img, 0, 0);
    };
    document.getElementById("webp").addEventListener("click", function () {
      var webp = canvas.toDataURL("image/webp");
      this.href = webp;
      if (subcategory) {
        this.download = year + "_" + category + "_" + subcategory + ".webp";
      } else {
        this.download = year + "_" + category + ".webp";
      }
    });
  };

  var downloadSvg = function (year, category, subcategory) {
    var svg = document.querySelector("svg").outerHTML;
    document.getElementById("svg").addEventListener("click", function () {
      this.href = "data:image/svg+xml;base64," + btoa(svg);
      if (subcategory) {
        this.download = year + "_" + category + "_" + subcategory + ".svg";
      } else {
        this.download = year + "_" + category + ".svg";
      }
    });
  };

  var downloadCsv = function (year, category, subcategory) {
    var csvContent = "Category,State,StateID,Year,ObesityPercent\n";
    csvData.forEach((item) => {
      csvContent +=
        item.StratificationId1 +
        "," +
        item.LocationDesc +
        "," +
        item.LocationAbbr +
        "," +
        item.Description +
        "," +
        item.Data_Value +
        "\n";
    });
    document.getElementById("csv").addEventListener("click", function () {
      this.href = "data:text/csv;charset=utf-8," + encodeURI(csvContent);
      if (subcategory) {
        this.download = year + "_" + category + "_" + subcategory + ".csv";
      } else {
        this.download = year + "_" + category + ".csv";
      }
    });
  };
});
