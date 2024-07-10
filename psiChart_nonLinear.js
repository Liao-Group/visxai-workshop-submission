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
 const width = 500;
 const height = 300;
 const chartWidth = width - margin.left - margin.right;
 const chartHeight = height - margin.top - margin.bottom;

 function createNonLinearPSIGraph(graphClass) {

      // Create SVG
      const svg = d3.select(graphClass)
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);
  
      // Create background gradient
      const bgGradient = svg.append("defs")
          .append("linearGradient")
          .attr("id", "background-gradient")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "0%");
  
      bgGradient.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", skipping_color);
  
      bgGradient.append("stop")
          .attr("offset", "50%")
          .attr("stop-color", "#ffffff");
  
      bgGradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", inclusion_color);
  
      // Create line gradient
      const lineGradient = svg.append("defs")
          .append("linearGradient")
          .attr("id", "line-gradient")
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", width)
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
  
      // removing the background for a moment
      // // Apply gradient to background
      // svg.append("rect")
      //     .attr("width", width)
      //     .attr("height", height)
      //     .style("fill", "url(#background-gradient)");
  
      // Set up scales
      const xScale = d3.scaleLinear()
          .domain(d3.extent(data, d => d.deltaForce))
          .range([0, width]);
  
      const yScale = d3.scaleLinear()
          .domain([0, 1])
          .range([height, 0]);
  
      // Create axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);
  
      // Add grid
      svg.append("g")
          .attr("class", "grid")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(""));
  
      svg.append("g")
          .attr("class", "grid")
          .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""));
  
      // Add x-axis
      svg.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(xAxis);
  
      // Add centered y-axis
      const centerX = xScale(0);
      svg.append("g")
          .attr("transform", `translate(${centerX},0)`)
          .call(yAxis);
  
      // Add axis labels
      svg.append("text")
          .attr("class", "axis-label")
          .attr("text-anchor", "middle")
          .attr("x", width / 2)
          .attr("y", height + margin.bottom - 10)
          .text(`Δ Strenght`);
  
      svg.append("text")
          .attr("class", "axis-label")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .attr("x", -height / 2)
          .attr("y", -margin.left + 20)
          .text("PSI");
      svg.append("text")
          .attr("class", "floating-label")
          .attr("text-anchor", "end")
          .attr("x", centerX - 100)  // 10 pixels left of the center
          .attr("y", height / 4)    // 1/4 down from the top
          .text("Skipping")
          .style("fill", skipping_highlight_color)
          .style("font-size", "14px")
          .style("font-weight", "bold");
  
      svg.append("text")
          .attr("class", "floating-label")
          .attr("text-anchor", "start")
          .attr("x", centerX + 90)  // 10 pixels right of the center
          .attr("y", height / 4)    // 1/4 down from the top
          .text("Inclusion")
          .style("fill", inclusion_highlight_color)
          .style("font-size", "14px")
          .style("font-weight", "bold");
  
      // Create line generator
      const line = d3.line()
          .x(d => xScale(d.deltaForce))
          .y(d => yScale(d.psi))
          .curve(d3.curveMonotoneX);
  
      // Add line to chart
      const path = svg.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line)
          .style("stroke", "url(#line-gradient)");
  
      // Add dots
      const dots = svg.selectAll(".dot")
          .data(data)
          .enter().append("circle")
          .attr("class", "dot")
          .attr("cx", d => xScale(d.deltaForce))
          .attr("cy", d => yScale(d.psi))
          .attr("r", 6)
          .attr("fill", d => {
              const t = Math.pow((d.deltaForce + 110) / 200, 1.5); // Use square for more variance
              return d3.interpolateRgb(skipping_highlight_color, inclusion_highlight_color)(t);
          }).on("click", function(event, d) {
            updatePSIBarChart(d);
        });
      // Add tooltip
      const tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
  
      // Add interactivity
      dots.on("mouseover", function (event, d) {
          d3.select(this).attr("r", 8);
          tooltip.transition()
              .duration(200)
              .style("opacity", .9);
          tooltip.html(`Δ Strenght: ${d.deltaForce}<br/>Psi: ${d.psi.toFixed(6)}`)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 28) + "px");
      })
          .on("mouseout", function () {
              d3.select(this).attr("r", 6);
              tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);
          });
  
      // Add animation
      const totalLength = path.node().getTotalLength();
      path
          .attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(2000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
  
      dots
          .attr("opacity", 0)
          .transition()
          .delay((d, i) => i * 200)
          .duration(500)
          .attr("opacity", 1);
  
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
         .text(`Δ Strenght: ${data.deltaForce.toFixed(2)}`);

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
         .text("PSI");
 }

 // Initialize visualizations
 createNonLinearPSIGraph("#non-linear-chart");
 createNonLinearPSIGraph("#psi-chart-gradient");

 updatePSIBarChart(data[Math.floor(data.length / 2)]); // Start with middle data point
});
