async function createLineChart(seriesName, country, seriesValue) {
  url =
    "http://localhost:3001/api/" +
    seriesName +
    "?country=" +
    country +
    "&" +
    seriesName +
    "=" +
    seriesValue;
  /*url = "http://localhost:3001/api/age?country=Alaska&age=18%20-%2024";*/
  fetch(url)
    .then((data) => {
      return data.json();
    })
    .then(async function (res) {
      data = res.data;
      var maxPercent = d3.max(data, function (d) {
        return parseFloat(d.Data_Value);
      });
      years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];
      maxPercent += 10;
      var margin = { left: 100, right: 100, top: 10, bottom: 180 };
      var width = 500 - margin.left - margin.right;
      var height = 450 - margin.top - margin.bottom;

      var svg = d3
        .select("#chart-area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var parse = (d) => {
        return parseInt(d);
      };

      var x = d3
        .scaleTime()
        .domain(
          d3.extent(data, function (d) {
            console.log(parse(d.Description));
            return parse(d.Description);
          })
        )
        .range([0, width]);

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
      svg.append("g").call(d3.axisLeft(y));

      var bisectLeft = d3.bisector(function (d) {
        return d.Description;
      }).left;

      var focus = svg
        .append("g")
        .append("circle")
        .style("fill", "none")
        .attr("stroke", "steelblue")
        .attr("r", 5)
        .style("opacity", 0)
        .style("fill", function (d) {
          return "steelblue";
        });

      var focusText = svg
        .append("g")
        .append("text")
        .style("opacity", 0)
        .attr("text-anchor", "left")
        .attr("alignment-baseline", "middle");

      svg
        .append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 100)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text(function () {
          return "Arizona";
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

      svg
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

      // Create a rect on top of the svg area: this rectangle recovers mouse position
      svg
        .append("rect")
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);

      // What happens when the mouse move -> show the annotations at the right positions.
      function mouseover() {
        focus.style("opacity", 1);
        focusText.style("opacity", 1);
      }

      function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]);
        var i = bisectLeft(data, x0);
        selectedData = data[i];
        focus
          .attr("cx", x(selectedData.Description))
          .attr("cy", y(selectedData.Data_Value));
        focusText
          .html(
            "x:" +
              selectedData.Description +
              "  -  " +
              "y:" +
              selectedData.Data_Value
          )
          .attr("x", x(selectedData.Description) + 15)
          .attr("y", y(selectedData.Data_Value));
      }
      function mouseout() {
        focus.style("opacity", 0);
        focusText.style("opacity", 0);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
/*createLineChart();*/
export default createLineChart;
