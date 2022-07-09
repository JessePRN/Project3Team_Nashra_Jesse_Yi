function init() {

  d3.json("http://127.0.0.1:5000/api/v1.0/uniqueNames").then(function (response) {
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

// This function is called when a dropdown menu item is selected
function updatePlotly() {
  // Use D3 to select the dropdown menu
  

  
}

function optionChanged(){
  let dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  let dataset = dropdownMenu.property("value");

  console.log("Selected value is " + dataset)
}

init();
