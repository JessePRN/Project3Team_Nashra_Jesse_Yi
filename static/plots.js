let tickerNames = []
let tickerData = []
let tickerSectors = []
let tickerDataDict = {}
let stockData = []

function init() {

  // populating the stocks dropdown with unique names from stocks.sqlite
  d3.json("/tickers/names/unique").then(function (response) {
    // console.log("unique ticker names api response below");
    // console.log(response);
    response = response.sort()
    // Append an option in the dropdown
    response.forEach(function (name) {
      d3.select('#selStock')
        .append('option')
        .text(name)
    });
  });

  //populating dropdown with crypto names
  d3.json("/crypto/names/unique").then(function (response) {
    // console.log("unique crypto names api response below");
    // console.log(response);
    response = response.sort()
    // Append an option in the dropdown
    response.forEach(function (name) {
      d3.select('#selCrypto')
        .append('option')
        .text(name)
    });
  });

  //populating dropdown with sectors
  d3.json("/tickers/sector/unique").then(function (response) {
    // console.log("unique sectors api response below");
    // console.log(response);
    response = response.sort()
    // Append an option in the dropdown
    response.forEach(function (name) {
      d3.select('#selSector')
        .append('option')
        .text(name)
    });
  });

  // populate bubble dropdown with unique dates
  d3.json("/dates/unique").then(function (response) {
    // console.log("unique date api response below");
    // console.log(response);
    
    response = response.map(formatDate => new Date(formatDate).getFullYear() + "-" +
    String(new Date(formatDate).getMonth()+1).padStart(2, '0') +
    "-" + String(new Date(formatDate).getDate()).padStart(2, '0'))
    response.sort(function(a,b) {
      a = a.split('-').join('');
      b = b.split('-').join('');
      return a.localeCompare(b);
    });
    response.reverse()
    // Append an option in the dropdown
    response.forEach(function (date) {
      // formatDate = new Date(date)
      // date2 = formatDate.getFullYear() + "-" +
      //   String(formatDate.getMonth()).padStart(2, '0') +
      //   "-" + String(formatDate.getDate()).padStart(2, '0')

      // date2 = date2.sort((b, a) => b - a).reverse()

      d3.select('#selDataset')
        .append('option')
        .text(date)
      // populate treemap dropdown with unique dates
      d3.select('#selDatasetForMap')
        .append('option')
        .text(date)
    });
  });

  // code to populate menus on initial load

  let onLoadSector = "Information Technology"
  let onLoadTicker = "Netflix"
  let onLoadDate = '2020-07-13'
  let onLoadCrypto = 'Aave USD'

  //populate multichart on initial load for appearances
  d3.json("/tickers/sector/" + onLoadSector).then(function (response) {
    drawMultiLines(response)
  })
  //populate linechart on ini
  d3.json("/tickers/name/" + onLoadTicker).then(function (response) {
    drawTickerMultiple(response)
    drawTickerper(response)
    buildTable(response)
  })
  d3.json("/tickers/name/" + onLoadCrypto).then(function (response) {
    drawTickerMultiple(response)
    buildTable2(response)
  })
  //populate bubblechart on init
  d3.json("/tickers/date/jesse/" + onLoadDate).then(function (response) {
    drawBubble(response)
    drawTree(response)
  })

  // let dropdownMenu = d3.select("#selStock");
  // dropdownMenu.property("value") = "Netflix"

}//end init

function stockChangedMultiple() {
  let dropdownMenu = d3.select("#selStock");
  let tickerName = dropdownMenu.property("value");
  console.log("stock ticker selected value is " + tickerName)
  d3.json("/tickers/name/" + tickerName).then(function (response) {
    // console.log("tickerChangedMulti response below");
    // console.log(response);
    addTickerSelected(tickerName)
    drawTickerMultiple(response)
    buildTable(response)
  })
}
// called by crypto dropdown, redesigned to work with new draw functions
function cryptoChangedMultiple() {
  let dropdownMenu = d3.select("#selCrypto");
  let tickerName = dropdownMenu.property("value");
  console.log("crypto ticker selected value is " + tickerName)
  d3.json("/tickers/name/" + tickerName).then(function (response) {
    // console.log("cryptoChangedMulti response below");
    // console.log(response);
    addTickerSelected(tickerName)
    drawTickerMultiple(response)
    buildTable2(response)
  })
}

