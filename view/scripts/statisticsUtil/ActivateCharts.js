(async () => {
  await addCountries();
  var charts = document.getElementsByClassName("Chart");
  var chart = "";

  var series = document.getElementsByClassName("Series");
  var seriesValue = "";
  var seriesName = "";

  var countries = document.getElementsByClassName("Country");
  var country = "";
  /*-----Event listener for countries check box------*/
  for (var i = 0; i < countries.length; i++) {
    countries[i].addEventListener("change", function () {
      if (this.checked) {
        country = this.value;
        disableAll(this, "Country");
        if (chart == "column-chart") {
          d3.select("svg").remove();
          d3.select("table").remove();
          if (seriesValue == "All") {
            if (seriesName === "gender") {
              groupedBarChartSeries(seriesName, country, ["Female", "Male"]);
            } else {
              createBarChartAll(seriesName, country);
            }
          } else if (seriesValue == "Total") {
            createBarChartYear("states", country);
          } else if (seriesName != "") {
            createBarChartYear(seriesName, country, seriesValue);
          }
        }
        if (chart == "line-chart") {
          console.log(seriesName);
          d3.select("svg").remove();
          d3.select("table").remove();
          if (seriesValue == "All") {
            if (seriesName === "gender") {
              createLineChartSeries(seriesName, country, ["Female", "Male"]);
            } else {
              createLineChartAll(seriesName, country);
            }
          } else if (seriesValue == "Total") {
            createLineChart("states", country);
          } else if (seriesName != "") {
            createLineChart(seriesName, country, seriesValue);
          }
        }
      } else {
        country = "";
        removeDisable(this, "Country");
        d3.select("svg").remove();
        d3.select("table").remove();
      }
    });
  }

  /*-----Event listener for chart tipe------*/

  for (var i = 0; i < charts.length; i++) {
    charts[i].addEventListener("click", function () {
      chart = this.value;
      this.style.border = "5px solid #2980b9";
      unclickAll(this);
      if (chart == "column-chart") {
        d3.select("svg").remove();
        d3.select("table").remove();
        if (country != "" && seriesValue == "All") {
          if (seriesName === "gender") {
            groupedBarChartSeries(seriesName, country, ["Female", "Male"]);
          } else {
            createBarChartAll(seriesName, country);
          }
        } else if (seriesValue == "Total" && country != "") {
          createBarChartYear("states", country);
        } else if (seriesName != "" && country != "") {
          createBarChartYear(seriesName, country, seriesValue);
        }
      } else if (chart == "line-chart") {
        d3.select("svg").remove();
        d3.select("table").remove();
        if (seriesValue == "All" && country != "") {
          if (seriesName === "gender") {
            createLineChartSeries(seriesName, country, ["Female", "Male"]);
          } else {
            createLineChartAll(seriesName, country);
          }
        } else if (seriesValue == "Total" && country != "") {
          createLineChart("states", country);
        } else if (seriesName != "" && country != "") {
          createLineChart(seriesName, country, seriesValue);
        } else {
          d3.select("svg").remove();
          d3.select("table").remove();
        }
      }
    });
  }

  /*-----Event listener for series check box------*/
  for (var i = 0; i < series.length; i++) {
    series[i].addEventListener("change", function () {
      if (this.checked) {
        seriesValue = this.value;
        seriesName = this.name;
        disableAll(this, "Series");
        if (chart == "column-chart") {
          d3.select("svg").remove();
          if (country != "" && seriesValue == "All") {
            if (seriesName === "gender") {
              groupedBarChartSeries(seriesName, country, ["Female", "Male"]);
            } else {
              createBarChartAll(seriesName, country);
            }
          } else if (seriesValue == "Total" && country != "") {
            createBarChartYear("states", country);
          } else if (seriesName != "" && country != "") {
            createBarChartYear(seriesName, country, seriesValue);
          }
        } else if (chart == "line-chart") {
          d3.select("svg").remove();
          d3.select("table").remove();
          if (seriesValue == "All" && country != "") {
            if (seriesName === "gender") {
              createLineChartSeries(seriesName, country, ["Female", "Male"]);
            } else {
              createLineChartAll(seriesName, country);
            }
          } else if (seriesValue == "Total" && country != "") {
            createLineChart("states", country);
          } else if (seriesName != "" && country != "") {
            createLineChart(seriesName, country, seriesValue);
          }
        }
      } else {
        seriesValue = "";
        seriesName = "";
        removeDisable(this, "Series");
        d3.select("svg").remove();
        d3.select("table").remove();
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

function disableAll(currentChecked, id) {
  var elements = document.getElementsByClassName(id);
  for (var i = 0; i < elements.length; i++) {
    {
      if (elements[i] != currentChecked)
        elements[i].setAttribute("disabled", "");
    }
  }
}

function removeDisable(currentChecked, id) {
  var elements = document.getElementsByClassName(id);
  for (var i = 0; i < elements.length; i++) {
    {
      if (elements[i] != currentChecked)
        elements[i].removeAttribute("disabled");
    }
  }
}
