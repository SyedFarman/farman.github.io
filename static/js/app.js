const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

function init(){
    var selector = d3.select("#selDataset");

    d3.json('samples.json').then((data)=> {
        var sampleNames = data.names;
        sampleNames.forEach((samples) => {
            selector
            .append("option")
            .text(samples)
            .property("value",samples);
        });

        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);

    });
}

// Initialize the dashboard

init();

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);

}

// Demographics
function buildMetadata(samples) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      
      var resultArray = metadata.filter(sampleObj => sampleObj.id == samples);
      var result = resultArray[0];
      
      var PANEL = d3.select("#sample-metadata");
  
      
      PANEL.html("");
  
      
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }

  // Create the Chart
function buildCharts(sample) {
    // Use d3.json to load the samples.json file 
    d3.json("samples.json").then((data) => {
      console.log(data);
  
      // Create a variable that holds the samples array. 
      var samples=data.samples;
  
      // Create a variable that filters the samples 
      var sampleArray=samples.filter(obj=>obj.id==sample);
  
     
      var metadata=data.metadata;
      var metadataFilter=metadata.filter(sampleobj=>sampleobj.id==sample);
  
     
      var results=sampleArray[0];
    
  
      // Create a variable that holds the first sample in the metadata array.
      var metaresult=metadataFilter[0];
      
  
      // Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otuIDs=results.otu_ids;
      var otuLabels=results.otu_labels;
      var sampleValues=results.sample_values;
  
      // 3. Create a variable that holds the washing frequency.
      var wash_freq=parseInt(metaresult.wfreq);
     
      // Create the yticks for the bar chart.
  
      var yticks = otuIDs.slice(0,10).reverse().map(function (name) {return `OTU ${name}`})
      var xticks=sampleValues.slice(0,10).reverse();
      var labels=otuLabels.slice(0,10).reverse();
  
      //Create the trace for the barchart
  
      var barData = [{
        x: xticks,
        y: yticks,
        type:'bar',
        orientation:'h',
        text:labels,
        marker:{
        color: 'inherit'
        }
  
      }
        
      ];
  
      //Create the layout for the bar chart
  
      var barLayout = {
        title:"Top 10 Bacteria Cultures Found"
       
      };
  
      // Use Plotly to plot the bar
      Plotly.newPlot("bar",barData,barLayout);
      
      // Use Plotly to plot the bubble data
      var bubbleData = [{
        x: otuIDs,
        y: sampleValues ,
        text: otuLabels,
        hoverinfo:'text',
        mode: 'markers',
        marker:{
          size: sampleValues,
          color: otuIDs,
          colorscale:"Earth"
  
        }
      }
     
      ];
  
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"},
        showlegend:false
        
      };
  
      Plotly.newPlot("bubble",bubbleData,bubbleLayout); 
  
  
      // 4. Create the trace for the gauge chart.
      var gaugeData = [ {
        domain: { x: [0, 1], y: [0, 1] },
        value: wash_freq,
        title: {text: "Belly Button Washing Frequency <br> Scrubs per Week", font: {size: 18}},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 9]},
          bar: { color: "brown" },
          steps: [
            { range: [0, 1], color: 'rgb(248, 243, 236)' },
            { range: [1, 2], color: 'rgb(244, 241, 229)' },
            { range: [2, 3], color: 'rgb(233, 230, 202)' },
            { range: [3, 4], color: 'rgb(229, 231, 179)' },
            { range: [4, 5], color: 'rgb(213, 228, 157)' },
            { range: [5, 6], color: 'rgb(183, 204, 146)' },
            { range: [6, 7], color: 'rgb(140, 191, 136)' },
            { range: [7, 8], color: 'rgb(138, 187, 143)' },
            { range: [8, 9], color: 'rgb(133, 180, 138)' },
            
          ],
        }  
      }
       
      ];
      
      // determine angle for each wfreqData segment on the chart
      var angle = (wash_freq / 9) * 180;
      // calculate end points for triangle pointer path
      var degrees = 180 - angle,
        radius = .8;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
  
      // Path: to create needle shape (triangle). 
      //Initial coordinates of two of the triangle corners plus the third calculated end tip that points to the appropriate segment on the gauge 
     
      var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        cX = String(x),
        cY = String(y),
        pathEnd = ' Z';
        
      var path = mainPath + cX + " " + cY + pathEnd;
      

      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        width: 600, 
        height: 450, 
        margin: { t: 0, b: 0 }
       
      };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    
    });
  };