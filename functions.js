
// featureSelected variable 
var featureSelected = ""
/* 
This variable represents the data coming formt he json file.
 I made it a mutable global variable so i can set it to data on d3.json()
 and then use it again in the feature selection function without having to pass 
 other values as we call that function. 
*/
var Data = []

var featuresParent = []
var featuresChildren = []
var positionsParent = []
var positionsChildren = []
var use_new_grouping = false
var exon_length;
var widthRatio
let selectedBar = null;
let selectedFeatureBar = null;

/**
 * PSI view function
 * currently working with the reisizing, I will probaly have to figure it out how to have a better ratio and 
 * also adjust the ratio of the words and the other 
 */
function PSIview(data) {
  // detal_force and predicted_psi values are coming from the actual json file. 
  const deltaForce = data.delta_force;
  const predictedPSI = data.predicted_psi;
  const plotPSI = true;
  exon_length = data.exon.length;
  flanking_length = data.sequence.search(data.exon);

  d3.select("svg.psi-view").selectAll("*").remove();;
  const svgContainer = d3.select(".psi-view"); // Ensure you have a container with this class
  const width = 300;
  const height = 400;
  const heightRatio = height / 370;
  widthRatio = width / 193;


  const svg = d3.select("svg.psi-view")
    .attr("width", width)
    .attr("height", height);
  const margin = { top: 40, right: 50, bottom: 30, left: 50 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const lowerBound = -120;
  const upperBound = 120;

  var yScale = d3.scaleLinear().domain([lowerBound, upperBound]).range([chartHeight, 0]);
  var yAxis = d3.axisLeft(yScale).ticks(5);

  if (plotPSI) {
    const deltaForce = [-100, -20, -10, -5, 0, 5, 10, 20, 100];
    const correspondingPSI = [0.000006, 0.071174, 0.232515, 0.361840, 0.5, 0.638148, 0.756705, 0.892360, 0.987334];

    yScale = d3.scaleLinear().domain([0, 1]).range([chartHeight, 0]);
    yAxis = d3.axisLeft(yScale).tickValues(correspondingPSI)
      .tickFormat(function (d, i) { return deltaForce[i]; });
  }

  // Conversion from predicted psi to delta force
  const predictePSIConversion = [0.000001, 0.000006, 0.000038, 0.000243, 0.004538, 0.071174, 0.499993, 0.892360, 0.971595, 0.982911, 0.985533, 0.987334, 0.988231];
  var yScale2 = d3.scaleLinear().domain([-0.1, 1.1]).range([chartHeight, 0]);
  var yAxis2 = d3.axisRight(yScale2).ticks(13)
    .tickFormat(function (d, i) {
      if (predictePSIConversion[i] < 0.1) { return d3.format(".0e")(predictePSIConversion[i]); }
      else { return d3.format(".3")(predictePSIConversion[i]); }
    });
  if (plotPSI) {
    yScale2 = d3.scaleLinear().domain([0, 1]).range([chartHeight, 0]);
    yAxis2 = d3.axisRight(yScale2).ticks(6);
  }

  svg.attr('width', width).attr('height', height);


  const chartGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

  chartGroup.append('g')
    .attr('transform', `translate(${chartWidth / 2 - 30 * widthRatio}, 0)`)
    .call(yAxis);

  chartGroup.append('g')
    .attr('transform', `translate(${chartWidth / 2 + 30 * widthRatio}, 0)`)
    .call(yAxis2);

  chartGroup.append("line")
    .attr("x1", chartWidth / 2 - 30 * widthRatio)
    .attr("x2", chartWidth / 2 + 30 * widthRatio)
    .attr("y1", plotPSI ? yScale2(0.5) : yScale(0))
    .attr("y2", plotPSI ? yScale2(0.5) : yScale(0))
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  svg.append('text')
    .attr('x', (width / 2))
    .attr('y', (margin.top / 2))
    .attr('text-anchor', 'middle')
    .style('font-size', `${14 * widthRatio}px`)
    .text('Difference-to-Prediction');


  const tooltip1 = chartGroup.append('text')
    .attr('x', chartWidth / 2)
    .attr('y', height - margin.bottom - 20)
    .attr('text-anchor', 'middle')
    .attr('font-size', `${12 * heightRatio}px`)
    .attr('font-weight', 'bold')
    .attr('fill', 'black')
    .style('opacity', 0)
    .text('Δ Strength: ' + deltaForce.toFixed(2));;

  const tooltip2 = chartGroup.append('text')
    .attr('x', chartWidth / 2)
    .attr('y', height - margin.bottom - 20)
    .attr('text-anchor', 'middle')
    .attr('font-size', `${12 * heightRatio}px`)
    .attr('font-weight', 'bold')
    .attr('fill', 'black')
    .style('opacity', 0)
    .text('Predicted PSI: ' + predictedPSI.toFixed(2));

  const psi = chartGroup.append('text')
    .attr('transform', `translate(${chartWidth + 60}, ${chartHeight / 2}) rotate(-90)`)
    .attr("font-size", `${12 * heightRatio}px`)
    // .attr("x", -chartWidth / 2)
    .attr("y", -23)
    .style('text-anchor', 'middle')
    .text('Predicted PSI')

  /* Hover over Difference-to-Prediction psi axis */
  psi.on("mouseover", function (event, d) {
    tooltip2.style("opacity", .9);
  })
  psi.on("mouseout", function (event, d) {
    tooltip2.style("opacity", 0);
  });

  const strength = chartGroup.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -chartHeight / 2)
    .attr("y", -25)
    .attr("font-size", `${12 * heightRatio}px`)
    // .attr('dy', '-1.50em')
    .style('text-anchor', 'middle')
    .text('Δ Strength (a.u.)')
    /* Hover over Difference-to-Prediction strength axis */
    .on("mouseover", function (event, d) {
      tooltip1.style("opacity", .9);
    })
    .on("mouseout", function (event, d) {
      tooltip1.style("opacity", 0);
    });


  const barColor = deltaForce < 0 ? skipping_color : inclusion_color;

  // Plot by deltaForce
  var barPosition, barHeight;
  if (deltaForce >= 0) {
    barPosition = yScale(deltaForce);
    barHeight = Math.abs(yScale(deltaForce) - yScale(0));
  } else {
    barPosition = yScale(0);
    barHeight = Math.abs(yScale(deltaForce) - yScale(0));
  }

  if (plotPSI) {
    // Plot by predicted PSI
    if (predictedPSI >= 0.5) {
      barPosition = yScale2(predictedPSI);
      barHeight = Math.abs(yScale2(predictedPSI) - yScale2(0.5));
    } else {
      barPosition = yScale2(0.5);
      barHeight = Math.abs(yScale2(predictedPSI) - yScale2(0.5));
    }
  }

  // graph rectangle fixed and make the margins dynamic.
  const barWidth = 25 * widthRatio;
  const bar = chartGroup.append('rect')
    .attr('x', (chartWidth / 2) - (barWidth / 2))
    .attr('width', barWidth)
    .attr('y', barPosition)
    .attr('height', barHeight)
    .attr('fill', barColor)
    .attr("stroke", "#000")
    .attr("stroke-width", 1)
    .on("click", function (event, d) {
    });
};
/**
 * Feature view 1 
 * OBS: The legend in this one doesnt adjust well on other screens
 */
