// Define the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch JSON data and perform operations
d3.json(url).then(function(data) {
  const sampleNames = data.names;
  const dropdownMenu = d3.select("#selDataset");

  // Populate dropdown menu with sample names
  sampleNames.forEach(sample => {
    dropdownMenu.append("option").text(sample).property("value", sample);
  });

  // Initialize dashboard with the first sample
  buildCharts(sampleNames[0]);
  buildMetadata(sampleNames[0]);

  // Event listener for dropdown change
  dropdownMenu.on("change", function() {
    const selectedSample = dropdownMenu.property("value");
    buildCharts(selectedSample);
    buildMetadata(selectedSample);
  });
});

// Function to build charts
function buildCharts(selectedSample) {
  d3.json(url).then(function(data) {
    const selectedData = data.samples.find(item => item.id === selectedSample);
    const top10OtuIds = selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    const top10SampleValues = selectedData.sample_values.slice(0, 10).reverse();
    const top10OtuLabels = selectedData.otu_labels.slice(0, 10).reverse();

    // Build bar chart
    const barTrace = {
      x: top10SampleValues,
      y: top10OtuIds,
      text: top10OtuLabels,
      type: "bar",
      orientation: "h"
    };
    const barLayout = { title: "Top 10 OTUs Present" };
    Plotly.newPlot("bar", [barTrace], barLayout);

    // Build bubble chart
    const bubbleTrace = {
      x: selectedData.otu_ids,
      y: selectedData.sample_values,
      text: selectedData.otu_labels,
      mode: "markers",
      marker: {
        size: selectedData.sample_values,
        color: selectedData.otu_ids,
        colorscale: "Earth"
      }
    };
    const bubbleLayout = {
      title: "Bacteria Per Sample",
      hovermode: "closest",
      xaxis: { title: "OTU ID" }
    };
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);
  });
}

// Function to build metadata
function buildMetadata(selectedSample) {
  d3.json(url).then(function(data) {
    const selectedMetadata = data.metadata.find(item => item.id === +selectedSample);
    const metadataLocation = d3.select("#sample-metadata");
    metadataLocation.html("");

    Object.entries(selectedMetadata).forEach(([key, value]) => {
      metadataLocation.append("h6").html(`${key}: <b>${value}</b>`);
    });
  });
}
