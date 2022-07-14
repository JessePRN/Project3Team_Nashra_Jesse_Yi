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

  // populate dropdown with unique dates
d3.json("http://127.0.0.1:5000/dates/unique").then(function (response) {
  console.log("unique date api response below");
  console.log(response);
  response = response.sort((b,a) => b-a).reverse()
  // Append an option in the dropdown
  response.forEach(function (date) {
    d3.select('#selDataset')
      .append('option')
      .text(date)
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
    buildTable(response)
  })
}

// called by crypto dropdown
function cryptoChanged() {
  let dropdownMenu = d3.select("#selCrypto");
  let tickerName = dropdownMenu.property("value");
  console.log("crypto selected value is " + tickerName)
  d3.json("http://127.0.0.1:5000/tickers/name/" + tickerName).then(function (response) {
    console.log("cryptoChanged response below");
    console.log(response);
    drawTicker(response)
    buildTable(response)
  })
}

//called by sector dropdown
function sectorChanged() {
  let dropdownMenu = d3.select("#selSector");
  let sector = dropdownMenu.property("value");
  console.log("Selected value is " + sector)
  d3.json("http://127.0.0.1:5000/tickers/sector/" + sector).then(function (response) {
    console.log("sectorChanged response below");
    console.log(response);
    // todo: handle response with multiple ticker entities
    drawMultiLines(response)
  })
}

//takes in single entity's data response and charts it
function drawTicker(response) {
  let xData = response.map(ticker => ticker.Date)
  // console.log("xdata is " + xData);
  let yData = response.map(ticker => ticker.Close)
  let label = response[0].Name
  // console.log("label is " + label);
  var layout = { title: "<b>TICKERS ZOMGBBQ</b>" };
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

// build table
function buildTable(response){
  // build a table that displays the latest ticker value and date
    let demoTable = d3.select('#table');
  
  //clear table before new data is appended
    demoTable.html('')
    
    // console.log("table is clear")
  
   //build table
    let fillTable = demoTable.append("mytable")
    let row = fillTable.append('tr')
    let tableData = row.append('td')
  
  //  console.log("table is built")
  
  // populate table
  
    let Name = tableData.text('For: '+ response[response.length-1].Name)
    row = fillTable.append('tr')
    tableData = row.append('td')
    let Ticker = tableData.text('Ticker: '+ response[response.length-1].Ticker)
    row = fillTable.append('tr')
    tableData = row.append('td')
    let Price = tableData.text('Date: '+ response[response.length-1].Close)
    row = fillTable.append('tr')
    tableData = row.append('td')
    let Date = tableData.text('Date: '+ response[response.length-1].Date)
    row = fillTable.append('tr')
    tableData = row.append('td')
    
    // console.log("table is being filled")
  }


function dateSelect(){
  let dropdownMenu = d3.select("#selDataset");
  let dateUnique = dropdownMenu.property("value");
  console.log("date selected value is " + dateUnique)
  let splitDate = dateUnique.split(' ')
  let slicedDate = splitDate.slice(0,4)
  let joinDate =slicedDate.join(" ")

  d3.json("http://127.0.0.1:5000/tickers/date/" + joinDate).then(function (response) {
      console.log("dateUnique response below");
      console.log(response);
      drawBubble(response)
});
}
 
function drawBubble(response) {
 
  // let date = "1-28-2021"

  let dropdownMenu = d3.select("#selDataset");
  let date = dropdownMenu.property("value");
  let splitDate = date.split(' ')
  let slicedDate = splitDate.slice(0,4)
  let joinDate =slicedDate.join(" ")
  console.log(joinDate)
  // console.log("seth's stuff")

  d3.json("http://127.0.0.1:5000/tickers/date/"+ joinDate).then(function (response) {
    // once we get a response, do stuff
    // console.log("drawbubble request below");
    // console.log(response);
    let jsonSlice = response.slice(0, 10)
    console.log("slice")
    console.log(jsonSlice)

    let bubbleData = []
    for (var i = 0; i < response.length; i++) {
      var obj = response[i]
      console.log(obj.Name)
      // for (var key in obj) {
      //   console.log(key + "=" + obj[key]);
      // }

      bubbleData.push({
        "id": obj.Sector + "." + obj.Ticker,
        "value": obj.Close
      })
    }
    console.log(bubbleData)

    let chart = BubbleChart(bubbleData, {
      label: d => [...d.id.split(".").pop().split(/(?=[A-Z][a-z])/g), d.value.toLocaleString("en")].join("\n"),
      value: d => d.value,
      group: d => d.id.split(".")[1],
      title: d => `${d.id}\n${d.value.toLocaleString("en")}`,
      link: d => `https://github.com/prefuse/Flare/blob/master/flare/src/${d.id.replace(/\./g, "/")}.as`,
      width: 1152
    })

    d3.select('#bubble').selectAll("*").remove();
    d3.select('#bubble').node().appendChild(chart);

  })


}
function testCode(){
  console.log(sampleTickers)
}


function drawMultiLines(response) {

  // let jsonSlice = sampleTickers.slice(0, 10)
  // console.log(jsonSlice)

  chart = LineChart(response, {
    x: d => Date.parse(d.Date),
    y: d => d.Close,
    z: d => d.Name,
    yLabel: "↑ Unemployment (%)",
    width: 2000,
    height: 900,
    color: "steelblue"
  })

  d3.select('#multiline').selectAll("*").remove();
  d3.select('#multiline').node().appendChild(chart);

  //good iterative code
  // response.forEach(element => console.log('test print ' + element.Name));

}

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/multi-line-chart
function LineChart(data, {
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  z = () => 1, // given d in data, returns the (categorical) z-value
  title, // given d in data, returns the title text
  defined, // for gaps in data
  curve = d3.curveLinear, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  xType = d3.scaleUtc, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  zDomain, // array of z-values
  color = "currentColor", // stroke color of line, as a constant or a function of *z*
  strokeLinecap, // stroke line cap of line
  strokeLinejoin, // stroke line join of line
  strokeWidth = 1.5, // stroke width of line
  strokeOpacity, // stroke opacity of line
  mixBlendMode = "multiply", // blend mode of lines
  voronoi // show a Voronoi overlay? (for debugging)
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);
  const O = d3.map(data, d => d);
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = d3.map(data, defined);

  // Compute default domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = [0, d3.max(Y, d => typeof d === "string" ? +d : d)];
  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat);

  // Compute titles.
  const T = title === undefined ? Z : title === null ? null : d3.map(data, title);

  // Construct a line generator.
  const line = d3.line()
    .defined(i => D[i])
    .curve(curve)
    .x(i => xScale(X[i]))
    .y(i => yScale(Y[i]));

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .style("-webkit-tap-highlight-color", "transparent")
    .on("pointerenter", pointerentered)
    .on("pointermove", pointermoved)
    .on("pointerleave", pointerleft)
    .on("touchstart", event => event.preventDefault());

  // An optional Voronoi display (for fun).
  if (voronoi) svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("d", d3.Delaunay
      .from(I, i => xScale(X[i]), i => yScale(Y[i]))
      .voronoi([0, 0, width, height])
      .render());

  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis);

  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis)
    .call(g => g.select(".domain").remove())
    .call(voronoi ? () => { } : g => g.selectAll(".tick line").clone()
      .attr("x2", width - marginLeft - marginRight)
      .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
      .attr("x", -marginLeft)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text(yLabel));

  const path = svg.append("g")
    .attr("fill", "none")
    .attr("stroke", typeof color === "string" ? color : null)
    .attr("stroke-linecap", strokeLinecap)
    .attr("stroke-linejoin", strokeLinejoin)
    .attr("stroke-width", strokeWidth)
    .attr("stroke-opacity", strokeOpacity)
    .selectAll("path")
    .data(d3.group(I, i => Z[i]))
    .join("path")
    .style("mix-blend-mode", mixBlendMode)
    .attr("stroke", typeof color === "function" ? ([z]) => color(z) : null)
    .attr("d", ([, I]) => line(I));

  const dot = svg.append("g")
    .attr("display", "none");

  dot.append("circle")
    .attr("r", 2.5);

  dot.append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "middle")
    .attr("y", -8);

  function pointermoved(event) {
    const [xm, ym] = d3.pointer(event);
    const i = d3.least(I, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)); // closest point
    path.style("stroke", ([z]) => Z[i] === z ? null : "#ddd").filter(([z]) => Z[i] === z).raise();
    dot.attr("transform", `translate(${xScale(X[i])},${yScale(Y[i])})`);
    if (T) dot.select("text").text(T[i]);
    svg.property("value", O[i]).dispatch("input", { bubbles: true });
  }

  function pointerentered() {
    path.style("mix-blend-mode", null).style("stroke", "#ddd");
    dot.attr("display", null);
  }

  function pointerleft() {
    path.style("mix-blend-mode", mixBlendMode).style("stroke", null);
    dot.attr("display", "none");
    svg.node().value = null;
    svg.dispatch("input", { bubbles: true });
  }

  return Object.assign(svg.node(), { value: null });
}

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/bubble-chart
function BubbleChart(data, {
  name = ([x]) => x, // alias for label
  label = name, // given d in data, returns text to display on the bubble
  value = ([, y]) => y, // given d in data, returns a quantitative size
  group, // given d in data, returns a categorical value for color
  title, // given d in data, returns text to show on hover
  link, // given a node d, its link (if any)
  linkTarget = "_blank", // the target attribute for links, if any
  width = 640, // outer width, in pixels
  height = width, // outer height, in pixels
  padding = 3, // padding between circles
  margin = 1, // default margins
  marginTop = margin, // top margin, in pixels
  marginRight = margin, // right margin, in pixels
  marginBottom = margin, // bottom margin, in pixels
  marginLeft = margin, // left margin, in pixels
  groups, // array of group names (the domain of the color scale)
  colors = d3.schemeTableau10, // an array of colors (for groups)
  fill = "#ccc", // a static fill color, if no group channel is specified
  fillOpacity = 0.7, // the fill opacity of the bubbles
  stroke, // a static stroke around the bubbles
  strokeWidth, // the stroke width around the bubbles, if any
  strokeOpacity, // the stroke opacity around the bubbles, if any
} = {}) {
  // Compute the values.
  const D = d3.map(data, d => d);
  const V = d3.map(data, value);
  const G = group == null ? null : d3.map(data, group);
  const I = d3.range(V.length).filter(i => V[i] > 0);

  // Unique the groups.
  if (G && groups === undefined) groups = I.map(i => G[i]);
  groups = G && new d3.InternSet(groups);

  // Construct scales.
  const color = G && d3.scaleOrdinal(groups, colors);

  // Compute labels and titles.
  const L = label == null ? null : d3.map(data, label);
  const T = title === undefined ? L : title == null ? null : d3.map(data, title);

  // Compute layout: create a 1-deep hierarchy, and pack it.
  const root = d3.pack()
    .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
    .padding(padding)
    (d3.hierarchy({ children: I })
      .sum(i => V[i]));

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-marginLeft, -marginTop, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .attr("fill", "currentColor")
    .attr("font-size", 10)
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle");

  const leaf = svg.selectAll("a")
    .data(root.leaves())
    .join("a")
    .attr("xlink:href", link == null ? null : (d, i) => link(D[d.data], i, data))
    .attr("target", link == null ? null : linkTarget)
    .attr("transform", d => `translate(${d.x},${d.y})`);

  leaf.append("circle")
    .attr("stroke", stroke)
    .attr("stroke-width", strokeWidth)
    .attr("stroke-opacity", strokeOpacity)
    .attr("fill", G ? d => color(G[d.data]) : fill == null ? "none" : fill)
    .attr("fill-opacity", fillOpacity)
    .attr("r", d => d.r);

  if (T) leaf.append("title")
    .text(d => T[d.data]);

  if (L) {
    // A unique identifier for clip paths (to avoid conflicts).
    const uid = `O-${Math.random().toString(16).slice(2)}`;

    leaf.append("clipPath")
      .attr("id", d => `${uid}-clip-${d.data}`)
      .append("circle")
      .attr("r", d => d.r);

    leaf.append("text")
      .attr("clip-path", d => `url(${new URL(`#${uid}-clip-${d.data}`, location)})`)
      .selectAll("tspan")
      .data(d => `${L[d.data]}`.split(/\n/g))
      .join("tspan")
      .attr("x", 0)
      .attr("y", (d, i, D) => `${i - D.length / 2 + 0.85}em`)
      .attr("fill-opacity", (d, i, D) => i === D.length - 1 ? 0.7 : null)
      .text(d => d);
  }

  return Object.assign(svg.node(), { scales: { color } });
}