function hierarchicalBarChart(parent, data) {

  const svgContainer = d3.select(".feature-view-1");
  const width = 300
  const height = 400
  const heightRatio = height / 370;

  const margin = { top: 40, right: 20, bottom: 30, left: 50 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const svg = d3.select("svg.feature-view-1")
    .attr("width", width)
    .attr("height", height);

  svg.selectAll("*").remove();

  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const root = d3.hierarchy(data).sum(d => d.strength);

  const xScale = d3.scaleBand()
    .domain(root.children ? root.children.map(d => d.data.name) : [])
    .range([0, chartWidth])
    .paddingInner(0.4)
    .paddingOuter(0.5);

  const yScale = d3.scaleLinear()
    .domain([0, 170]) // Initial domain; this will be updated
    .range([chartHeight, 0]);

  // Add slider interaction
  d3.select("#yAxisSlider1").on("input", function () {
    updateChart(+this.value);
  });

  function updateChart(yMax) {
    yScale.domain([0, yMax]); // Update the y-axis domain

    // Update the Y-axis on the chart
    svg.select(".y-axis")
      .transition() // Add a smooth transition
      .duration(500)
      .call(d3.axisLeft(yScale));

    // Update bars
    bars.transition() // Smooth transition for resizing bars
      .duration(500)
      .attr("y", d => yScale(d.value))
      .attr("height", d => chartHeight - yScale(d.value));
  }

  const xAxis = d3.axisBottom(xScale).tickFormat("").tickSize(0);
  const yAxis = d3.axisLeft(yScale);

  chart.append("text")
    .attr("x", (chartWidth / 2) - 10)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .style('font-size', `${14 * widthRatio}px`)
    .text('Class Strengths');

  chart.append("text")
    .attr("class", "x-axis-label")
    .attr("text-anchor", "middle")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight + 15)
    .style('font-size', `${12 * widthRatio}px`)
    .text("Classes");

  chart.append("text")
    .attr("class", "y-axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -chartHeight / 2)
    .attr("y", -32)
    .attr("font-size", `${12 * heightRatio}px`)
    .text("Strength (a.u.)");

  chart.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(xAxis);

  chart.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  const barWidth = 25 * widthRatio;

  const bars = chart.selectAll(".bar")
    .data(root.children ? root.children : [])
    .enter().append("rect")
    .attr("class", d => `bar ${d.data.name}`)
    .attr("x", d => xScale(d.data.name))
    .attr("y", d => yScale(d.value))
    .attr("height", d => chartHeight - yScale(d.value))
    .attr("width", barWidth)
    .attr("fill", d => getFillColor(d))
    .attr("stroke", "#000")
    .attr("stroke-width", 1);

  bars.on("click", function (event, d) {
    // Turn all bars into default color first
    chart.selectAll(".bar").attr("fill", d => getFillColor(d));
    selectedBar = this;
    selectedFeatureBar = null;
    d3.select(selectedBar).attr("fill", getHighlightColor(d));
    if (data.children[d].children) {
      const className = data.children[d].name;
      featuresParent = parent;
      featuresChildren = data.children[d];
      hierarchicalBarChart2(parent, data.children[d]);
      d3.select("svg.feature-view-3").selectAll("*").remove();
      // featureSelection(null, className);
      nucleotideView(parent.sequence, parent.structs, parent.nucleotide_activations, className);
    }
    resetHighlight();
  });

  /* Hover over Class strength */
  bars.on("mouseover", function (event, d) {
    d3.select(this).attr("fill", getHighlightColor(d));
  });

  bars.on("mouseout", function (event, d) { resetHighlight(); });

}
/**
 * hierarchicalBarChart2
 */
function hierarchicalBarChart2(parent, data) {
  const svgContainer = d3.select(".feature-view-2");

  const width = svgContainer.node().clientWidth;
  const height = svgContainer.node().clientHeight;
  const heightRatio = height / 370;
  const widthRatio = width / 491;

  const margin = { top: 40, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const color = getFillColor(data);
  const highlightColor = getHighlightColor(data);

  const svg = d3.select("svg.feature-view-2")
    .attr("width", chartWidth + margin.left + margin.right)
    .attr("height", chartHeight + margin.top + margin.bottom);

  svg.selectAll("*").remove();

  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const root = d3.hierarchy(data).sum(d => d.strength);

  const fillerData = [
    { 'data': { 'name': '1', 'strength': 0, 'length': 0 }, 'value': 0 },
    { 'data': { 'name': '2', 'strength': 0, 'length': 0 }, 'value': 0 },
    { 'data': { 'name': '3', 'strength': 0, 'length': 0 }, 'value': 0 },
    { 'data': { 'name': '4', 'strength': 0, 'length': 0 }, 'value': 0 },
  ];
  const topChildren = root.children.sort((a, b) => b.value - a.value).concat(fillerData).slice(0, 12);

  const xScale = d3.scaleBand()
    .domain(topChildren.map(d => d.data.name))
    .range([0, chartWidth])
    .paddingInner(0.2)
    .paddingOuter(0.3);

  const yScale = d3.scaleLinear()
    .domain([0, 75])
    .range([chartHeight, 0]);


  const xAxis = d3.axisBottom(xScale).tickSize(0).tickFormat("");
  const yAxis = d3.axisLeft(yScale).ticks(5);

  chart.append("text")
    .attr("x", chartWidth / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .style('font-size', `${14 * widthRatio}px`)
    .text((data.name == "incl" ? "Inclusion" : "Skipping") + ' Features');

  chart.append("text")
    .attr("class", "x-axis-label")
    .attr("text-anchor", "middle")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight + margin.bottom - 15)
    .attr("font-size", `${12 * widthRatio}px`)
    .text("Features");

  chart.append("text")
    .attr("class", "y-axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -chartHeight / 2)
    .attr("y", -25)
    .attr("font-size", `${12 * heightRatio}px`)
    .text("Strength (a.u.)");

  chart.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-30)");

  chart.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  const tooltip = chart.append("text")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("font-size", "12px")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle");

  const barWidth = 25 * widthRatio;
  // const barSpacing = 4*widthRatio;

  topChildren.forEach(ele => {
    if (ele.data.name === selected) {
      positionsChildren = ele;
      positionsParent = ele.data.name;
    }
  });

  if (positionsChildren) {
    hierarchicalBarChart3(positionsParent, positionsChildren);
  }

  const bars = chart.selectAll(".bar")
    .data(topChildren)
    .enter().append("rect")
    .attr("class", d => "bar " + d.data.name)
    // .attr("x", (d, i) => (i * barSpacing) + xScale(d.data.name))
    .attr("x", (d, i) => xScale(d.data.name))
    .attr("y", d => yScale(d.value))
    .attr("height", d => chartHeight - yScale(d.value))
    .attr("width", barWidth)
    .attr("fill", d => color)
    .attr("stroke", "#000")
    .attr("stroke-width", 1);

  // Add textbox for non-clickable features (bias, skip_struct_4)
  const nolegend_features = ['incl_bias', 'skip_struct_4'];
  const custom_names = {
    'incl_bias': 'Inclusion bias',
    'skip_struct_4': 'Uncommon long skipping structure feature'
  }
  var textbox = chart.append("rect")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("fill", "white")
    .style("border", "solid")
    .style("stroke", "#000")
    .style("stroke-width", "1px")
    .style("height", "20px")
    .style("padding", "5px")
    .style("rx", "5px")
    .style("ry", "5px")
    .style("position", "absolute")
  var text = chart.append("text")
    .style("opacity", 0)
    .attr('text-anchor', 'left')
    .attr('font-size', '12px')
    .attr('fill', 'black')

  bars.on("click", function (event, d) {
    if (nolegend_features.includes(event.data.name)) { return; }
    if (topChildren[d].children) {
      // Turn all bars into default color first
      chart.selectAll(".bar").attr("fill", color);
      selectedFeatureBar = this;
      d3.select(selectedFeatureBar).attr("fill", highlightColor);
      featureSelected = topChildren[d].data.name;
      const className = topChildren[d].data.name.split('_')[0];
      selectedBar = d3.select('svg.feature-view-1').select('.bar.' + className)._groups[0][0];
      positionsChildren = topChildren[d];
      positionsParent = topChildren[d].data.name;
      hierarchicalBarChart3(positionsParent, positionsChildren);
      if (topChildren[d].data.name.slice(-4) != "bias") {
        nucleotideFeatureView(parent, parent.feature_activations, topChildren[d].data.name);
      }
      resetHighlight();
    }
  });

  /* Hover over a Feature bar */
  bars.on("mouseover", function (event, d) {
    d3.select(this).attr("fill", highlightColor);
    d3.select('div.feature-legend-container')
      .select('.background.' + topChildren[d].data.name)
      .style("fill", color);
    if (nolegend_features.includes(event.data.name)) {
      var rect_x = xScale(topChildren[0].data.name);
      var rect_y = 10;
      text.text(custom_names[event.data.name])
        .style('opacity', 1)
        .attr("x", rect_x + 2)
        .attr("y", rect_y + 14)
        .raise();
      textbox.style("opacity", 1)
        .attr("x", rect_x)
        .attr("y", rect_y)
        .style("width", text.node().getComputedTextLength() + 5);
    }
  });

  bars.on("mouseout", function (event, d) {
    resetHighlight();
    if (nolegend_features.includes(event.data.name)) {
      textbox.style("opacity", 0);
      text.style("opacity", 0);
    }
  });

  onGraphRendered('.feature-view-2'); // Notify that the graph has been rendered

  // Select the slider element
  const yAxisSlider = d3.select("#yAxisSlider2");

  // Update chart function that adjusts the y-axis based on the slider value
  function updateChart(yMax) {
    yScale.domain([0, yMax]); // Update the y-axis domain

    // Update the Y-axis on the chart
    svg.select(".y-axis")
      .transition() // Add a smooth transition
      .duration(500)
      .call(d3.axisLeft(yScale));

    // Update bars
    bars.transition() // Smooth transition for resizing bars
      .duration(500)
      .attr("y", d => yScale(d.value))
      .attr("height", d => chartHeight - yScale(d.value));
  }

  // Event listener for the slider change
  yAxisSlider.on("input", function () {
    updateChart(+this.value);
  });


}
/**
 * hierarchicalBarChart3
 */
function hierarchicalBarChart3(parentName, data) {

  const svgContainer = d3.select(".feature-view-3");

  const width = svgContainer.node().clientWidth;
  const height = svgContainer.node().clientHeight;
  const heightRatio = height / 370;
  const widthRatio = width / 491;

  const margin = { top: 40, right: 20, bottom: 30, left: 40 };
  const charWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const color = getFillColor(parentName);
  const highlightColor = getHighlightColor(parentName);

  const svg = d3.select("svg.feature-view-3")
    .attr("width", charWidth + margin.left + margin.right)
    .attr("height", chartHeight + margin.top + margin.bottom);

  svg.selectAll("*").remove();

  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const fillerData = [
    { 'data': { 'name': '1', 'strength': 0, 'length': 0 }, 'value': 0 },
    { 'data': { 'name': '2', 'strength': 0, 'length': 0 }, 'value': 0 },
    { 'data': { 'name': '3', 'strength': 0, 'length': 0 }, 'value': 0 },
    { 'data': { 'name': '4', 'strength': 0, 'length': 0 }, 'value': 0 },
    { 'data': { 'name': '5', 'strength': 0, 'length': 0 }, 'value': 0 },
    { 'data': { 'name': '6', 'strength': 0, 'length': 0 }, 'value': 0 },
    { 'data': { 'name': '7', 'strength': 0, 'length': 0 }, 'value': 0 },
    { 'data': { 'name': '8', 'strength': 0, 'length': 0 }, 'value': 0 },
  ];
  const children = (data.children || []);
  const topChildren = children
    .sort((a, b) => b.value - a.value)
    .concat(fillerData)
    .slice(0, 10);

  const xScale = d3.scaleBand()
    .domain(topChildren.map(d => d.data.name))
    .range([0, charWidth])
    .paddingInner(0.1)
    .paddingOuter(0.4);

  const yScale = d3.scaleLinear()
    .domain([0, 18])
    .range([chartHeight, 0]);

  const xAxis = d3.axisBottom(xScale).tickSize(0).tickFormat("");
  const yAxis = d3.axisLeft(yScale).ticks(5);

  chart.append("text")
    .attr("x", charWidth / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .style('font-size', `${14 * widthRatio}px`)
    .text("Strongest Positions for Given Feature");

  chart.append("text")
    .attr("class", "x-axis-label")
    .attr("text-anchor", "middle")
    .attr("x", charWidth / 2)
    .attr("y", chartHeight + 15)
    .attr("font-size", `${12 * widthRatio}px`)
    .text("Positions");

  chart.append("text")
    .attr("class", "y-axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -chartHeight / 2)
    .attr("y", -25)
    .attr("font-size", `${12 * heightRatio}px`)
    .text("Strength (a.u.)");

  chart.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-30)");

  chart.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  const barWidth = 25 * widthRatio;
  // const barSpacing = 2.5* widthRatio;

  const bars = chart.selectAll(".bar")
    .data(topChildren)
    .enter().append("rect")
    .attr("class", d => "bar " + d.data.name)
    // .attr("x", (d, i) => (i * barSpacing) + xScale(d.data.name))
    .attr("x", (d, i) => xScale(d.data.name))
    .attr("y", d => yScale(d.value))
    .attr("height", d => chartHeight - yScale(d.value))
    .attr("width", barWidth)
    .attr("fill", color)
    .attr("stroke", "#000")
    .attr("stroke-width", 1);

  /* Hover over a Position bar */
  bars.on("mouseover", function (event, d) {
    d3.select(this).attr("fill", highlightColor);
    const data = d3.select(this).datum();
    d3.select("svg.nucleotide-view")
      .selectAll(".obj.bar." + data.data.name)
      .raise()
      .attr("fill", highlightColor);
  });

  bars.on("mouseleave", function (event, d) {
    d3.select(this).attr("fill", color);
    d3.select("svg.nucleotide-view").selectAll(".obj.bar").attr("fill", color);
  });

  onGraphRendered('.feature-view-3'); // Notify that the graph has been rendered
  // Select the slider element
  const yAxisSlider3 = d3.select("#yAxisSlider3");

  // Function to update the chart based on the slider value
  function updateChart3(yMax) {
    // Update the yScale domain
    yScale.domain([0, yMax]);

    // Transition the Y-axis to new scale
    svg.select(".y-axis")
      .transition()
      .duration(500)
      .call(d3.axisLeft(yScale));

    // Transition the bars to new heights based on new scale
    bars.transition()
      .duration(500)
      .attr("y", d => yScale(d.value))
      .attr("height", d => chartHeight - yScale(d.value));
  }

  // Event listener for changes to the slider
  yAxisSlider3.on("input", function () {
    updateChart3(+this.value);
  });

}

function getFeaturesForPosition(pos, data) {


  // Helper function to extract features from flattened data
  function extractFeatures(flattenedData) {
    return flattenedData.map(item => {
      const nameParts = item.name.split(' ');
      return {
        name: nameParts[1],
        strength: item.strength,
        length: item.length
      };
    });
  }

  // Get inclusion data
  const inclData = data.flattened_inclusion[`pos_${pos}`] || [];
  const inclFeatures = extractFeatures(inclData);

  // Get skipping data
  const skipData = data.flattened_skipping[`pos_${pos}`] || [];
  const skipFeatures = extractFeatures(skipData);

  // Extract unique inclusion values
  const uniqueInclValues = [...new Set(inclFeatures.map(item => {
    const match = item.name.match(/incl_(\d+)/);
    return match ? match[0] : null;
  }))].filter(Boolean);

  // Extract unique skipping values
  const uniqueSkipValues = [...new Set(skipFeatures.map(item => {
    const match = item.name.match(/skip(?:_struct)?_\d+/);
    return match ? match[0] : null;
  }))].filter(Boolean);


  // Highlight logos (assuming this function exists elsewhere in your code)
  highlightLogos([...uniqueSkipValues, ...uniqueInclValues]);

  // Return the extracted features if needed
  return {
    inclusion: inclFeatures,
    skipping: skipFeatures
  };
}
/**
 * nucleotideView 
 */

function nucleotideView(sequence, structs, data, classSelected = null) {
  data = data[0]
  var exon_length = sequence.length - flanking_length * 2;
  svg = d3.select("svg.nucleotide-view")
  svg.selectAll("*").remove();

  const svgContainer = d3.select(".nucleotide-view"); // Ensure you have a container with this class
  const width = svgContainer.node().clientWidth;
  const height = svgContainer.node().clientHeight;
  const heightRatio = height / 400;
  const widthRatio = width / 1000;
  var dataIncl = data.inclusion;
  var dataSkip = data.skipping;

  var margin = { top: 30, right: 10, bottom: 20, left: 50, middle: 22 };
  var svg_nucl = d3.select("svg.nucleotide-view");
  // Title
  svg_nucl.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2 + 5)
    .attr("text-anchor", "middle")
    .style('font-size', `${16 * widthRatio}px`)
    .text("Exon View");
  var max_incl = d3.max(Object.values(data.inclusion));
  var max_skip = d3.max(Object.values(data.skipping));

  var max_strength = d3.max([max_incl, max_skip]);

  var yIncl = d3.scaleLinear()
    .domain([0, max_strength])
    .range([margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle, margin.top]);
  var ySkip = d3.scaleLinear()
    .domain([0, max_strength])
    .range([margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle, height - margin.bottom]);


  // Add X axis
  var positions = Array.from(new Array(sequence.length + 1), (x, i) => i + 1);
  var x = d3.scaleBand()
    .range([margin.left, (width - margin.right)])
    .domain(positions)
    .paddingInner(0.2)
    .paddingOuter(0.25);

  var xInclAxis = d3.axisBottom(x)
    .tickSize(2 * widthRatio)
    .tickFormat(function (d) {
      if (((d - flanking_length) % 10 == 0)) {
        return d - flanking_length;
      } else { return "" };
      return Array.from(structs)[d - 1];
    });
  var xSkipAxis = d3.axisTop(x)
    .tickSize(2 * widthRatio)
    .tickFormat(function (d) {
      return Array.from(structs)[d - 1];
    });
  var xNuAxis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat(function (d) {
      return Array.from(sequence)[d - 1];
    });
  var gxIncl = svg_nucl.append("g")
    .attr("class", "x axis")
    .attr("font-size", `${12 * heightRatio}px`)
    .attr("transform", "translate(0," + (margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle) + ")")
    .call(xInclAxis);
  var gxSkip = svg_nucl.append("g")
    .attr("class", "x axis")
    .attr("font-size", `${12 * heightRatio}px`)
    .attr("transform", "translate(0," + (margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle) + ")")
    .call(xSkipAxis);
  gxSkip.selectAll(".tick line")
    .style("display", "none");


  var gxNu = svg_nucl.append("g")
    .attr("class", "x axis")
    .attr("font-size", `${12 * heightRatio}px`)
    .attr("transform", "translate(0," + (margin.top + (height - margin.top - margin.bottom) / 2 - 5) + ")")
    .call(xNuAxis)
  var colors = [skipping_color, skipping_highlight_color, inclusion_color, inclusion_highlight_color]
  gxNu.call(xNuAxis)
    .selectAll('.tick')
    .style("cursor", "pointer")
    .on('click', function (event, d) {
      // Reset all bars to low opacity
      svg_nucl.selectAll(".obj.incl, .obj.skip").attr("opacity", 0.1);

      // Reset all nucleotides to normal font weight
      gxNu.selectAll('.tick text').style("font-weight", "normal");

      // Make the clicked nucleotide bold
      d3.select(this).select('text').style("font-weight", "bold");

      var letter = Array.from(sequence)[d - 1];
      var position = String(d);
      var pos = "pos_" + String(d);
      gxSkip.selectAll(".tick")
        .each(function (d) {
          d3.select(this).select("text")
            .attr("font-size", `${10}px`)
            .style("font-weight", "normal");
        });
      gxSkip.selectAll(".tick")
        .each(function (d) {
          var tickPosition = String(d)
          if (tickPosition === position) {
            d3.select(this).select("text").style("font-weight", "bold")
              .attr("font-size", `${11}px`);

          }
        });

      // Highlight the clicked bars
      svg_nucl.select(`.obj.incl.${pos}`)
        .style("fill", inclusion_highlight_color)
        .attr("opacity", 1);
      svg_nucl.select(`.obj.skip.${pos}`)
        .style("fill", skipping_highlight_color)
        .attr("opacity", 1);
      getFeaturesForPosition(position, data);
      nucleotideSort(position, data, margin, 230, 450, colors);
      nucleotideZoom(data, sequence, structs, position, margin, 230, 450, colors);
    });

  gxNu.selectAll("path")
    .style("stroke-width", 0);

  gxNu.selectAll(".tick")
    .each(function (d, i) {
      d3.select(this)
        .select("text")
        .attr("font-size", `${12 * widthRatio}px`)
        .attr("fill", (d <= flanking_length || d > flanking_length + exon_length) ? line_color : nucleotide_color)
    });



  const InclusionAxis = (color = false) => {
    const barColor = color ? lightOther : inclusion_color;
    const barHighlightColor = color ? darkBackground : inclusion_highlight_color;
    const lineColor = color ? lightOther : inclusion_color;
    const lineHighlightColor = color ? darkBackground : inclusion_highlight_color;

    var gyIncl = svg_nucl.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin.left + ",0)")
      .attr("font-size", `${12 * heightRatio}px`)
    gyIncl.call(d3.axisLeft(yIncl).ticks(4));

    svg_nucl.append("text")
      .attr("class", "ylabel_inclusion")
      .attr("text-anchor", "middle")
      .attr("x", -(margin.top +120 + (height - margin.top - margin.bottom) / 4 - margin.middle / 2))
      .attr("y", margin.left)
      .attr("dy", "-2.25em")
      .attr("font-size", `${12 * heightRatio}px`)
      .attr("transform", "rotate(-90)")
      .text("Strength (a.u.)");

    var extendedData = [];
    Object.entries(dataIncl).forEach(function (d, i, arr) {
      var xValue = parseInt(d[0].slice(4));
      extendedData.push([xValue, d[1]]);
      if (i < arr.length - 1) {
        extendedData.push([xValue + 1, d[1]]);
      } else {
        // Add two extra points to close the path
        extendedData.push([xValue + 1, d[1]]);
        extendedData.push([xValue + 1, 0]);  // Close to y=0
        extendedData.push([xValue + 2, 0]);  // Extend one more step at y=0
      }
    });

    // Draw the line along the edges of the bars
    var line = d3.line()
      .x(function (d) { return x(d[0]); })
      .y(function (d) { return yIncl(d[1]); })
      .curve(d3.curveStepAfter);

    svg_nucl.append("path")
      .datum(extendedData)
      .attr("class", "line incl original")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", lineHighlightColor)
      .style("stroke-width", "2px"); // Add px and !important if necessary

    // Draw the bars
    // svg_nucl.selectAll("nucleotide-incl-bar")
    //   .data(Object.entries(data.inclusion))
    //   .enter()
    //   .append("rect")
    //   .attr("class", function (d) { return "obj incl pos_" + d[0].slice(4); })
    //   .attr("x", function (d) { return x(parseInt(d[0].slice(4))); })
    //   .attr("y", function (d) { return yIncl(d[1]); })
    //   .attr("width", x.bandwidth() + 1)
    //   .attr("height", function (d) { return Math.abs(yIncl(0) - yIncl(d[1])); })
    //   .attr("fill", barColor)
    //   // .attr("stroke", inclusion_highlight_color)
    //   // .style("stroke-width", "2px") // Add px and !important if necessary
    //   .attr("opacity", .1)
    //   .lower()
    //   .on("click", function (d) {
    //     d3.selectAll(".obj.incl")
    //       .style("fill", inclusion_color)
    //       .attr("opacity", 0.1)
    //       .classed("free", true);
    //     d3.selectAll(".obj.skip")
    //       .style("fill", skipping_color)
    //       .attr("opacity", 0.1)

    //       .classed("free", true);
    //     d3.selectAll(".obj.nt")
    //       .style("font-weight", "normal")
    //       .classed("free", true);

    //     var pos = d3.select(this)
    //       .attr("class")
    //       .slice(9, -4);
    //     d3.select(".obj.incl.free." + pos)
    //       .style("fill", inclusion_highlight_color)
    //       .attr("opacity", 1)
    //       .classed("free", false);
    //     d3.select(".obj.skip.free." + pos)
    //       .style("fill", skipping_highlight_color)
    //       .attr("opacity", 1)

    //       .classed("free", false);
    //     d3.select(".obj.nt." + pos)
    //       .style("font-weight", "bold")
    //       .classed("free", false);
    //     var position = d3.select(this).attr("class").split(" ")[2].split('_')[1]
    //     gxSkip.selectAll(".tick")
    //       .each(function (d) {
    //         d3.select(this).select("text").style("font-weight", "normal");
    //       });
    //     gxSkip.selectAll(".tick")
    //       .each(function (d) {
    //         var tickPosition = String(d)
    //         if (tickPosition === position) {
    //           d3.select(this).select("text").style("font-weight", "bold");
    //         }
    //       });

    //     getFeaturesForPosition(position, data)
    //     nucleotideSort(position, data, margin, 230, 450, colors);
    //     nucleotideZoom(data, sequence, structs, position, margin, 230, 450, colors);
    //   });
  }

  const SkipAxis = (color = false) => {
    const lineColor = color ? lightOther : skipping_color;
    const lineHighlightColor = color ? darkBackground : skipping_highlight_color;

    const barColor = color ? lightOther : skipping_color;
    const barHighlightColor = color ? darkBackground : skipping_highlight_color;

    var gySkip = svg_nucl.append("g")
      .attr("class", "y axis")
      .attr("font-size", `${12 * heightRatio}px`)
      .attr("transform", "translate(" + margin.left + ",0)");
    gySkip.call(d3.axisLeft(ySkip).ticks(4));

    // Create extended data points to mark the left and right edges of each bar
    var extendedSkipData = [];
    Object.entries(dataSkip).forEach(function (d, i, arr) {
      var xValue = parseInt(d[0].slice(4));
      extendedSkipData.push([xValue, d[1]]);
      if (i < arr.length - 1) {
        extendedSkipData.push([xValue + 1, d[1]]);
      } else {
        // Add two extra points to close the path
        extendedSkipData.push([xValue + 1, d[1]]);
        extendedSkipData.push([xValue + 1, 0]);  // Close to y=0
        extendedSkipData.push([xValue + 2, 0]);  // Extend one more step at y=0
      }
    });

    // Draw the line along the edges of the bars
    var line = d3.line()
      .x(function (d) { return x(d[0]); })
      .y(function (d) { return ySkip(d[1]); })
      .curve(d3.curveStepAfter)
      .defined(function (d) { return !isNaN(x(d[0])) && !isNaN(ySkip(d[1])); });

    svg_nucl.append("path")
      .datum(extendedSkipData)
      .attr("class", "line skip original")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", lineHighlightColor)
      .style("stroke-width", "2px"); // Add px and !important if necessary
    // Draw the bars
    // svg_nucl.selectAll("nucleotide-skip-bar")
    //   .data(Object.entries(data.skipping))
    //   .enter()
    //   .append("rect")
    //   .attr("class", function (d) { return "obj skip pos_" + d[0].slice(4); })
    //   .attr("x", function (d) { return x(parseInt(d[0].slice(4))); })
    //   .attr("y", margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle)
    //   .attr("width", x.bandwidth() + 1)
    //   .attr("height", function (d) { return ySkip(d[1]) - (margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle); })
    //   .attr("fill", barColor)
    //   // .attr("stroke", lineHighlightColor)
    //   // .style("stroke-width", "2px") // Add px and !important if necessary
    //   .attr("opacity", .1) // Adjust opacity as needed

    //   .lower()
    //   .on("click", function (d) {
    //     d3.selectAll(".obj.incl")
    //       .style("fill", inclusion_color)
    //       .attr("opacity", 0.1)
    //       .classed("free", true);
    //     d3.selectAll(".obj.skip")
    //       .style("fill", skipping_color)
    //       .attr("opacity", 0.1)

    //       .classed("free", true);
    //     d3.selectAll(".obj.nt")
    //       .style("font-weight", "normal")
    //       .classed("free", true);

    //     var pos = d3.select(this)
    //       .attr("class")
    //       .slice(9, -4);
    //     d3.select(".obj.incl.free." + pos)
    //       .style("fill", inclusion_highlight_color)
    //       .attr("opacity", 1)
    //       .classed("free", false);
    //     d3.select(".obj.skip.free." + pos)
    //       .style("fill", skipping_highlight_color)
    //       .attr("opacity", 1)

    //       .classed("free", false);
    //     d3.select(".obj.nt." + pos)
    //       .style("font-weight", "bold")
    //       .classed("free", false);
    //     var position = d3.select(this).attr("class").split(" ")[2].split('_')[1]

    //     gxSkip.selectAll(".tick")
    //       .each(function (d) {
    //         d3.select(this).select("text").style("font-weight", "normal");
    //       });
    //     gxSkip.selectAll(".tick")
    //       .each(function (d) {
    //         var tickPosition = String(d)
    //         if (tickPosition === position) {
    //           d3.select(this).select("text").style("font-weight", "bold");
    //         }
    //       });
    //     getFeaturesForPosition(position, data)
    //     nucleotideSort(position, data, margin, 230, 450, colors);
    //     nucleotideZoom(data, sequence, structs, position, margin, 230, 450, colors);
    //   });
  };

  if (classSelected === "incl") {
    InclusionAxis()
    SkipAxis(true)
    hovering('skip')
    // clicking('skip')
  } else if (classSelected === "skip") {
    SkipAxis()
    InclusionAxis(true)
    hovering('incl')
    // clicking('incl')
  } else {
    InclusionAxis()
    SkipAxis()
    hovering()
    // clicking()
  }
  function hovering(color = null) {
    const skipBarColor = color == 'skip' ? lightOther : skipping_color;
    const skipBarHighlightColor = color == 'skip' ? darkBackground : skipping_highlight_color;
    const inclBarColor = color == 'incl' ? lightOther : inclusion_color;
    const inclBarHighlightColor = color == 'incl' ? darkBackground : inclusion_highlight_color;
    // Hghlight on hover
    gxNu.selectAll(".tick")
      .each(function (d) {
        d3.select(this)
          .select("text")
          .attr("class", "obj nt pos_" + d);
      });

    svg_nucl.selectAll(".obj")
      .classed("free", true);

    /* Hover over a Exon view */
    svg_nucl.selectAll(".obj.free")
      .on("mouseover", function (d) {
        var pos = d3.select(this)
          .attr("class")
          .slice(9, -4);
        d3.select(".obj.incl.free." + pos)
          .attr("opacity", 0.7);  // Increase opacity on hover
        d3.select(".obj.skip.free." + pos)
          .attr("opacity", 0.7);  // Increase opacity on hover
        d3.select(".obj.nt." + pos)
          .style("font-weight", "bold");
      })
      .on("mouseleave", function (d) {
        var pos = d3.select(this)
          .attr("class")
          .slice(9, -4);
        d3.select(".obj.incl.free." + pos)
          .attr("opacity", .1);  // Reset to initial low opacity
        d3.select(".obj.skip.free." + pos)
          .attr("opacity", .1);  // Reset to initial low opacity
        d3.select(".obj.nt." + pos)
          .style("font-weight", "normal");
      });
  };
 
  return svg_nucl
}

/**
 * nucleotideFeatureView
 */
function nucleotideFeatureView(parent, data, feature_name) {
  var margin = { top: 30, right: 10, bottom: 20, left: 50, middle: 22 };
  const svgContainer = d3.select(".nucleotide-view"); // Ensure you have a container with this class
  const width = svgContainer.node().clientWidth;
  const height = svgContainer.node().clientHeight;
  svg = d3.select("svg.nucleotide-view")
  svg.selectAll("rect").remove();
  svg.selectAll(".y.axis").remove();
  svg.selectAll(".line.incl.original").remove();
  svg.selectAll(".line.skip.original").remove();
  d3.select("svg.nucleotide-sort").selectAll("*").remove();
  d3.select("svg.nucleotide-zoom").selectAll("*").remove();

  var class_name = feature_name.split("_")[0];
  var flat_data = []
  if (class_name == "incl") {
    flat_data = flatten_nested_json(data.children[0]).filter(function (d, i, arr) {
      return d.name.split(" ")[1] == feature_name;
    });
  } else {
    flat_data = flatten_nested_json(data.children[1]).filter(function (d, i, arr) {
      return d.name.split(" ")[1] == feature_name;
    });
  }


  /* Change y range to a fix range */
  // var max_strength = d3.max(d3.map(data, function (d) { return d.strength / d.length; }).keys());
  var max_strength = 6;

  // X scale
  var sequence = parent.sequence;
  console.log(sequence.length)
  var positions = Array.from(new Array(sequence.length), (x, i) => i + 1);
  var x = d3.scaleBand()
    .range([margin.left, width - margin.right])
    .domain(positions)
    .padding(0);

  // Y Axis
  // Function to get the position from the data
  function getPosition(d) {
    return parseInt(d.name.split(" ")[2].split("_")[1]);
  }

  // Function to calculate bar width
  function getBarWidth(d) {
    return (x(getPosition(d) + d.length) - x(getPosition(d)));
  }

  console.log(flat_data)


  if (class_name == "incl") {
    svg.selectAll("text.ylabel_skip").remove();
    svg.selectAll("text.ylabel_inclusion").remove();

    svg.append("text")
      .attr("class", "ylabel_inclusion")
      .attr("text-anchor", "middle")
      .attr("x", -(margin.top + (height - margin.top - margin.bottom) / 4 - margin.middle / 2))
      .attr("y", margin.left)
      .attr("dy", "-2.25em")
      .attr("font-size", `12 px`)
      .attr("transform", "rotate(-90)")
      .text("Strength (a.u.)");
    var yIncl = d3.scaleLinear()
      .domain([0, max_strength])
      .range([margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle, margin.top]);
    var gyIncl = svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin.left + ",0)");
    gyIncl.call(d3.axisLeft(yIncl).ticks(3));
    svg.selectAll("nucleotide-incl-bar")
      .data(flat_data)
      .enter()
      .append("rect")
      .datum(function (d) { return d; })
      .attr("class", function (d) { return "obj bar " + d.name.slice(4); })
      .attr("x", function (d) { return x(getPosition(d)); })
      .attr("width", getBarWidth)
      .attr("y", function (d) { return yIncl(d.strength / d.length); })
      .attr("height", function (d) { return (margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle) - yIncl(d.strength / d.length); })
      .attr("fill", inclusion_color)
      .attr("stroke", line_color)
      .attr("opacity", 0.8)
      .lower()
      /* Hover over Exon feature view */
      .on("mouseover", function (d) {
        const data = d3.select(this).datum();
        d3.select("svg.feature-view-3").selectAll(".bar." + data.name.split(' ')[2])
          .attr("fill", inclusion_highlight_color);
        d3.select(this).raise().attr("fill", inclusion_highlight_color);
      })
      .on("mouseleave", function (d) {
        d3.select(this).attr("fill", inclusion_color);
        d3.select(this).attr("fill", inclusion_color);
        d3.select("svg.feature-view-3").selectAll(".bar")
          .attr("fill", inclusion_color);
      })
      .attr("y", function (d) { return yIncl(d.strength / d.length); })
      .attr("height", function (d) { return (margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle) - yIncl(d.strength / d.length); });
    // .delay(function (d, i) { return (i * 10); });
  }
  if (class_name == "skip") {
    svg.selectAll("text.ylabel_skip").remove();
    svg.selectAll("text.ylabel_inclusion").remove();
    svg.append("text")
      .attr("class", "ylabel_skip")
      .attr("text-anchor", "middle")
      .attr("x", -(margin.top / 2 + (height - margin.top - margin.bottom) / 4 + margin.middle / 2 + height / 2 - margin.bottom / 2))
      .attr("y", margin.left)
      .attr("dy", "-2.25em")
      .attr("font-size", `12px`)
      .attr("transform", "rotate(-90)")
      .text("Strength (a.u.)");

    var ySkip = d3.scaleLinear()
      .domain([0, max_strength])
      .range([margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle, height - margin.bottom]);
    var gySkip = svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin.left + ",0)");
    gySkip.call(d3.axisLeft(ySkip).ticks(3));



    svg.selectAll("nucleotide-skip-bar")
      .data(flat_data)
      .enter()
      .append("rect")
      .datum(function (d) { return d; })
      .attr("class", function (d) { return "obj bar " + d.name.slice(4); })
      .attr("x", function (d) { return x(getPosition(d)); })
      .attr("width", getBarWidth)
      .attr("y", (margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle))
      .attr("height", function (d) { return ySkip(d.strength / d.length) - (margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle); })
      .attr("fill", skipping_color)
      .attr("stroke", line_color)
      .attr("opacity", 0.8)
      .lower()
      /* Hover over Exon feature view */
      .on("mouseover", function (d) {
        const data = d3.select(this).datum();

        d3.select("svg.feature-view-3").selectAll(".bar." + data.name.split(' ')[2])
          .attr("fill", skipping_highlight_color);
        d3.select(this).raise().attr("fill", skipping_highlight_color);
      })
      .on("mouseleave", function (d) {
        d3.select(this).attr("fill", skipping_color);
        d3.select("svg.feature-view-3").selectAll(".bar")
          .attr("fill", skipping_color);
      })
      .attr("y", (margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle))
      .attr("height", function (d) { return ySkip(d.strength / d.length) - (margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle); });
    // .delay(function (d, i) { return (i * 10); });
  }
}
/**
 * nucleotideSort
 */
