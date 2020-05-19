var maxValue = 5;
var maxValueBar = 20;
(async () => {
  await addCountries();
  var charts = document.getElementsByClassName("Chart");
  var chart = "";

  var series = document.getElementsByClassName("Series");
  var seriesValue = [];
  var seriesName = "";

  var countries = document.getElementsByClassName("Country");
  var checkedCountries = [];
  /*-----Event listener for countries check box------*/
  for (var i = 0; i < countries.length; i++) {
    countries[i].addEventListener("change", function () {
      if (this.checked) {
        document.getElementById("error-message").innerHTML = "";
        checkedCountries.push(this.value);
        if (chart == "line-chart" || chart == "column-chart") {
          createChart(checkedCountries, seriesName, seriesValue, chart);
          if (checkedCountries.length >= maxValue) {
            document.getElementById("error-message").innerHTML =
              "Can't select more than 5";
            disableAll(checkedCountries, "Country");
          }
        } else if (chart == "bar-chart") {
          createChart(checkedCountries, seriesName, seriesValue, chart);
          if (checkedCountries.length >= maxValueBar) {
            document.getElementById("error-message").innerHTML =
              "Can't select more than " + maxValueBar;
            disableAll(checkedCountries, "Country");
          }
        }
      } else {
        const index = checkedCountries.indexOf(this.value);
        if (index > -1) {
          checkedCountries.splice(index, 1);
        }
        if (checkedCountries.length > 0) {
          if (chart == "line-chart" || chart == "column-chart") {
            if (checkedCountries.length <= maxValue) {
              document.getElementById("error-message").innerHTML = "";
              removeDisable(checkedCountries, "Country");
              createChart(checkedCountries, seriesName, seriesValue, chart);
            }
            if (checkedCountries.length == maxValue) {
              disableAll(checkedCountries, "Country");
            }
          } else if (chart == "bar-chart") {
            if (checkedCountries.length <= maxValueBar) {
              document.getElementById("error-message").innerHTML = "";
              removeDisable(checkedCountries, "Country");
              createChart(checkedCountries, seriesName, seriesValue, chart);
            }
            if (checkedCountries.length == maxValueBar) {
              disableAll(checkedCountries, "Country");
            }
          }
        } else {
          d3.select("svg").remove();
          d3.select("table").remove();
        }
      }
    });
  }

  /*-----Event listener for chart tipe------*/

  for (var i = 0; i < charts.length; i++) {
    charts[i].addEventListener("click", function () {
      chart = this.value;
      this.style.border = "5px solid #2980b9";
      unclickAll(this);
      if (this.value == "line-chart" || this.value == "column-chart") {
        if (checkedCountries.length > maxValue) {
          document.getElementById("error-message").innerHTML =
            "Can't select more than" + maxValue + " for this type of chart";
        } else {
          document.getElementById("error-message").innerHTML = "";
          createChart(checkedCountries, seriesName, seriesValue, chart);
        }
      } else if (this.value == "bar-chart") {
        if (checkedCountries.length > maxValueBar) {
          document.getElementById("error-message").innerHTML =
            "Can't select more than " + maxValueBar + " for this type of chart";
        } else {
          removeDisable(checkedCountries, "Country");
          document.getElementById("error-message").innerHTML = "";
          createChart(checkedCountries, seriesName, seriesValue, chart);
        }
      }
    });
  }

  /*-----Event listener for series check box------*/
  for (var i = 0; i < series.length; i++) {
    series[i].addEventListener("change", function () {
      if (this.checked) {
        document.getElementById("error-message").innerHTML = "";
        seriesValue.push(this.value);
        seriesName = this.name;
        if (this.value === "All") {
          disableAllUnlessThis(seriesName, seriesValue, "Series");
        } else {
          disableAllSeries(seriesName, "Series");
        }
        if (chart == "line-chart" || chart == "column-chart") {
          if (checkedCountries.length > maxValue) {
            document.getElementById("error-message").innerHTML =
              "Can't select more than " +
              maxValue +
              " countries for this type of chart";
          } else if (seriesValue.length > maxValue) {
            document.getElementById("error-message").innerHTML =
              "Can't select more than " +
              maxValue +
              "series for this type of chart";
          } else {
            document.getElementById("error-message").innerHTML = "";
            createChart(checkedCountries, seriesName, seriesValue, chart);
          }
        } else if (chart == "bar-chart") {
          if (checkedCountries.length > maxValueBar) {
            document.getElementById("error-message").innerHTML =
              "Can't select more than " +
              maxValueBar +
              " countries for this type of chart";
          } else if (seriesValue.length > maxValueBar) {
            document.getElementById("error-message").innerHTML =
              "Can't select more than " +
              maxValueBar +
              "series for this type of chart";
          } else {
            document.getElementById("error-message").innerHTML = "";
            createChart(checkedCountries, seriesName, seriesValue, chart);
          }
        }
      } else {
        const index = seriesValue.indexOf(this.value);
        if (index > -1) {
          seriesValue.splice(index, 1);
        }
        if (this.value === "All") {
          removeDisable(seriesValue, "Series");
        } else {
          if (seriesValue.length === 0) removeDisable(seriesValue, "Series");
        }
        if (seriesValue.length > 0)
          createChart(checkedCountries, seriesName, seriesValue, chart);
        else {
          d3.select("svg").remove();
          d3.select("table").remove();
        }
      }
    });
  }
})();

