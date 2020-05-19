async function downloads(svg, csvData, name) {
  // ----------download as SVG---------------
  d3.select("#downloadSvg").on("click", function () {
    this.href = "data:image/svg+xml;base64," + btoa(svg.node().outerHTML);
    this.download = name + ".svg";
  });

  // ----------download as WEBP---------------
  var canvasImg = d3.select("#canvasImage").node();
  var canvas = d3.select("canvas").node();
  canvasImg.src = "data:image/svg+xml;base64," + btoa(svg.node().outerHTML);

  canvasImg.onload = function () {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    canvas.getContext("2d").drawImage(canvasImg, 0, 0);
  };
  d3.select("#downloadWebP").on("click", function () {
    this.href = canvas.toDataURL("image/webp");
    this.download = name + ".webp";
  });

  // ----------download as CSV---------------
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
  d3.select("#downloadCsv").on("click", function () {
    this.href = "data:text/csv;charset=utf-8," + encodeURI(csvContent);
    this.download = name + ".csv";
  });
}