function nucleotideSort(pos, data, margin, width, height, colors) {
  var svg_sort = d3.select("svg.nucleotide-sort").attr('opacity', 1);
  var svg_zoom = d3.select("svg.nucleotide-zoom");

  const inclusionColor = colors[2];
  const inclusionHighlightColor = colors[3];
  const skippingColor = colors[0];
  const skippingHighlightColor = colors[1];

  const heightRatio = height / 622;
  const widthRatio = width / 292;

  svg_sort.selectAll("*").remove(); // Clear SVG before redrawing

  // Add title
  svg_sort.append("text")
    .attr("x", width / 2 + 20)
    .attr("y", margin.top / 2 + 5)
    .attr("text-anchor", "middle")
    .style('font-size', `${14 * widthRatio}px`)
    .text("Nucleotide View");

  // Data preparation
  const inclData = data.flattened_inclusion[`pos_${pos}`] || [];
  const skipData = data.flattened_skipping[`pos_${pos}`] || [];

  // Sort and select top elements
  const sortedInclData = inclData.sort((a, b) => b.strength - a.strength).slice(0, 10);
  const sortedSkipData = skipData.sort((a, b) => b.strength - a.strength).slice(0, 10);

  // Calculate maximum number of elements
  const maxBars = Math.max(sortedInclData.length, sortedSkipData.length);

  // Add padding bars with zero height to ensure both datasets have the same length
  while (sortedInclData.length < maxBars) {
    sortedInclData.push({ name: '', strength: 0, length: 0 });
  }
  while (sortedSkipData.length < maxBars) {
    sortedSkipData.push({ name: '', strength: 0, length: 0 });
  }

  const inclStrengths = sortedInclData.map(d => d.strength);
  const skipStrengths = sortedSkipData.map(d => d.strength);
  const maxStrength = Math.max(...inclStrengths, ...skipStrengths);

  // X axis setup
  const sortXIncl = d3.scaleBand()
    .range([margin.left, width - margin.right])
    .domain(sortedInclData.map((d, i) => i))
    .paddingInner(0.2)
    .paddingOuter(0.25);

  const sortXSkip = d3.scaleBand()
    .range([margin.left, width - margin.right])
    .domain(sortedSkipData.map((d, i) => i))
    .padding(0.2);

  const sortXInclAxis = d3.axisBottom(sortXIncl).tickSize(0).tickFormat("");
  const sortXSkipAxis = d3.axisTop(sortXSkip).tickSize(0).tickFormat("");

  const sortGxIncl = svg_sort.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle})`);

  const sortGxSkip = svg_sort.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle})`);

  // Y axis setup
  const sortYIncl = d3.scaleLinear()
    .domain([0, maxStrength])
    .range([margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle, margin.top]);

  const sortYSkip = d3.scaleLinear()
    .domain([0, maxStrength])
    .range([margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle, height - margin.bottom]);

  const sortGYIncl = svg_sort.append("g")
    .attr("class", "y axis")
    .attr("transform", `translate(${margin.left}, 0)`);

  const sortGYSkip = svg_sort.append("g")
    .attr("class", "y axis")
    .attr("transform", `translate(${margin.left}, 0)`);

  const sortInclYLabel = svg_sort.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -(margin.top + 110 + (height - margin.top - margin.bottom) / 4 - margin.middle / 2))
    .attr("y", margin.left - 15)
    .attr("dy", "-2.25em")
    .attr("font-size", `${12 * heightRatio}px`)
    .attr("transform", "rotate(-90)")
    .style("fill", background_color)
    .text("Strength (a.u.)");

  const sortSkipYLabel = svg_sort.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -(margin.top / 2 + (height - margin.top - margin.bottom) / 4 + margin.middle / 2 + height / 2 - margin.bottom / 2))
    .attr("y", margin.left - 15)
    .attr("dy", "-2.25em")
    .attr("font-size", `${12 * heightRatio}px`)
    .attr("transform", "rotate(-90)")
    .style("fill", background_color);

  // X axis rendering
  sortGxIncl.call(sortXInclAxis);
  sortGxSkip.call(sortXSkipAxis);

  // Y axis rendering
  sortGYIncl.call(d3.axisLeft(sortYIncl).ticks(5));
  sortGYSkip.call(d3.axisLeft(sortYSkip).ticks(5));

  // Remove previous bars
  svg_sort.selectAll(".incl.narrow-bar").remove();
  svg_sort.selectAll(".skip.narrow-bar").remove();

  // Add new bars for inclusion
  const inclBars = svg_sort.selectAll(".incl-narrow-bar")
    .data(sortedInclData)
    .enter()
    .append("rect")
    .attr("class", d => `obj incl narrow-bar ${d.name.split(" ").join("-")}`)
    .attr("x", (d, i) => sortXIncl(i))
    .attr("y", d => sortYIncl(d.strength))
    .attr("width", sortXIncl.bandwidth())
    .attr("height", d => (margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle) - sortYIncl(d.strength))
    .attr("fill", inclusionColor)
    .attr("stroke", line_color)
    .lower();

  // Add hover effect for inclusion bars
  inclBars.on("mouseover", function (event, d) {
    d3.select(this).attr("fill", inclusionHighlightColor);
    const featureClass = d3.select(this).attr("class").split(" ")[3];
    d3.selectAll(`.incl.wide-bar.${featureClass}`)
      .raise()
      .attr("fill", inclusionHighlightColor)
      .attr("opacity", 1);
    d3.selectAll(`.annotate.incl.${featureClass}`)
      .raise()
      .attr("opacity", 0);
  });

  inclBars.on("mouseout", function (event, d) {
    d3.select(this).attr("fill", inclusionColor);
    svg_zoom.selectAll(".incl.wide-bar").attr("fill", inclusionColor).attr("opacity", 0.5);
    svg_zoom.selectAll(".incl.annotate").attr("opacity", 0);
    resetHighlight();
  });

  // Add new bars for skipping
  const skipBars = svg_sort.selectAll(".skip-narrow-bar")
  .data(sortedSkipData)
  .enter()
  .append("rect")
  .attr("class", d => `obj skip narrow-bar ${d.name.split(" ").join("-")}`)
  .attr("x", (d, i) => sortXSkip(i))
  .attr("y", d => margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle) // Position based on strength
  .attr("width", sortXSkip.bandwidth())
  .attr("height", d =>  sortYSkip(d.strength) - (margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle)) // Height from base to strength
  .attr("fill", skippingColor)
  .attr("stroke", line_color)
  .lower();


  // Add hover effect for skipping bars
  skipBars.on("mouseover", function (event, d) {
    d3.select(this).attr("fill", skippingHighlightColor);
    const featureClass = d3.select(this).attr("class").split(" ")[3];
    d3.selectAll(`.skip.wide-bar.${featureClass}`)
      .raise()
      .attr("fill", skippingHighlightColor)
      .attr("opacity", 1);
    d3.selectAll(`.annotate.skip.${featureClass}`)
      .raise()
      .attr("opacity", 0);
  });

  skipBars.on("mouseout", function (event, d) {
    d3.select(this).attr("fill", skippingColor);
    svg_zoom.selectAll(".skip.wide-bar").attr("fill", skippingColor).attr("opacity", 0.5);
    svg_zoom.selectAll(".skip.annotate").attr("opacity", 0);
    resetHighlight();
  });
}