function unclickAll(currentChart) {
  var charts = document.getElementsByClassName("Chart");
  for (var i = 0; i < charts.length; i++) {
    if (charts[i] != currentChart) {
      charts[i].style.border = "none";
    }
  }
}

function createChart(countries, seriesName, seriesValue, chart) {
  console.log("start");
  if (chart == "line-chart") {
    if (countries.length == 1 && seriesValue.length == 1) {
      if (seriesValue[0] != "All") {
        document.getElementById("error-message").innerHTML = "";
        if (seriesValue[0] != "Total") {
          createLineChart(seriesName, countries[0], seriesValue[0]);
        } else {
          createLineChart("states", countries[0]);
        }
      } else {
        document.getElementById("error-message").innerHTML = "";
        createLineChartAll(seriesName, countries[0]);
      }
    } else if (countries.length > 1 && seriesValue.length == 1) {
      if (seriesValue[0] != "All" && seriesValue[0] != "Total") {
        document.getElementById("error-message").innerHTML = "";
        createLineChartCountries(seriesName, countries, seriesValue[0]);
      } else if (seriesValue[0] == "Total") {
        createLineChartCountries("states", countries);
      } else {
        document.getElementById("error-message").innerHTML =
          "Can't select more countries for this series";
        d3.select("svg").remove();
        d3.select("table").remove();
      }
    } else if (countries.length === 1 && seriesValue.length > 1) {
      if (seriesValue.length <= 5) {
        document.getElementById("error-message").innerHTML = "";
        createLineChartSeries(seriesName, countries[0], seriesValue);
      } else {
        document.getElementById("error-message").innerHTML =
          "Can't select more than 5 series";
      }
    } else if (countries.length > 1 && seriesValue.length > 1) {
      console.log(document.getElementById("error-message"));
      document.getElementById("error-message").innerHTML =
        "Can't select more countries for this type of chart";
      d3.select("svg").remove();
      d3.select("table").remove();
    }
  } else if (chart == "column-chart") {
    if (countries.length == 1 && seriesValue.length == 1) {
      document.getElementById("error-message").innerHTML = "";
      if (seriesValue[0] != "All") {
        if (seriesValue[0] != "Total") {
          createBarChartYear(seriesName, countries[0], seriesValue[0]);
        } else {
          createBarChartYear("states", countries[0]);
        }
      } else {
        document.getElementById("error-message").innerHTML = "";
        createBarChartAll(seriesName, countries[0]);
      }
    } else if (countries.length > 1 && seriesValue.length == 1) {
      if (seriesValue[0] != "All" && seriesValue[0] != "Total") {
        document.getElementById("error-message").innerHTML = "";
        groupedBarChartCountries(seriesName, countries, seriesValue[0]);
      } else if (seriesValue[0] == "Total") {
        groupedBarChartCountries("states", countries);
      } else {
        document.getElementById("error-message").innerHTML =
          "Can't select more countries for this series";
        d3.select("svg").remove();
        d3.select("table").remove();
      }
    } else if (countries.length === 1 && seriesValue.length > 1) {
      if (seriesValue.length <= 5) {
        document.getElementById("error-message").innerHTML = "";
        groupedBarChartSeries(seriesName, countries[0], seriesValue);
      } else {
        document.getElementById("error-message").innerHTML =
          "Can't select more than 5 series";
      }
    } else if (countries.length > 1 && seriesValue.length > 1) {
      document.getElementById("error-message").innerHTML =
        "Can't select more countries and more series for this type of chart";
      d3.select("svg").remove();
      d3.select("table").remove();
    }
  } else if (chart == "bar-chart") {
    if (countries.length >= 1 && seriesValue.length == 1) {
      document.getElementById("error-message").innerHTML = "";
      if (seriesValue[0] != "All" && seriesValue[0] != "Total") {
        HorizontallyBarchartByCountries(seriesName, countries, seriesValue);
      } else if (seriesValue[0] == "Total") {
        HorizontallyBarchartByCountries("states", countries);
      } else {
        document.getElementById("error-message").innerHTML =
          "Can't select All for this type of chart";
        d3.select("svg").remove();
        d3.select("table").remove();
      }
    } else if (countries.length === 1 && seriesValue.length > 1) {
      if (seriesValue.length <= maxValueBar) {
        document.getElementById("error-message").innerHTML = "";
        HorizontallyBarchartBySeries(seriesName, seriesValue, countries[0]);
      } else {
        document.getElementById("error-message").innerHTML =
          "Can't select more than " + maxValueBar + " series";
      }
    }
  }
}