//called by sector dropdown
function sectorChangedMulti() {
  let dropdownMenu = d3.select("#selSector");
  let sector = dropdownMenu.property("value");
  tickerSectors.push(sector)
  // console.log("Selected value is " + sector)
  sectorParam = String(tickerSectors)
  sectorParam = sectorParam.replaceAll(" ", "%20")

  d3.json("/tickers/sector/multi/" + sectorParam).then(function (response) {
    console.log("sectorParam below")
    console.log(sectorParam)
    console.log("sectorChangedMulti response below");
    console.log(response);
    // todo: handle response with multiple ticker entities
    drawMultiLines(response)
  })
}

//populates date selector for bubble chart
function dateSelect() {
  let dropdownMenu = d3.select("#selDataset");
  let dateUnique = dropdownMenu.property("value");
  console.log("date selected value is " + dateUnique)
  let splitDate = dateUnique.split(' ')
  let slicedDate = splitDate.slice(0, 4)
  let joinDate = slicedDate.join(" ")
  console.log("date selected value is " + joinDate)

  d3.json("/tickers/date/jesse/" + joinDate).then(function (response) {
    console.log("dateUnique response below");
    console.log(response);
    drawBubble(response)
  });
}

//populates date selector for bubble chart
function dateSelectForMap() {
  let dropdownMenu = d3.select("#selDatasetForMap");
  let dateUnique = dropdownMenu.property("value");
  // console.log("date selected value is " + dateUnique)
  let splitDate = dateUnique.split(' ')
  let slicedDate = splitDate.slice(0, 4)
  let joinDate = slicedDate.join(" ")
  // console.log("date selected value is " + joinDate)
  d3.json("/tickers/date/jesse/" + joinDate).then(function (response) {
    // console.log("dateUnique response below");
    // console.log(response);
    drawTree(response)
  });
}

function drawTickerMultiple(response) {
  stockData = []
  tickerData.push(response)
  // console.log("drawTickerMultiple tickerdata below");
  // console.log(tickerData);
  var layout = { title: "Tickers" }
  var config = { responsive: true }
  for (index = 0; index < tickerData.length; index++) {
    let companyStock = tickerData[index]
    // console.log("company stock ticker below");
    // console.log(companyStock);
    // companyStock.sort()

    //sort here right before creating traces to fix date issue with crypto?
    companyStock.sort((a, b) => new Date(a.Date) - new Date(b.Date));

    let xData = companyStock.map(ticker => cleanDate(ticker.Date))
    let yData = companyStock.map(ticker => ticker.Close)
    let label = companyStock[0].Name

    if (companyStock[0].Sector.includes("Crypto")) {

      var trace1 = {
        type: "scatter",
        mode: "line",
        name: label,
        x: xData,
        y: yData,
        line: { color: pickColor() }
      }
    } else {

      var trace1 = {
        type: "scatter",
        mode: "line",
        name: label,
        x: xData,
        y: yData,
        line: { color: pickColor() }
      }
    }
    stockData.push(trace1)
  }//end for
  // console.log("stockdata below")
  // console.log(stockData)
  d3.select('#line').selectAll("*").remove();
  Plotly.newPlot('line', stockData, layout, config);

  // console.log("lineTickers in memory below")
  // console.log(tickerNames)

}
function cleanDate(date) {
  timestamp = new Date(date)
  const currentDayOfMonth = timestamp.getDate();
  const currentMonth = timestamp.getMonth(); // Be careful! January is 0, not 1
  const currentYear = timestamp.getFullYear();
  const dateString = currentYear + "-" + (currentMonth + 1) + "-" + currentDayOfMonth;
  return dateString
}

function pickColor() {
  color(Math.random())
}
function addTickerSelected(ticker) {
  console.log("addTickerSelected being executed on " + ticker)
  d3.select("#selTicker")
  .append("button")
  .html(ticker)
  .on("click", console.log("you clicked me TODO Remove me"))
}

init();

function resetLines() {
  // console.log("resetlines executing")
  d3.select('#line').selectAll("*").remove();
  tickerData = []
}

// build table
function buildTable(response) {
  // build a table that displays the latest ticker value and date
  let demoTable = d3.select('#table');
  //clear table
  demoTable.html('')
  //build table
  let fillTable = demoTable.append("mytable")
  let row = fillTable.append('tr')
  let tableData = row.append('td')
  // populate table
  let Name = tableData.text('For: ' + response[response.length - 1].Name)
  row = fillTable.append('tr')
  tableData = row.append('td')
  let Ticker = tableData.text('Ticker: ' + response[response.length - 1].Ticker)
  row = fillTable.append('tr')
  tableData = row.append('td')
  let Price = tableData.text('Close: ' + response[response.length - 1].Close)
  row = fillTable.append('tr')
  tableData = row.append('td')
  let Date = tableData.text('Date: ' + response[response.length - 1].Date)
  row = fillTable.append('tr')
  tableData = row.append('td')
}

