function init() {

  // populating the stocks dropdown with unique names from stocks.sqlite
  d3.json("http://127.0.0.1:5000/tickers/names/unique").then(function (response) {
    console.log("unique ticker names api response below");
    console.log(response);
    response = response.sort()
    // Append an option in the dropdown
    response.forEach(function (name) {
      d3.select('#selStock')
        .append('option')
        .text(name)
    });
  });

  //populating dropdown with crypto names
  d3.json("http://127.0.0.1:5000/crypto/names/unique").then(function (response) {
    console.log("unique crypto names api response below");
    console.log(response);
    response = response.sort()
    // Append an option in the dropdown
    response.forEach(function (name) {
      d3.select('#selCrypto')
        .append('option')
        .text(name)
    });
  });

  //populating dropdown with sectors
  d3.json("http://127.0.0.1:5000/tickers/sector/unique").then(function (response) {
    console.log("unique sectors api response below");
    console.log(response);
    response = response.sort()
    // Append an option in the dropdown
    response.forEach(function (name) {
      d3.select('#selSector')
        .append('option')
        .text(name)
    });
  });
}

// called by stock ticker dropdown
function stockChanged() {
  let dropdownMenu = d3.select("#selStock");
  let tickerName = dropdownMenu.property("value");
  console.log("stock ticker selected value is " + tickerName)
  d3.json("http://127.0.0.1:5000/tickers/name/" + tickerName).then(function (response) {
    // once we get a response, do stuff
    console.log("tickerChanged response below");
    console.log(response);
    drawTicker(response)
  })
}

// called by crypto dropdown
function cryptoChanged(){
  let dropdownMenu = d3.select("#selCrypto");
  let tickerName = dropdownMenu.property("value");
  console.log("crypto selected value is " + tickerName)
  d3.json("http://127.0.0.1:5000/tickers/name/" + tickerName).then(function (response) {
    console.log("cryptoChanged response below");
    console.log(response);
    drawTicker(response)
  })
}

//called by sector dropdown
function sectorChanged(){
  let dropdownMenu = d3.select("#selSector");
  let sector = dropdownMenu.property("value");
  console.log("Selected value is " + sector)
  d3.json("http://127.0.0.1:5000/tickers/sector/" + sector).then(function (response) {
    console.log("sectorChanged response below");
    console.log(response);
    // todo: handle response with multiple ticker entities
    drawMultiTicker(response)
  })
}

//takes in single entity's data response and charts it
function drawTicker(response) {
  let xData = response.map(ticker => ticker.Date)
  // console.log("xdata is " + xData);
  let yData = response.map(ticker => ticker.Close)
  let label = response[0].Name
  // console.log("label is " + label);
  var layout = { title: label };
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

function drawMultiTicker(response){
  response.sort()
  prettyJson = {}
  // let xarray = response.map(ticker => ticker.Date)
  // for (ticker in response){
  //   console.log(ticker.Date)
  // }
  let testDate = response[1].Date
  console.log("testDate is")
  console.log(testDate)
  // console.log("xarray below")
  // console.log(xarray)

}

init();