function disableAll(checkedValues, id) {
  var elements = document.getElementsByClassName(id);
  console.log(elements[0]);
  for (var i = 0; i < elements.length; i++) {
    {
      if (checkedValues.includes(elements[i].value) === false)
        elements[i].setAttribute("disabled", "");
    }
  }
}

function disableCheckBoxes() {
  var series = document.getElementsByClassName("Series");
  var countries = document.getElementsByClassName("Country");
  for (var i = 0; i < series.length; i++)
    series[i].setAttribute("disabled", "");
  for (var i = 0; i < countries.length; i++)
    countries[i].setAttribute("disabled", "");
}

function removeDisableCheckBoxes() {
  var series = document.getElementsByClassName("Series");
  var countries = document.getElementsByClassName("Country");
  for (var i = 0; i < series.length; i++) series[i].removeAttribute("disabled");
  for (var i = 0; i < countries.length; i++)
    countries[i].removeAttribute("disabled");
}

function disableAllUnlessThis(seriesName, seriesValue, id) {
  var elements = document.getElementsByClassName(id);
  for (var i = 0; i < elements.length; i++) {
    {
      if (elements[i].value != seriesValue || elements[i].name != seriesName)
        elements[i].setAttribute("disabled", "");
    }
  }
}

function disableAllSeries(seriesName, id) {
  var elements = document.getElementsByClassName(id);
  console.log(elements[0]);
  for (var i = 0; i < elements.length; i++) {
    {
      if (elements[i].name != seriesName)
        elements[i].setAttribute("disabled", "");
      if (elements[i].name == seriesName && elements[i].value == "All")
        elements[i].setAttribute("disabled", "");
    }
  }
}

function removeDisable(checkedValues, id) {
  var elements = document.getElementsByClassName(id);
  for (var i = 0; i < elements.length; i++) {
    {
      if (checkedValues.includes(elements[i].value) === false)
        elements[i].removeAttribute("disabled");
    }
  }
}