/**
 * nucleotideZoom
 */
function nucleotideZoom(data, sequence, structs, pos, margin, zoom_width, height, colors) {
  var svg_zoom = d3.select("svg.nucleotide-zoom")
    .attr('opacity', 1);

  pos = "pos_" + pos
  const heightRatio = height / 622;
  const widthRatio = zoom_width / 292;
  const int_pos = parseInt(pos.slice(4));
  const positions = Array.from({ length: 11 }, (_, i) => i - 5);

  const inclusionColor = colors[2]
  const skippingColor = colors[0]
  const zoom_x = d3.scaleBand()
    .range([margin.left, zoom_width - margin.right])
    .domain(positions)
    .padding(0);

  const incl_data = data.flattened_inclusion[`${pos}`] || [];
  const skip_data = data.flattened_skipping[`${pos}`] || [];

  // var incl_data = flatten_nested_json(data.flattened_inclusion[pos]);

  // var skip_data = flatten_nested_json(data.flattened_skipping[pos]);

  const max_incl = d3.max(incl_data.map((d) => d.strength));
  const max_skip = d3.max(skip_data.map((d) => d.strength));
  const max_strength = Math.max(max_incl, max_skip);

  /* Change y range to a fix range */
  const zoom_yIncl = d3.scaleLinear()
    .domain([0, max_strength])
    .range([margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle, margin.top]);

  const zoom_ySkip = d3.scaleLinear()
    .domain([0, max_strength])
    .range([margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle, height - margin.bottom]);

  svg_zoom.selectAll("*").remove(); // Clear SVG before redrawing

  // Add title
  svg_zoom.append("text")
    .attr("x", zoom_width / 2 +20)
    .attr("y", margin.top / 2 + 5)
    .attr("text-anchor", "middle")

    // .style("font-size", "14px")
    .style('font-size', `${14 * widthRatio}px`)

    .text("Nucleotide Features");

  // Add X axis
  const zoom_xAxis = d3.axisTop(zoom_x).tickSize(2);
  const zoom_xSkipAxis = d3.axisBottom(zoom_x).tickSize(2);
  const zoom_xNuAxis = d3.axisBottom(zoom_x).tickSize(0);

  const zoom_gxIncl = svg_zoom.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle})`);

  const zoom_gxSkip = svg_zoom.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle})`);

  const zoom_gxNu = svg_zoom.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${margin.top + (height - margin.top - margin.bottom) / 2 - 5})`);

  zoom_xAxis.tickFormat((d) => structs[int_pos - 1 + d])
  zoom_xSkipAxis.tickFormat((d) => (d % 5 === 0)  ? int_pos - 5 +d  : "");
  zoom_xNuAxis.tickFormat((d) => sequence[int_pos - 1 + d]);

  zoom_gxIncl.call(zoom_xSkipAxis);
  zoom_gxSkip.call(zoom_xAxis);
  zoom_gxNu.call(zoom_xNuAxis);

  zoom_gxSkip.selectAll(".tick")
  .each(function (d) {
    d3.select(this)
    .select("text")
    .attr("font-weight", d === 0 ? "bold" : "normal")
    .attr("fill", d === 0 ? "black" : line_color);
     
 });
 zoom_gxSkip.selectAll(".tick line")
 .style("display", "none");
  zoom_gxNu.selectAll("path").style("stroke-width", 0);
  zoom_gxNu.selectAll(".tick").each(function (d) {
    d3.select(this)
      .select("text")
      .attr("font-weight", d === 0 ? "bold" : "normal")
      .attr("fill", d === 0 ? "black" : line_color);
  });

  // Add Y axis
  const zoom_gyIncl = svg_zoom.append("g")
    .attr("class", "y axis")
    .attr("transform", `translate(${margin.left}, 0)`);

  const zoom_gySkip = svg_zoom.append("g")
    .attr("class", "y axis")
    .attr("transform", `translate(${margin.left}, 0)`);

  const zoom_incl_ylabel = svg_zoom.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -(margin.top +110+ (height - margin.top - margin.bottom) / 4 - margin.middle / 2))
    .attr("y", margin.left - 15)
    .attr("dy", "-3.25em")
    .attr("font-size", `${12 * heightRatio}px`)
    .attr("transform", "rotate(-90)")
    .style("fill", background_color)
    .text("Strength (a.u.)");

  const zoom_skip_ylabel = svg_zoom.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -(margin.top / 2 + (height - margin.top - margin.bottom) / 4 + margin.middle / 2 + height / 2 - margin.bottom / 2))
    .attr("y", margin.left - 15)
    .attr("dy", "-3.25em")
    .attr("font-size", `${12 * heightRatio}px`)
    .attr("transform", "rotate(-90)")
    .style("fill", background_color)

  zoom_incl_ylabel.style("fill", "black");
  zoom_skip_ylabel.style("fill", "black");
  zoom_gyIncl.call(d3.axisLeft(zoom_yIncl).ticks(5));
  zoom_gySkip.call(d3.axisLeft(zoom_ySkip).ticks(5));
  zoom_gySkip.selectAll(".tick line")
    .style("display", "none");

  // Add borders
  const left_border = svg_zoom.append("line")
    .attr("x1", zoom_x(0))
    .attr("x2", zoom_x(0))
    .attr("y1", zoom_yIncl(max_strength))
    .attr("y2", zoom_ySkip(max_strength))
    .attr("stroke", "black")
    .attr("stroke-dasharray", [2, 2])
    .attr("opacity", 0);

  const right_border = svg_zoom.append("line")
    .attr("x1", zoom_x(1))
    .attr("x2", zoom_x(1))
    .attr("y1", zoom_yIncl(max_strength))
    .attr("y2", zoom_ySkip(max_strength))
    .attr("stroke", "black")
    .attr("stroke-dasharray", [2, 2])
    .attr("opacity", 0);

  left_border.raise().attr("opacity", 1);
  right_border.raise().attr("opacity", 1);

  // Remove previous bars
  svg_zoom.selectAll(".incl.wide-bar")
    .attr("y", zoom_yIncl(0))
    .attr("height", 0)
    .remove();

  svg_zoom.selectAll(".skip.wide-bar")
    .attr("y", zoom_ySkip(0))
    .attr("height", 0)
    .remove();

  svg_zoom.selectAll(".annotate").remove();

  // Add new bars
  const inclBars = svg_zoom.selectAll("incl-feature-bar")
    .data(incl_data)
    .enter()
    .append("rect")
    .attr("class", (d) => `obj incl wide-bar ${d.name.split(" ").join("-")}`)
    .attr("x", (d) => d.length <= 6 ? zoom_x(1 - parseInt(d.name.slice(-1))) : zoom_x(-5))
    .attr("y", zoom_yIncl(0))
    .attr("width", (d) => d.length <= 6 ? zoom_x.bandwidth() * d.length : zoom_x.bandwidth() * 11)
    .attr("height", 0)
    .attr("fill", inclusionColor)
    .attr("stroke", line_color)
    .attr("opacity", 0.5)
    .lower();

  inclBars.attr("y", (d) => zoom_yIncl(d.strength))
    .attr("height", (d) => (margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle) - zoom_yIncl(d.strength));
  // .delay((_, i) => i * 10);

  const skipBars = svg_zoom.selectAll("skip-feature-bar")
    .data(skip_data)
    .enter()
    .append("rect")
    .attr("class", (d) => `obj skip wide-bar ${d.name.split(" ").join("-")}`)
    .attr("x", (d) => d.length <= 6 ? zoom_x(1 - parseInt(d.name.slice(-1))) : zoom_x(-5))
    .attr("y", zoom_ySkip(0))
    .attr("width", (d) => d.length <= 6 ? zoom_x.bandwidth() * d.length : zoom_x.bandwidth() * 11)
    .attr("height", 0)
    .attr("fill", skippingColor)
    .attr("stroke", line_color)
    .attr("opacity", 0.5)
    .lower();

  skipBars
    .attr("y", margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle)
    .attr("height", (d) => zoom_ySkip(d.strength) - (margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle));
  // .delay((_, i) => i * 10);

  // Add feature labels
  const inclFeatureText = svg_zoom.selectAll("incl-feature-text")
    .data(incl_data)
    .enter()
    .append("text")
    .text((d) => d.name.split(" ")[1])
    .attr("class", (d) => `annotate incl ${d.name.split(" ").join("-")}`)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("opacity", 0)
    .attr("x", (d) => {
      if (d.length <= 6) {
        return zoom_x(1 - parseInt(d.name.slice(-1))) + zoom_x.bandwidth() * d.length / 2;
      } else {
        return zoom_x(-5) + zoom_x.bandwidth() * 11 / 2;
      }
    })
    .attr("y", (d) => (zoom_yIncl(d.strength) + zoom_yIncl(0)) / 2)
    .lower();

  inclFeatureText.attr("opacity", 0);

  const skipFeatureText = svg_zoom.selectAll("skip-feature-text")
    .data(skip_data)
    .enter()
    .append("text")
    .text((d) => d.name.split(" ")[1])
    .attr("class", (d) => `annotate skip ${d.name.split(" ").join("-")}`)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("opacity", 0)
    .attr("x", (d) => {
      if (d.length <= 6) {
        return zoom_x(1 - parseInt(d.name.slice(-1))) + zoom_x.bandwidth() * d.length / 2;
      } else {
        return zoom_x(-5) + zoom_x.bandwidth() * 11 / 2;
      }
    })
    .attr("y", (d) => (zoom_ySkip(d.strength) + zoom_ySkip(0)) / 2)
    .attr("dy", "0.75em")
    .lower();

  skipFeatureText.attr("opacity", 0);
}