function buildTable2(response) {
  // build a table that displays the latest ticker value and date
  let demoTable = d3.select('#table2');
  //clear table
  demoTable.html('')
  //build table
  let fillTable = demoTable.append("mytable")
  let row = fillTable.append('tr')
  let tableData = row.append('td')
  // populate table
  let Name = tableData.text('For: ' + response[response.length - 1].Name)
  row = fillTable.append('tr')
  tableData = row.append('td')
  let Ticker = tableData.text('Ticker: ' + response[response.length - 1].Ticker)
  row = fillTable.append('tr')
  tableData = row.append('td')
  let Price = tableData.text('Close: ' + response[response.length - 1].Close)
  row = fillTable.append('tr')
  tableData = row.append('td')
  let Date = tableData.text('Date: ' + response[response.length - 1].Date)
  row = fillTable.append('tr')
  tableData = row.append('td')
}

function toAbout() {
  d3.json("/about")
}

function drawBubble(response) {
  let bubbleData = []
  for (var i = 0; i < response.length; i++) {
    var obj = response[i]
    // console.log(obj.Name)
    bubbleData.push({
      "id": obj.Sector + "." + obj.Ticker,
      "value": obj.Close
    })
  }
  // console.log("formatted bubble data below")
  // console.log(bubbleData)
  let chart = BubbleChart(bubbleData, {
    label: d => [...d.id.split(".").pop().split(/(?=[A-Z][a-z])/g), d.value.toLocaleString("en")].join("\n"),
    value: d => d.value,
    group: d => d.id.split(".")[0],
    title: d => `${d.id}\n${d.value.toLocaleString("en")}`,
    // link: d => `https://github.com/prefuse/Flare/blob/master/flare/src/${d.id.replace(/\./g, "/")}.as`,
    width: 1152
  })
  d3.select('#bubble').selectAll("*").remove();
  d3.select('#bubble').node().appendChild(chart);
}

function drawTree(response) {
  let bubbleData = []
  for (var i = 0; i < response.length; i++) {
    var obj = response[i]
    // console.log(obj.Name)
    bubbleData.push({
      "name": obj.Sector + "." + obj.Ticker,
      "size": obj.Close
    })
  }
  // console.log("formatted bubble data below")
  // console.log(bubbleData)
  chart = Treemap(bubbleData, {
    path: d => d.name.replace(/\./g, "/"), // e.g., "flare/animate/Easing"
    value: d => d?.size, // size of each node (file); null for internal nodes (folders)
    group: d => d.name.split(".")[0], // e.g., "animate" in "flare.animate.Easing"; for color
    label: (d, n) => [...d.name.split(".").pop().split(/(?=[A-Z][a-z])/g), n.value.toLocaleString("en")].join("\n"),
    title: (d, n) => `${d.name}\n${n.value.toLocaleString("en")}`, // text to show on hover
    // link: (d, n) => `https://github.com/prefuse/Flare/blob/master/flare/src${n.id}.as`,
    tile: d3.treemapBinary, // e.g., d3.treemapBinary; set by input above
    width: 1152,
    height: 1152
  })
  d3.select('#tree').selectAll("*").remove();
  d3.select('#tree').node().appendChild(chart);
}

function drawMultiLines(response) {
  chart = LineChart(response, {
    x: d => Date.parse(d.Date),
    y: d => d.Close,
    z: d => d.Name,
    yLabel: "Price",
    width: 1200,
    height: 600,
    color: d => d.Sector
  })

  d3.select('#multiline').selectAll("*").remove();
  d3.select('#multiline').node().appendChild(chart);

  //good iterative code
  // response.forEach(element => console.log('test print ' + element.Name));

}
function color(sector) {
  if (sector == "Energy") {
    return "steelblue"
  }
  else return "red"
}
// draw ticker with percent change
function drawTickerper(response) {
  let xData = response.map(ticker => ticker.Date)
  // console.log("ydata is " + yData);
  let yData = response.map(ticker => ticker.ClosePerChange)
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
  Plotly.newPlot('multilineper', data, layout, config);
  // tickerNames.push(response[0].Name)

  // console.log("lineTickers in memory below")
  // console.log(tickerNames)

}
//draw multiline func with close percent change
function drawMultiLinesPer(response) {
  chart = LineChart(response, {
    x: d => Date.parse(d.Date),
    y: d => d.ClosePerChange,
    z: d => d.Name,
    yLabel: "TreeMap",
    width: 2000,
    height: 900
    // color: "steelblue"
  })

  d3.select('#multilineper').selectAll("*").remove();
  d3.select('#multilineper').node().appendChild(chart);

  //good iterative code
  // response.forEach(element => console.log('test print ' + element.Name));

}

