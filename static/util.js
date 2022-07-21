


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

  function resetLines() {
    // console.log("resetlines executing")
    d3.select('#line').selectAll("*").remove()
    d3.select('#selTicker').selectAll("*").remove()
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