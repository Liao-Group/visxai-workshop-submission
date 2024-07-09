document.addEventListener('DOMContentLoaded', function() {

 // Colors
 const inclusion_color = "#c5d6fb";
 const inclusion_highlight_color = "#669aff";
 const skipping_color = "#f6c3c2";
 const skipping_highlight_color = "#ff6666";

 // Data
 const data = [
     { deltaForce: -100, psi: 0.000006 },
     { deltaForce: -20, psi: 0.071174 },
     { deltaForce: -10, psi: 0.232515 },
     { deltaForce: -5, psi: 0.361840 },
     { deltaForce: 0, psi: 0.5 },
     { deltaForce: 5, psi: 0.638148 },
     { deltaForce: 10, psi: 0.756705 },
     { deltaForce: 20, psi: 0.892360 },
     { deltaForce: 100, psi: 0.987334 }
 ];

 // Set up dimensions
 const margin = { top: 40, right: 60, bottom: 60, left: 60 };
 const width = 600;
 const height = 400;
 const chartWidth = width - margin.left - margin.right;
 const chartHeight = height - margin.top - margin.bottom;

 function createNonLinearPSIGraph() {
    const svg = d3.select("#non-linear-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.deltaForce))
        .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([chartHeight, 0]);

    // Create line gradient
    const lineGradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "line-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", chartWidth)
        .attr("y2", 0);

    lineGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", skipping_highlight_color);

    lineGradient.append("stop")
        .attr("offset", "40%")
        .attr("stop-color", skipping_highlight_color);

    lineGradient.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", "#b266ff");

    lineGradient.append("stop")
        .attr("offset", "60%")
        .attr("stop-color", inclusion_highlight_color);

    lineGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", inclusion_highlight_color);

    // Create line
    const line = d3.line()
        .x(d => xScale(d.deltaForce))
        .y(d => yScale(d.psi))
        .curve(d3.curveMonotoneX);

    // Add line to chart
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "url(#line-gradient)");

    // Add dots
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.deltaForce))
        .attr("cy", d => yScale(d.psi))
        .attr("r", 6)
        .attr("fill", d => d3.interpolateRgb(skipping_highlight_color, inclusion_highlight_color)((d.deltaForce + 100) / 200))
        .on("click", function(event, d) {
            updatePSIBarChart(d);
        });

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale));

    // Add centered y-axis
    const centerX = xScale(0);
    svg.append("g")
        .attr("transform", `translate(${centerX},0)`)
        .call(d3.axisLeft(yScale));

    // Add vertical line at x=0
    svg.append("line")
        .attr("x1", centerX)
        .attr("x2", centerX)
        .attr("y1", 0)
        .attr("y2", chartHeight)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4");

    // Add labels
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + margin.bottom - 10)
        .text("Delta Force");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -chartHeight / 2)
        .attr("y", -margin.left + 20)
        .text("PSI (Percent Spliced In)");

    // Add title
    svg.append("text")
        .attr("x", chartWidth / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Non-linear PSI Graph");
}


 // Create and update PSI Bar Chart
 function updatePSIBarChart(data) {
     d3.select("#psi-bar-chart").selectAll("*").remove();

     const svg = d3.select("#psi-bar-chart")
         .append("svg")
         .attr("width", width)
         .attr("height", height)
         .append("g")
         .attr("transform", `translate(${margin.left},${margin.top})`);

     const yScale = d3.scaleLinear()
         .domain([0, 1])
         .range([chartHeight, 0]);

     const yAxis = d3.axisLeft(yScale);

     svg.append("g")
         .call(yAxis);

     const barWidth = 60;
     const barColor = data.psi < 0.5 ? skipping_color : inclusion_color;
     const barHeight = Math.abs(yScale(data.psi) - yScale(0.5));
     const barY = data.psi > 0.5 ? yScale(data.psi) : yScale(0.5);

     svg.append("rect")
         .attr("x", chartWidth / 2 - barWidth / 2)
         .attr("y", barY)
         .attr("width", barWidth)
         .attr("height", barHeight)
         .attr("fill", barColor)
         .attr("stroke", "#000")
         .attr("stroke-width", 1);

     // Add 0.5 line
     svg.append("line")
         .attr("x1", 0)
         .attr("x2", chartWidth)
         .attr("y1", yScale(0.5))
         .attr("y2", yScale(0.5))
         .attr("stroke", "black")
         .attr("stroke-width", 1)
         .attr("stroke-dasharray", "5,5");

     svg.append("text")
         .attr("x", chartWidth / 2)
         .attr("y", -margin.top / 2)
         .attr("text-anchor", "middle")
         .style("font-size", "16px")
         .style("font-weight", "bold")
         .text("PSI Bar Chart");

     svg.append("text")
         .attr("x", chartWidth / 2)
         .attr("y", chartHeight + margin.bottom - 30)
         .attr("text-anchor", "middle")
         .text(`Delta Force: ${data.deltaForce.toFixed(2)}`);

     svg.append("text")
         .attr("x", chartWidth / 2)
         .attr("y", chartHeight + margin.bottom - 10)
         .attr("text-anchor", "middle")
         .text(`PSI: ${data.psi.toFixed(6)}`);

     svg.append("text")
         .attr("class", "axis-label")
         .attr("text-anchor", "middle")
         .attr("transform", "rotate(-90)")
         .attr("x", -chartHeight / 2)
         .attr("y", -margin.left + 20)
         .text("PSI (Percent Spliced In)");
 }

 // Initialize visualizations
 createNonLinearPSIGraph();
 updatePSIBarChart(data[Math.floor(data.length / 2)]); // Start with middle data point
});