function sortByProperty(property) {
  return function (a, b) {
    if (a[property] > b[property]) return 1;
    else if (a[property] < b[property]) return -1;

    return 0;
  };
}
async function createLineChartAll(seriesName, country) {
  fetch("http://localhost:3001/api/" + seriesName + "?country=" + country)
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      d3.select("svg").remove();
      d3.select("table").remove();
      data = res.data.filter(function (d) {
        return parseInt(d.Description) === 2011;
      });
      data.sort(sortByProperty("Stratification1"));
      var minYear = d3.min(res.data, function (d) {
        return parseInt(d.Description);
      });
      var maxYear = d3.max(res.data, function (d) {
        return parseInt(d.Description);
      });
      var maxPercent = d3.max(res.data, function (d) {
        return parseFloat(d.Data_Value);
      });
      var numSeries = d3
        .set(data, function (d) {
          return d.Stratification1;
        })
        .size();

      var margin = { left: 100, right: 70, top: 10, bottom: 180 };
      if (seriesName === "age") {
        margin.bottom = 100;
      }
      var yearsArr = [];
      var width = 420 - margin.left - margin.right;
      var height = 450 - margin.top - margin.bottom;

      var svg = d3
        .select("#chart-area")
        .append("svg")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("viewBox", `0 0 450 420`)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var x = d3
        .scalePoint()
        .domain(
          data.map(function (d) {
            return d.Stratification1;
          })
        )
        .range([0, width]);

      x.invert = (function () {
        var domain = x.domain();
        var range = x.range();
        var scale = d3.scaleQuantize().domain(range).range(domain);

        return function (x) {
          return scale(x);
        };
      })();

      let xAxis = d3.axisBottom(x);
      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");

      var y = d3
        .scaleLinear()
        .domain([0, maxPercent + 10])
        .range([height, 0]);
      let yAxis = d3.axisLeft(y).tickFormat(function (d) {
        return d + "%";
      });
      svg.append("g").call(yAxis);
      var xText = svg
        .append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 20)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text(country + "-" + seriesName + "(" + 2011 + ")");

      svg
        .append("text")
        .attr("class", "y-axis-label")
        .attr("x", -(height / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Obesity Percentage (%)");

      /* create line */

      var linepath = svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return x(d.Stratification1);
            })
            .y(function (d) {
              if (d.Data_Value === "~") {
                d.Data_Value = 0;
              }
              return y(d.Data_Value);
            })
        );

      var focus = svg
        .append("g")
        .attr("class", "focus")
        .style("display", "none");
      focus.append("circle").attr("r", 5).style("fill", "steelblue");
      focus
        .append("rect")
        .style("fill", "#3d77a8")
        .attr("class", "tooltip")
        .attr("width", 50)
        .attr("height", 30)
        .attr("x", 10)
        .attr("y", -22)
        .attr("rx", 10)
        .attr("ry", 10);
      focus
        .append("text")
        .style("font-size", "14px")
        .style("fill", "white")
        .attr("class", "tooltip-date")
        .attr("x", 18)
        .attr("y", -2);

      svg
        .append("rect")
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);

      function mouseover() {
        focus.style("display", "block");
      }
      function mouseout() {
        focus.style("display", "none");
      }

      var bisectLeft = d3.bisector(function (d) {
        return d.Stratification1;
      }).left;

      function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisectLeft(data, x0, 1);
        d0 = data[i - 1];
        d1 = data[i];
        selectedData =
          x0 - d0.Stratification1 > d1.Stratification1 - x0 ? d1 : d0;
        console.log(d3.mouse(this)[0]);
        if (d3.mouse(this)[0] > width - 20) selectedData = data[numSeries - 1];
        focus.attr(
          "transform",
          "translate(" +
            x(selectedData.Stratification1) +
            "," +
            y(selectedData.Data_Value) +
            ")"
        );
        focus.select(".tooltip-date").text(selectedData.Data_Value + "%");
      }

      var timeBar = d3
        .select("#chart-area")
        .append("table")
        .attr("id", "time-bar")
        .attr("width", width + margin.left + margin.right)
        .append("thead")
        .append("tr");
      var timeImg = timeBar.append("th").attr("id", "time-img");
      var playIcon = timeImg.append("i").attr("class", "far fa-play-circle");
      var timeTable = timeBar.append("th").attr("id", "time-table");
      var timeCells = timeTable
        .append("table")
        .attr("id", "time-cells")
        .attr("width", width + margin.right)
        .append("thead");
      var timeCell = timeCells
        .append("tr")
        .attr("id", "cells-row")
        .selectAll("th")
        .data(function (d, i) {
          for (let j = minYear; j <= maxYear; j++) {
            yearsArr.push(j);
          }
          return yearsArr;
        })
        .enter()
        .append("th")
        .attr("class", "time-cell")
        .attr("data-cellvalue", function (d, i) {
          return yearsArr[i];
        });
      var yearCell = timeCells
        .append("tr")
        .attr("id", "years-row")
        .selectAll("th")
        .data(yearsArr)
        .enter()
        .append("th")
        .attr("class", "year-cell")
        .text(function (d, i) {
          return yearsArr[i];
        });

      timeCell.on("click", function () {
        let year = parseInt(this.getAttribute("data-cellvalue"));
        data = res.data.filter(function (d) {
          return parseInt(d.Description) === year;
        });
        linepath
          .datum(data.sort(sortByProperty("Stratification1")))
          .transition()
          .duration(1000)
          .attr(
            "d",
            d3
              .line()
              .x(function (d) {
                return x(d.Stratification1);
              })
              .y(function (d) {
                if (d.Data_Value === "~") {
                  d.Data_Value = 0;
                }
                return y(d.Data_Value);
              })
          );

        xText.text(country + " - " + seriesName + "( " + year + " )");
      });

      playIcon.on("click", function () {
        let year = minYear;
        let timer = setInterval(async function () {
          if (year != minYear) {
            document.getElementsByClassName("time-cell")[
              yearsArr.indexOf(year - 1)
            ].style["background-color"] = "#005082";
          }

          if (year <= maxYear) {
            document.getElementsByClassName("time-cell")[
              yearsArr.indexOf(year)
            ].style["background-color"] = "#000839";
            data = res.data.filter(function (d) {
              return parseInt(d.Description) === year;
            });
            linepath
              .datum(data.sort(sortByProperty("Stratification1")))
              .transition()
              .duration(1000)
              .attr(
                "d",
                d3
                  .line()
                  .x(function (d) {
                    return x(d.Stratification1);
                  })
                  .y(function (d) {
                    if (d.Data_Value === "~") {
                      d.Data_Value = 0;
                    }
                    return y(d.Data_Value);
                  })
              );
          }
          year++;
          if (year > maxYear + 1) {
            clearInterval(timer);
          }
          if (year <= maxYear + 1) {
            xText.text(country + " - " + seriesName + "( " + (year - 1) + " )");
          }
        }, 1000);
      });

      var name = country + "_" + seriesName;
      downloads(d3.select("svg"), data, name);
    })
    .catch((error) => {
      console.log(error);
    });
}
