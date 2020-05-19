// HorizontallyBarchartByCountries("states", [
//   "Alaska",
//   "California",
//   "Virginia",
//   "Texas",
//   "Ohio",
//   "New York",
//   "Michigan",
//   "Tennessee",
//   "Arizona",
//   "Nevada",
// ]);

// HorizontallyBarchartByCountries(
//   "age",
//   [
//     "Alaska",
//     "California",
//     "Virginia",
//     "Texas",
//     "Ohio",
//     "New York",
//     "Michigan",
//     "Tennessee",
//     "Arizona",
//     "Nevada",
//     "Indiana",
//     "Hawaii",
//     "New Jersey",
//     "Alabama",
//     "Pennsylvania",
//     // "District of Columbia",
//     // "Montana",
//     // "Colorado",
//     // "Wisconsin",
//     // "Guam",
//   ],
//   "18 - 24"
// );

async function HorizontallyBarchartByCountries(seriesName, types, seriesValue) {
  if (seriesValue) {
    url =
      "http://localhost:3001/api/" +
      seriesName +
      "?" +
      seriesName +
      "=" +
      seriesValue;
  } else {
    url = "http://localhost:3001/api/" + seriesName;
  }
  await fetch(url)
    .then((data) => {
      return data.json();
    })
    .then(async function (res) {
      d3.select("svg").remove();
      d3.select("table").remove();
      var datares = res.data;
      var data = [];
      for (let item of datares) {
        await (async () => {
          for (let type of types) {
            if (item.LocationDesc == type) {
              await data.push(item);
            }
          }
        })();
      }
      data = data.sort(function (a, b) {
        return (
          parseInt(a.Description) - parseInt(b.Description) ||
          parseFloat(a.Data_Value) - parseFloat(b.Data_Value)
        );
      });

      var minYear = d3.min(data, function (d) {
        return parseInt(d.Description);
      });
      var maxYear = d3.max(data, function (d) {
        return parseInt(d.Description);
      });
      var maxPercent = d3.max(data, function (d) {
        return parseFloat(d.Data_Value);
      });

      var margin = { left: 120, right: 10, top: 10, bottom: 100 };
      var yearsArr = [];
      var width = 500 - margin.left - margin.right;
      var height = 450 - margin.top - margin.bottom;
      if (types.length <= 5) {
        height = 300 - margin.top - margin.bottom;
      }
      var precedentYear = minYear;
      var color = d3
        .scaleOrdinal()
        .domain(
          data.map(function (d) {
            return d.LocationDesc;
          })
        )
        .range([
          "#00a8cc",
          "#005082",
          "#ffa41b",
          "#c060a1",
          "#d63447",
          "#00bdaa",
          "#af8baf",
          "#cf7500",
        ]);
      var xscale = d3.scaleLinear().range([0, width]).domain([0, maxPercent]);
      var yscale = d3
        .scaleBand()
        .rangeRound([height, 0])
        .padding(0.3)
        .domain(
          data
            .filter(function (d) {
              return parseInt(d.Description) == minYear;
            })
            .map(function (d) {
              return d.LocationDesc;
            })
        );

      var svg = d3
        .select("#chart-area")
        .append("svg")
        .attr("viewBox", `0 0 500 450`)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      var g = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var xText = g
        .append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 20)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text(function () {
          if (seriesName === "states") {
            return "Total" + "( " + minYear + " )";
          } else {
            return seriesName + " - " + seriesValue + "( " + minYear + " )";
          }
        });

      var xAxis = d3.axisBottom(xscale);
      g.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", "10")
        .attr("x", "4")
        .attr("text-anchor", "end");

      var yAxis = d3
        .axisLeft(yscale)
        .tickFormat(function (d) {
          return d;
        })
        .tickSize(0);
      var callYAxis = g.append("g").attr("class", "y-axis").call(yAxis);

      callYAxis.select(".domain").remove();
      callYAxis.selectAll("text").attr("font-size", 13);

      var valueBox = d3
        .select("#chart-area")
        .data(
          data.filter(function (d) {
            return parseInt(d.Description) === minYear;
          })
        )
        .append("div")
        .style("position", "absolute")
        .style("color", "#ffffff")
        .style("z-index", "10")
        .style("display", "none")
        .style("background", "#212121")
        .style("border", "0px solid #ffffff")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("font-size", "14px")
        .text(function (d) {
          return d.Data_Value + "%";
        });

      var rects = g
        .selectAll("rect")
        .data(
          data.filter(function (d) {
            return parseInt(d.Description) === minYear;
          })
        )
        .enter()
        .append("rect")
        .attr("width", function (d) {
          return xscale(parseFloat(d.Data_Value));
        })
        .attr("height", function (d) {
          return yscale.bandwidth();
        })
        .attr("y", function (d) {
          return yscale(d.LocationDesc);
        })
        .attr("fill", function (d) {
          return color(d.LocationDesc);
        })
        .on("mouseover", function (d) {
          valueBox.text(d.Data_Value + "%");
          this.style.opacity = 0.7;
          return valueBox.style("display", "block");
        })
        .on("mousemove", function () {
          return valueBox
            .style("top", d3.event.pageY - 30 + "px")
            .style("left", d3.event.pageX + 10 + "px");
        })
        .on("mouseout", function () {
          this.style.opacity = 1;
          return valueBox.style("display", "none");
        });

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
        rects
          .data(
            data.filter(function (d) {
              return parseInt(d.Description) === year;
            })
          )
          .attr("y", function (d) {
            return yscale(d.LocationDesc);
          });
        rects
          .data(
            data.filter(function (d) {
              return parseInt(d.Description) === precedentYear;
            })
          )
          .attr("width", function (d) {
            return xscale(parseFloat(d.Data_Value));
          });

        yscale = d3
          .scaleBand()
          .rangeRound([height, 0])
          .padding(0.3)
          .domain(
            data
              .filter(function (d) {
                return parseInt(d.Description) == year;
              })
              .map(function (d) {
                return d.LocationDesc;
              })
          );
        yAxis = d3
          .axisLeft(yscale)
          .tickFormat(function (d) {
            return d;
          })
          .tickSize(0);
        callYAxis.transition().ease(d3.easeLinear).duration(1000).call(yAxis);
        callYAxis.select(".domain").remove();

        rects
          .data(
            data.filter(function (d) {
              return parseInt(d.Description) === year;
            })
          )
          .transition()
          .ease(d3.easeLinear)
          .duration(1000)
          .attr("width", function (d) {
            return xscale(parseFloat(d.Data_Value));
          })
          .attr("height", function (d) {
            return yscale.bandwidth();
          })

          .attr("y", function (d) {
            return yscale(d.LocationDesc);
          })
          .attr("fill", function (d) {
            return color(d.LocationDesc);
          })
          .text(function (d) {
            return d.LocationDesc;
          });

        xText.text(seriesName + "( " + year + " )");
        precedentYear = year;
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

            rects
              .data(
                data.filter(function (d) {
                  return parseInt(d.Description) === year;
                })
              )
              .attr("y", function (d) {
                return yscale(d.LocationDesc);
              });
            rects
              .data(
                data.filter(function (d) {
                  return parseInt(d.Description) === year - 1;
                })
              )
              .attr("width", function (d) {
                return xscale(parseFloat(d.Data_Value));
              });
            yscale = d3
              .scaleBand()
              .rangeRound([height, 0])
              .padding(0.3)
              .domain(
                data
                  .filter(function (d) {
                    return parseInt(d.Description) == year;
                  })
                  .map(function (d) {
                    return d.LocationDesc;
                  })
              );
            yAxis = d3
              .axisLeft(yscale)
              .tickFormat(function (d) {
                return d;
              })
              .tickSize(0);
            callYAxis
              .transition()
              .ease(d3.easeLinear)
              .duration(1000)
              .call(yAxis);
            callYAxis.select(".domain").remove();
          }
          rects
            .data(
              data.filter(function (d) {
                return parseInt(d.Description) === year;
              })
            )
            .transition()
            .ease(d3.easeLinear)
            .duration(1000)
            .attr("width", function (d) {
              return xscale(parseFloat(d.Data_Value));
            })
            .attr("height", function (d) {
              return yscale.bandwidth();
            })
            .attr("y", function (d) {
              return yscale(d.LocationDesc);
            })
            .attr("x", function (d, i) {
              return xscale(d.Stratification1);
            })
            .attr("fill", function (d) {
              return color(d.LocationDesc);
            });
          year++;
          if (year > maxYear + 1) {
            clearInterval(timer);
          }
          if (year <= maxYear + 1) {
            xText.text(seriesName + "( " + (year - 1) + " )");
          }
        }, 2000);
      });

      var name = seriesName + "_" + seriesValue + "_countries";
      downloads(svg, data, name);
    })
    .catch((error) => {
      console.log(error);
    });
}
