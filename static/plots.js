function init() {

  d3.json("http://127.0.0.1:5000/names/unique").then(function (response) {
    // once we get a response, do stuff
    console.log("response below");
    console.log(response);

    // Append an option in the dropdown
    response.forEach(function (name) {
      d3.select('#selDataset')
        .append('option')
        .text(name)
    });
  });
}

// Call updatePlotly() when a change takes place to the DOM
// d3.selectAll("#selDataset").on("change", updatePlotly);

function initChart() {
  d3.json("http://127.0.0.1:5000/tickers/2022-06-29").then(function (response) {
    // once we get a response, do stuff
    console.log("response below");
    console.log(response);




  });


}

function optionChanged() {
  let dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  let tickerName = dropdownMenu.property("value");

  console.log("Selected value is " + tickerName)

  d3.json("http://127.0.0.1:5000/tickers/name/" + tickerName).then(function (response) {
    // once we get a response, do stuff
    console.log("response below");
    console.log(response);

    drawTicker(response)


  })
  

}

function drawTicker(response) {
  let xData = response.map(x => x.Date)
  // console.log("xdata is " + xData);
  let yData = response.map(x => x.Close)
  let label = response[0].Name
  console.log("label is " + label);
  var layout = { title: "<b>Stocks</b>" };
  var config = { responsive: true }

  var trace1 = {
    type: "scatter",
    mode: "lines",
    name: label,
    x: xData,
    y: yData,
    line: { color: '#17BECF' }
  }
  var data = [trace1]
  Plotly.newPlot('line', data, layout, config);


}



init();
