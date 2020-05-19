function sortByProperty(property) {
  return function (a, b) {
    if (a[property] > b[property]) return 1;
    else if (a[property] < b[property]) return -1;

    return 0;
  };
}
async function createLineChart(seriesName, country, seriesValue) {
  var url = "";
  if (seriesValue) {
    url =
      "http://localhost:3001/api/" +
      seriesName +
      "?country=" +
      country +
      "&" +
      seriesName +
      "=" +
      seriesValue;
  } else {
    url = "http://localhost:3001/api/" + seriesName + "?country=" + country;
    seriesValue = "total";
  }
  fetch(url)
    .then((data) => {
      return data.json();
    })
    .then(async function (res) {
      d3.select("svg").remove();
      d3.select("table").remove();
      data = res.data;
      data.sort(sortByProperty("Description"));
      var maxPercent = d3.max(data, function (d) {
        return parseFloat(d.Data_Value);
      });
      maxPercent += 10;
      var margin = { left: 80, right: 70, top: 10, bottom: 130 };
      var width = 500 - margin.left - margin.right;
      var height = 500 - margin.top - margin.bottom;

      var svg = d3
        .select("#chart-area")
        .append("svg")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("viewBox", `0 0 500 500`)
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

      var bisectLeft = d3.bisector(function (d) {
        return d.Description;
      }).left;

      svg
        .append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text(function () {
          return country + " - " + seriesName + " " + seriesValue;
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

      /*----create line chart---- */

      console.log(data);
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
              return x(parseFloat(d.Description));
            })
            .y(function (d) {
              if (d.Data_Value === "~") {
                d.Data_Value = 0;
              }
              return y(parseFloat(d.Data_Value));
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
        .attr("height", 50)
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

      focus
        .append("text")
        .style("font-size", "14px")
        .style("fill", "white")
        .attr("class", "tooltip-year")
        .attr("x", 18)
        .attr("y", 18);

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

      function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisectLeft(data, x0, 1);
        if (d3.mouse(this)[0] >= width - 20) selectedData = data[7];
        else if (i > 0) {
          (d0 = data[i - 1]), (d1 = data[i]);
          selectedData = x0 - d0.Description > d1.Description - x0 ? d1 : d0;
        } else {
          selectedData = data[0];
        }
        focus.attr(
          "transform",
          "translate(" +
            x(selectedData.Description) +
            "," +
            y(selectedData.Data_Value) +
            ")"
        );
        focus.select(".tooltip-date").text(selectedData.Data_Value + "%");
        focus.select(".tooltip-year").text(selectedData.Description);
      }
      function mouseout() {
        focus.style("display", "none");
      }

      var name = country + "_" + seriesName + "_" + seriesValue;
      downloads(d3.select("svg"), data, name);
    })
    .catch((error) => {
      console.log(error);
    });
}
