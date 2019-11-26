function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  var url = `/metadata/${sample}`;
  console.log("url: ", url)

  d3.json(url).then(function (response) {

    var data = response;
    console.log("response: ", response)

    // Use `.html("") to clear any existing metadata
    var metaTable = d3.select("tbody");
    console.log("metaTable: ", metaTable)
    metaTable.html("");


    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    var row = metaTable.append("tr");
    Object.entries(response).forEach(([key, value]) => {
      var row = metaTable.append("tr");
      var keyHead = row.append("td");
      var colon = row.append("td");
      var cell = row.append("td");
      keyHead.text(key)
      colon.text(":")
      cell.text(value);
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    d3.json(url).then(function (response) {

      var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: response.WFREQ,
          // title: { text: title = '<b>Belly Button Washing Frequency</b> <br><i>Scrubs per Week</i>' },

          title: {font: {size: 15}, text: title = '<b>Belly Button Washing Frequency</b> <br><i>Scrubs per Week</i>' }, margin: {l: 10, r:10},
          type: "indicator",
          mode: "gauge+number",

          gauge: {
            shape: "angular",
            bar: { color: 'rgb(112, 0,1)' },
            axis: { range: [null, 9], dtick: 1 },
            steps: [
              { range: [0, 1], color: 'rgb(246,240,231)' },
              { range: [1, 2], color: 'rgb(241,238,222)' },
              { range: [2, 3], color: 'rgb(228,226,189)' },
              { range: [3, 4], color: 'rgb(223,228,161)' },
              { range: [4, 5], color: 'rgb(178,196,119)' },
              { range: [5, 6], color: 'rgb(151,175,112)' },
              { range: [6, 7], color: 'rgb(122,182,115)' },
              { range: [7, 8], color: 'rgb(119,176,123)' },
              { range: [8, 9], color: 'rgb(114,168,118)' }
            ]
          }
        }
      ];

      var layout = {
        // width: 800,
        // height: 500,
        margin: { t: 10, b: 0, l: 15, r: 15 },
      };
      Plotly.newPlot("gauge", data, layout, { responsive: true });
    });

  });
};




function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  console.log("url: ", url)
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(url).then(function (response) {

    console.log("response: ", response);

    var y = response.sample_values;
    var x = response.otu_ids;
    var markerSize = response.sample_values;
    var markerColors = response.otu_ids;
    var textValues = response.otu_labels;

    console.log(x)
    console.log(y)

    var trace1 = {
      x: x,
      y: y,
      mode: 'markers',
      marker: {
        size: markerSize,
        color: markerColors
      },
      text: textValues
    };

    var data = [trace1];

    var layout = {
      xaxis: { title: '<b>OTU ID</b>' },
      showlegend: false,
      // height: 600,
      // width: 600
      margin: { t: 0, b: 30, l: 30, r: 30 }
    };

    Plotly.newPlot('bubble', data, layout, { responsive: true });

  });
  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
  d3.json(url).then(function (response) {

    console.log("response: ", response);

    var values = response.sample_values.slice(0, 10);
    var labels = response.otu_ids.slice(0, 10);
    var hoverText = response.otu_labels.slice(0, 10);

    var trace1 = [{
      values: values,
      labels: labels,
      hovertext: hoverText,
      type: 'pie'
    }];

    var layout = {
      // height: 500,
      // width: 500
      margin: { t: 0, b: 0, l: 0, r: 0 }
    };

    Plotly.newPlot('pie', trace1, layout, { responsive: true });

  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
