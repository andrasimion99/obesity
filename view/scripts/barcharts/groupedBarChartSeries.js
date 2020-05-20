async function groupedBarChartSeries(seriesName, country, types) {
  fetch(
    "https://api-tw.herokuapp.com/api/" + seriesName + "?country=" + country
  )
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
            if (item.Stratification1 == type) {
              await data.push(item);
            }
          }
        })();
      }

      var maxPercent = d3.max(data, function (d) {
        return parseFloat(d.Data_Value);
      });
      maxPercent += 10;
      var color = d3
        .scaleOrdinal()
        .domain(types)
        .range(["#543864", "#ffbd69", "#ff6363", "#00bcd4", "#084177"]);

      var numBars = 8 + (types.length - 1) * 2;
      var margin = { left: 100, right: 100, top: 10, bottom: 100 };
      var width = 550 - margin.left - margin.right;
      var height = 430 - margin.top - margin.bottom;
      var barPadding = 20;
      if (types.length === 5) {
        barPadding = 16;
      }
      var barWidth = width / numBars - barPadding;

      var bars = d3
        .scaleOrdinal()
        .domain(types)
        .range([0, barWidth, barWidth * 2, barWidth * 3, barWidth * 4]);

      var xscale = d3
        .scaleBand()
        .domain(
          data.map(function (d) {
            return d.Description;
          })
        )
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);
      var yscale = d3.scaleLinear().domain([0, maxPercent]).range([height, 0]);

      var svg = d3
        .select("#chart-area")
        .append("svg")
        .attr("viewBox", `0 0 550 430`)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      var g = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      g.append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 20)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text(country + " - " + seriesName);

      g.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -(height / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Obesity Percentage (%)");

      var xAxis = d3.axisBottom(xscale);
      g.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");

      var yAxis = d3.axisLeft(yscale).tickFormat(function (d) {
        return d + "%";
      });
      g.append("g").attr("class", "y-axis").call(yAxis);

      var sumstat = d3
        .nest()
        .key(function (d) {
          return d.Stratification1;
        })
        .entries(data);

      var labelPoz = 10;
      if (
        seriesName == "education" ||
        seriesName == "income" ||
        seriesName == "ethnicity"
      )
        labelPoz = 30;
      g.selectAll("mydots")
        .data(sumstat)
        .enter()
        .append("circle")
        .attr("cx", width - labelPoz)
        .attr("cy", function (d, i) {
          return margin.top + i * 20;
        })
        .attr("r", 3.5)
        .style("fill", function (d) {
          return color(d.key);
        });
      g.selectAll("mylabels")
        .data(sumstat)
        .enter()
        .append("text")
        .attr("x", width - labelPoz + 5)
        .attr("y", function (d, i) {
          return margin.top + i * 20;
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

      var valueBox = d3
        .select("body")
        .data(
          data.filter(function (d) {
            return parseInt(d.Description);
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

      var rects = g.selectAll("rect").data(
        data.filter(function (d) {
          return parseInt(d.Description);
        })
      );

      var rect = rects
        .enter()
        .append("rect")
        .attr("width", barWidth)
        .attr("height", function (d) {
          if (d.Data_Value === "~") {
            d.Data_Value = 0;
          }
          return height - yscale(parseFloat(d.Data_Value));
        })
        .attr("y", function (d) {
          return yscale(parseFloat(d.Data_Value));
        })
        .attr("x", function (d, i) {
          return xscale(d.Description) + bars(d.Stratification1);
        })
        .attr("fill", function (d) {
          return color(d.Stratification1);
        })
        .attr("class", function (d) {
          return "type" + types.indexOf(d.Stratification1);
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

      var legend = d3
        .select("#chart-area")
        .append("div")
        .style("margin", "0 auto")
        // .style("padding-left", margin.left + "px")
        .append("table")
        .attr("id", "legend")
        .attr("width", width / 2)
        .append("thead");

      legend
        .append("tr")
        .selectAll("th")
        .data(types)
        .enter()
        .append("th")
        .attr("id", function (d, i) {
          return types[i];
        })
        .style("width", function () {
          return 100 / types.length + "%";
        })
        .style("padding", "10px")
        .style("background-color", function (d, i) {
          return color(types[i]);
        })
        .style("cursor", "pointer")
        .on("mouseover", function (d, i) {
          this.style.opacity = 0.7;
          for (let j = 0; j < types.length; j++) {
            if (types[j] != types[i]) {
              d3.selectAll(".type" + j)
                .style("opacity", "0.2")
                .style("fill", "grey");
            }
          }
        })
        .on("mouseout", function (d, i) {
          this.style.opacity = 1;
          for (let j = 0; j < types.length; j++) {
            if (types[j] != types[i]) {
              d3.selectAll(".type" + j)
                .style("opacity", "1")
                .style("fill", color(types[j]));
            }
          }
        });

      legend
        .append("tr")
        .selectAll("th")
        .data(types)
        .enter()
        .append("th")
        .attr("id", function (d, i) {
          return types[i];
        })
        .style("padding", "5px")
        .style("text-align", "center")
        .style("font-size", "10px")
        .text(function (d, i) {
          return types[i];
        });

      var name = country + "_" + seriesName + "_series";
      downloads(svg, data, name);
    })
    .catch((error) => {
      console.log(error);
    });
}
