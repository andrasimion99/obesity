async function addCountries() {
  await fetch("http://localhost:3001/api/states?year=2018")
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      var data = res.data;
      var countryArr = [];
      for (var i = 0; i < data.length; i++) {
        countryArr.push(data[i].LocationDesc);
      }
      var countries = d3
        .select("#dropdown-countries")
        .selectAll("div")
        .data(countryArr)
        .enter()
        .append("div")
        .attr("class", "checkbox");
      countries
        .append("input")
        .attr("class", "Country")
        .attr("type", "checkbox")
        .attr("name", "Country")
        .attr("value", function (d, i) {
          return countryArr[i];
        });

      countries
        .append("label")
        .attr("for", "country")
        .text(function (d, i) {
          return countryArr[i];
        });
    })
    .catch((error) => {
      console.log(error);
    });
}