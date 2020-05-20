// createLineChartCountries("states", [
//   "Alaska",
//   "California",
//   "Virginia",
//   "Texas",
// ]);
function sortByProperty(property) {
  return function (a, b) {
    if (a[property] > b[property]) return 1;
    else if (a[property] < b[property]) return -1;

    return 0;
  };
}
function sortDescByProperty(property) {
  return function (a, b) {
    if (a[property] > b[property]) return -1;
    else if (a[property] < b[property]) return 1;

    return 0;
  };
}
async function createLineChartCountries(seriesName, types, seriesValue) {
  var url = "";
  if (seriesValue) {
    url =
      "https://api-tw.herokuapp.com/api/" +
      seriesName +
      "?" +
      seriesName +
      "=" +
      seriesValue;
  } else {
    url = "https://api-tw.herokuapp.com/api/" + seriesName;
  }
  fetch(url)
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
      dataForOne = res.data.filter(function (d) {
        return d.LocationDesc === types[0];
      });
      dataForOne.sort(sortByProperty("Description"));
      data.sort(sortByProperty("Description"));

      var maxPercent = d3.max(data, function (d) {
        return parseFloat(d.Data_Value);
      });
      maxPercent += 10;
      var margin = { left: 100, right: 100, top: 10, bottom: 100 };
      var width = 500 - margin.left - margin.right;
      var height = 430 - margin.top - margin.bottom;
      var svg = d3
        .select("#chart-area")
        .append("svg")
        .attr("viewBox", `0 0 500 430`)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var x = d3.scaleTime().domain([2011, 2018]).range([0, width]);

      let xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));

      svg
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", "10")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");
      var y = d3.scaleLinear().domain([0, maxPercent]).range([height, 0]);
      let yAxis = d3.axisLeft(y).tickFormat(function (d) {
        return d + "%";
      });
      svg.append("g").call(yAxis);

      svg
        .append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 30)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text(function () {
          if (seriesName === "states") {
            return "Total";
          } else {
            return seriesName + " " + seriesValue;
          }
        });

      svg
        .append("text")
        .attr("class", "y-axis-label")
        .attr("x", -(height / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Obesity Percentage (%)");

      var sumstat = d3
        .nest()
        .key(function (d) {
          return d.LocationDesc;
        })
        .entries(data);

      var color = d3
        .scaleOrdinal()
        .domain(types)
        .range([
          "#e41a1c",
          "#377eb8",
          "#4daf4a",
          "#984ea3",
          "#ff7f00",
          "#a65628",
          "#f781bf",
          "#999999",
        ]);
      console.log(sumstat);
      console.log(types);
      svg
        .selectAll(".line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", function (d) {
          return color(d.key);
        })
        .attr("stroke-width", 1.5)
        .attr("class", function (d) {
          return "type" + types.indexOf(d.key);
        })
        .attr("d", function (d) {
          return d3
            .line()
            .x(function (d) {
              return x(parseFloat(d.Description));
            })
            .y(function (d) {
              if (d.Data_Value === "~") {
                d.Data_Value = 0;
              }
              return y(parseFloat(d.Data_Value));
            })(d.values);
        });

      dotsPoz = 20;
      svg
        .selectAll("mydots")
        .data(sumstat)
        .enter()
        .append("circle")
        .attr("cx", width - dotsPoz)
        .attr("cy", function (d, i) {
          return i * 15;
        })
        .attr("r", 3.5)
        .style("fill", function (d) {
          return color(d.key);
        });
      svg
        .selectAll("mylabels")
        .data(sumstat)
        .enter()
        .append("text")
        .attr("x", width - dotsPoz + 5)
        .attr("y", function (d, i) {
          return i * 15;
        })
        .style("fill", function (d) {
          return color(d.key);
        })
        .text(function (d) {
          return d.key;
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "12px");

      var legend = d3
        .select("#chart-area")
        .append("div")
        .style("margin", "0 auto")
        .append("table")
        .attr("id", "legend")
        .attr("width", width / 2)
        .append("thead");
      legend
        .append("tr")
        .selectAll("th")
        .data(sumstat)
        .enter()
        .append("th")
        .style("width", function () {
          return 100 / types.length + "%";
        })
        .style("padding", "10px")
        .style("background-color", function (d, i) {
          return color(d.key);
        })
        .style("cursor", "pointer")
        .on("mouseover", function (d, i) {
          this.style.opacity = 0.7;
          for (let j = 0; j < sumstat.length; j++) {
            if (types[j] != types[i]) {
              console.log("d:" + d.key);
              d3.selectAll(".type" + types.indexOf(sumstat[j].key))
                .style("opacity", "0.2")
                .attr("stroke", "#7a7a7a");
            }
          }
        })
        .on("mouseout", function (d, i) {
          this.style.opacity = 1;
          for (let j = 0; j < sumstat.length; j++) {
            if (types[j] != types[i]) {
              d3.selectAll(".type" + types.indexOf(sumstat[j].key))
                .style("opacity", "1")
                .attr("stroke", function (d) {
                  return color(d.key);
                });
            }
          }
        });
      legend
        .append("tr")
        .selectAll("th")
        .data(sumstat)
        .enter()
        .append("th")
        .attr("id", function (d, i) {
          return types[i];
        })
        .style("padding", "5px")
        .style("text-align", "center")
        .style("font-size", "10px")
        .text(function (d, i) {
          return sumstat[i].key;
        });
      var tooltip = d3
        .select("body")
        .append("div")
        .style("position", "absolute")
        .style("font-size", "14px")
        .style("background-color", "white")
        .style("border", "1px solid #cfcfcf")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("z-index", "10");
      var tooltipLine = svg.append("line");

      tipBox = svg
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("opacity", 0)
        .on("mouseout", removeTooltip)
        .on("mousemove", drawTooltip);

      function removeTooltip() {
        if (tooltipLine) tooltipLine.attr("stroke", "none");
        if (tooltip) tooltip.style("display", "none");
      }
      var bisectLeft = d3.bisector(function (d) {
        return d.Description;
      }).left;
      function drawTooltip() {
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisectLeft(dataForOne, x0);
        if (d3.mouse(this)[0] > width - 10) i = 7;
        tooltipLine
          .attr("stroke", "#636363")
          .attr("stroke-width", 0.5)
          .attr("x1", x(dataForOne[i].Description))
          .attr("x2", x(dataForOne[i].Description))
          .attr("y1", 0)
          .attr("y2", height);
        var result = data
          .filter(function (d) {
            return d.Description === dataForOne[i].Description;
          })
          .sort(sortDescByProperty("Data_Value"));
        tooltip
          .html(dataForOne[i].Description)
          .style("top", d3.event.pageY - 30 + "px")
          .style("left", d3.event.pageX + 10 + "px")
          .style("display", "block");
        tooltip
          .selectAll()
          .data(result)
          .enter()
          .append("div")
          .style("color", (d) => {
            return color(d.LocationDesc);
          })
          .html((d) => d.LocationDesc + ": " + d.Data_Value + "%");
      }

      var name = seriesName + "_" + seriesValue + "_countries";
      downloads(d3.select("svg"), data, name);
    })
    .catch((error) => {
      console.log(error);
    });
}
