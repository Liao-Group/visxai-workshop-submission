var comp = []

document.addEventListener("DOMContentLoaded", function () {
  fetch('exon_s1_34c>a_strengths.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(dados => {
      comp = dados
    })
    .catch(error => {
      console.error("Failed to fetch or parse data:", error);
      // Optionally, inform the user visually
    });

  fetch('exon_1_strengths.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(dados => {
      nucleotideComparison(dados, comp)
      nucleotideComparison2(dados, comp)
    })
    .catch(error => {
      console.error("Failed to fetch or parse data:", error);
      // Optionally, inform the user visually
    });
});

function nucleotideComparison(data, comparison, classSelected = null) {
  var sequence = data.sequence;
  var compSequence = comparison.sequence;
  var structs = data.structs;
  var dataIncl = data.inclusion;
  var dataSkip = data.skipping;

  // Check if comparison data exists and has the expected structure
  var compIncl = comparison && comparison.inclusion ? comparison.inclusion : null;
  var compSkip = comparison && comparison.skipping ? comparison.skipping : null;
  console.log(data)
  const addLegend = () => {
    const legendData = [];
    if (classSelected === "incl" || classSelected === null) {
      legendData.push(
        { label: "Inclusion", color: inclusion_color },
        { label: "Inclusion (Comparison)", color: inclusion_highlight_color }
      );
    }
    if (classSelected === "skip" || classSelected === null) {
      legendData.push(
        { label: "Skipping", color: skipping_color },
        { label: "Skipping (Comparison)", color: skipping_highlight_color }
      );
    }

    const legendWidth = 180;
    const legendHeight = legendData.length * 20 + 10;
    const legendX = margin.left + 10;
    const legendY = margin.top + 10;

    const legend = svg_nucl.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${legendX}, ${legendY})`);

    // Add a white background to the legend
    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("fill", "white")
      .attr("opacity", 0.8)
      .attr("rx", 5)
      .attr("ry", 5);

    const legendItems = legend.selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(10, ${i * 20 + 10})`);

    legendItems.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 20)
      .attr("y2", 0)
      .attr("stroke", d => d.color)
      .attr("stroke-width", 2);

    legendItems.append("text")
      .attr("x", 25)
      .attr("y", 4)
      .text(d => d.label)
      .attr("font-size", `${10 * widthRatio}px`)
      .attr("alignment-baseline", "middle");
  };

  const svgContainer = d3.select(".nucleotide-view");
  const width = svgContainer.node().clientWidth;
  const height = 400;

  const heightRatio = height / 400;
  const widthRatio = width / 1000;

  var margin = { top: 30, right: 10, bottom: 20, left: 50, middle: 22 };
  var svg_nucl = d3.select(".nucleotide-comp").attr("width", width)
    .attr("height", height);

  // Title
  svg_nucl.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2 + 5)
    .attr("text-anchor", "middle")
    .style('font-size', `${14 * widthRatio}px`)
    .text(compIncl && compSkip ? "Exon View Comparison" : "Exon View");

  // Add X axis
  var positions = Object.keys(dataIncl).map(pos => parseInt(pos.slice(4)));
  var x = d3.scaleBand()
    .range([margin.left, (width - margin.right)])
    .domain(positions)
    .paddingInner(0.2)
    .paddingOuter(0.25);

  var xInclAxis = d3.axisBottom(x)
    .tickSize(2 * widthRatio)
    .tickFormat(function (d) {
      if (((d - flanking_length) % 10 == 0 && d > flanking_length && d <= flanking_length + exon_length) || (d - flanking_length === 1) || (d - flanking_length === exon_length)) {
        return d - flanking_length;
      } else { return ""; }
    });
  var xSkipAxis = d3.axisTop(x)
    .tickSize(2 * widthRatio)
    .tickFormat(function (d) {
      return Array.from(structs)[d - 1];
    });

 // Modify the xNuAxis to include sequence comparison
 var xNuAxis = d3.axisBottom(x)
 .tickSize(0)
 .tickFormat(function (d, i) {
   if (i < sequence.length && i < compSequence.length && sequence[i] !== compSequence[i]) {
     return compSequence[i]; // Return the comparison nucleotide if different
   }
   return i < sequence.length ? sequence[i] : '';
 });

var gxNu = svg_nucl.append("g")
 .attr("class", "x axis")
 .attr("font-size", `${12 * heightRatio}px`)
 .attr("transform", "translate(0," + (margin.top + (height - margin.top - margin.bottom) / 2 - 5) + ")")
 .call(xNuAxis);

gxNu.call(xNuAxis)
 .selectAll('.tick')
 .style("cursor", "pointer");

gxNu.selectAll("path")
 .style("stroke-width", 0);

gxNu.selectAll(".tick")
 .each(function (d, i) {
   var text = d3.select(this).select("text");
   text.attr("font-size", `${12 * widthRatio}px`);
   
   if (i < sequence.length && i < compSequence.length && sequence[i] !== compSequence[i]) {
     text.attr("fill", "#BF40BF")
        .attr("font-weight", "bold");
   } else {
     text.attr("fill", (i < flanking_length || i >= flanking_length + exon_length) ? line_color : nucleotide_color);
   }
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


  // Add Y axis
  var max_incl = d3.max(compIncl ?
    [...Object.values(dataIncl), ...Object.values(compIncl)] :
    Object.values(dataIncl));
  var max_skip = d3.max(compSkip ?
    [...Object.values(dataSkip), ...Object.values(compSkip)] :
    Object.values(dataSkip));

  var yIncl = d3.scaleLinear()
    .domain([0, max_incl])
    .range([margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle, margin.top]);
  var ySkip = d3.scaleLinear()
    .domain([0, max_skip])
    .range([margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle, height - margin.bottom]);

  const InclusionAxis = (color = false) => {
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
      .attr("x", -(margin.top + (height - margin.top - margin.bottom) / 4 - margin.middle / 2))
      .attr("y", margin.left)
      .attr("dy", "-2.25em")
      .attr("font-size", `${12 * heightRatio}px`)
      .attr("transform", "rotate(-90)")
      .text("Inclusion strength (a.u.)");
    // Original data line
    var line = d3.line()
      .x(function (d) { return x(parseInt(d[0].slice(4))) + x.bandwidth() / 2; })
      .y(function (d) { return yIncl(d[1]); })
      .curve(d3.curveStepAfter); // Change to stepped curve

    svg_nucl.append("path")
      .datum(Object.entries(dataIncl))
      .attr("class", "line incl original")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", .5);

    // Comparison data line (only if comparison data exists)
    if (compIncl) {
      svg_nucl.append("path")
        .datum(Object.entries(compIncl))
        .attr("class", "line incl comparison")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", lineHighlightColor)
        .attr("stroke-width", .5);
    }
  }

  const SkipAxis = (color = false) => {
    const lineColor = color ? lightOther : skipping_color;
    const lineHighlightColor = color ? darkBackground : skipping_highlight_color;

    var gySkip = svg_nucl.append("g")
      .attr("class", "y axis")
      .attr("font-size", `${12 * heightRatio}px`)
      .attr("transform", "translate(" + margin.left + ",0)");
    gySkip.call(d3.axisLeft(ySkip).ticks(4));

    svg_nucl.append("text")
      .attr("class", "ylabel_skip")
      .attr("text-anchor", "middle")
      .attr("x", -(margin.top / 2 + (height - margin.top - margin.bottom) / 4 + margin.middle / 2 + height / 2 - margin.bottom / 2))
      .attr("y", margin.left)
      .attr("dy", "-2.25em")
      .attr("font-size", `${12 * heightRatio}px`)
      .attr("transform", "rotate(-90)")
      .text("Skipping strength (a.u.)");
    console.log("Skipping data:", dataSkip);

    // Original data line
    var line = d3.line()
      .x(function (d) {
        var xVal = x(parseInt(d[0].slice(4))) + x.bandwidth() / 2;
        if (isNaN(xVal)) {
          console.error("NaN x value for:", d);
          return 0; // or some default value
        }
        return xVal;
      })
      .y(function (d) {
        var yVal = ySkip(d[1]);
        if (isNaN(yVal)) {
          console.error("NaN y value for:", d);
          return 0; // or some default value
        }
        return yVal;
      })
      .curve(d3.curveStepAfter) // Change to stepped curve
      .defined(function (d) {
        return !isNaN(x(parseInt(d[0].slice(4)))) && !isNaN(ySkip(d[1]));
      });

    var skipData = Object.entries(dataSkip).filter(d => !isNaN(parseInt(d[0].slice(4))) && !isNaN(d[1]));
    console.log("Filtered skip data:", skipData);

    svg_nucl.append("path")
      .datum(skipData)
      .attr("class", "line skip original")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 2);

    // Comparison data line (only if comparison data exists)
    if (compSkip) {
      var compSkipData = Object.entries(compSkip).filter(d => !isNaN(parseInt(d[0].slice(4))) && !isNaN(d[1]));
      console.log("Filtered comparison skip data:", compSkipData);

      svg_nucl.append("path")
        .datum(compSkipData)
        .attr("class", "line skip comparison")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", lineHighlightColor)
        .attr("stroke-width", 2);
    }
  };

  if (classSelected === "incl") {
    InclusionAxis()
    SkipAxis(true)
  } else if (classSelected === "skip") {
    SkipAxis()
    InclusionAxis(true)
  } else {
    InclusionAxis()
    SkipAxis()
  }
  addLegend();  // Add the legend after drawing the lines

  return svg_nucl
}

function nucleotideComparison2(data, comparison, classSelected = null) {
  var sequence = data.sequence;
  var compSequence = comparison.sequence;
  var structs = data.structs;

  // Calculate absolute differences
  var dataIncl = {};
  var dataSkip = {};
  Object.keys(data.inclusion).forEach(key => {
    if (comparison.inclusion[key]) {
      dataIncl[key] = Math.abs(data.inclusion[key] - comparison.inclusion[key]);
    }
  });
  Object.keys(data.skipping).forEach(key => {
    if (comparison.skipping[key]) {
      dataSkip[key] = Math.abs(data.skipping[key] - comparison.skipping[key]);
    }
  });
  const addLegend = () => {
    const legendData = [
      { label: "Inclusion Difference", color: inclusion_color },
      { label: "Skipping Difference", color: skipping_color }
    ];

    const legend = svg_nucl.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - margin.right - 200}, ${margin.top})`);

    const legendItems = legend.selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItems.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 20)
      .attr("y2", 0)
      .attr("stroke", d => d.color)
      .attr("stroke-width", 2);

    legendItems.append("text")
      .attr("x", 25)
      .attr("y", 4)
      .text(d => d.label)
      .attr("font-size", `${10 * widthRatio}px`)
      .attr("alignment-baseline", "middle");
  };

  // Check if comparison data exists and has the expected structure
  var compIncl = null;
  var compSkip = null;

  const svgContainer = d3.select(".nucleotide-view");
  const width = svgContainer.node().clientWidth;
  const height = 400;

  const heightRatio = height / 400;
  const widthRatio = width / 1000;

  var margin = { top: 30, right: 10, bottom: 20, left: 50, middle: 22 };
  var svg_nucl = d3.select(".nucleotide-comp2").attr("width", width)
    .attr("height", height);

  // Title
  svg_nucl.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2 + 5)
    .attr("text-anchor", "middle")
    .style('font-size', `${14 * widthRatio}px`)
    .text("Absolute Difference in Exon View");

  // Add X axis
  var positions = Object.keys(dataIncl).map(pos => parseInt(pos.slice(4)));
  var x = d3.scaleBand()
    .range([margin.left, (width - margin.right)])
    .domain(positions)
    .paddingInner(0.2)
    .paddingOuter(0.25);

  var xInclAxis = d3.axisBottom(x)
    .tickSize(2 * widthRatio)
    .tickFormat(function (d) {
      if (((d - flanking_length) % 10 == 0 && d > flanking_length && d <= flanking_length + exon_length) || (d - flanking_length === 1) || (d - flanking_length === exon_length)) {
        return d - flanking_length;
      } else { return ""; }
    });
  var xSkipAxis = d3.axisTop(x)
    .tickSize(2 * widthRatio)
    .tickFormat(function (d) {
      return Array.from(structs)[d - 1];
    });
 // Modify the xNuAxis to include sequence comparison
 var xNuAxis = d3.axisBottom(x)
 .tickSize(0)
 .tickFormat(function (d, i) {
   if (i < sequence.length && i < compSequence.length && sequence[i] !== compSequence[i]) {
     return compSequence[i]; // Return the comparison nucleotide if different
   }
   return i < sequence.length ? sequence[i] : '';
 });

var gxNu = svg_nucl.append("g")
 .attr("class", "x axis")
 .attr("font-size", `${12 * heightRatio}px`)
 .attr("transform", "translate(0," + (margin.top + (height - margin.top - margin.bottom) / 2 - 5) + ")")
 .call(xNuAxis);

gxNu.call(xNuAxis)
 .selectAll('.tick')
 .style("cursor", "pointer");

gxNu.selectAll("path")
 .style("stroke-width", 0);

gxNu.selectAll(".tick")
 .each(function (d, i) {
   var text = d3.select(this).select("text");
   text.attr("font-size", `${12 * widthRatio}px`);
   
   if (i < sequence.length && i < compSequence.length && sequence[i] !== compSequence[i]) {
     text.attr("fill", "#BF40BF")
        .attr("font-weight", "bold");
   } else {
     text.attr("fill", (i < flanking_length || i >= flanking_length + exon_length) ? line_color : nucleotide_color);
   }
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


  // Add Y axis
  var max_incl = d3.max(Object.values(dataIncl));
  var max_skip = d3.max(Object.values(dataSkip));

  var yIncl = d3.scaleLinear()
    .domain([0, max_incl])
    .range([margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle, margin.top]);
  var ySkip = d3.scaleLinear()
    .domain([0, max_skip])
    .range([margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle, height - margin.bottom]);

  const InclusionAxis = (color = false) => {
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
      .attr("x", -(margin.top + (height - margin.top - margin.bottom) / 4 - margin.middle / 2))
      .attr("y", margin.left)
      .attr("dy", "-2.25em")
      .attr("font-size", `${12 * heightRatio}px`)
      .attr("transform", "rotate(-90)")
      .text("Inclusion difference (a.u.)");

    var line = d3.line()
      .x(function (d) { return x(parseInt(d[0].slice(4))) + x.bandwidth() / 2; })
      .y(function (d) { return yIncl(d[1]); })
      .curve(d3.curveStepAfter);

    svg_nucl.append("path")
      .datum(Object.entries(dataIncl))
      .attr("class", "line incl original")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", .5);
  }

  const SkipAxis = (color = false) => {
    const lineColor = color ? lightOther : skipping_color;
    const lineHighlightColor = color ? darkBackground : skipping_highlight_color;

    var gySkip = svg_nucl.append("g")
      .attr("class", "y axis")
      .attr("font-size", `${12 * heightRatio}px`)
      .attr("transform", "translate(" + margin.left + ",0)");
    gySkip.call(d3.axisLeft(ySkip).ticks(4));

    svg_nucl.append("text")
      .attr("class", "ylabel_skip")
      .attr("text-anchor", "middle")
      .attr("x", -(margin.top / 2 + (height - margin.top - margin.bottom) / 4 + margin.middle / 2 + height / 2 - margin.bottom / 2))
      .attr("y", margin.left)
      .attr("dy", "-2.25em")
      .attr("font-size", `${12 * heightRatio}px`)
      .attr("transform", "rotate(-90)")
      .text("Skipping difference (a.u.)");
    console.log("Skipping data:", dataSkip);


    var line = d3.line()
      .x(function (d) {
        var xVal = x(parseInt(d[0].slice(4))) + x.bandwidth() / 2;
        if (isNaN(xVal)) {
          console.error("NaN x value for:", d);
          return 0; // or some default value
        }
        return xVal;
      })
      .y(function (d) {
        var yVal = ySkip(d[1]);
        if (isNaN(yVal)) {
          console.error("NaN y value for:", d);
          return 0; // or some default value
        }
        return yVal;
      })
      .curve(d3.curveStepAfter)
      .defined(function (d) {
        return !isNaN(x(parseInt(d[0].slice(4)))) && !isNaN(ySkip(d[1]));
      });

    var skipData = Object.entries(dataSkip).filter(d => !isNaN(parseInt(d[0].slice(4))) && !isNaN(d[1]));
    console.log("Filtered skip data:", skipData);

    svg_nucl.append("path")
      .datum(skipData)
      .attr("class", "line skip original")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 2);
  };

  if (classSelected === "incl") {
    InclusionAxis()
    SkipAxis(true)
  } else if (classSelected === "skip") {
    SkipAxis()
    InclusionAxis(true)
  } else {
    InclusionAxis()
    SkipAxis()
  }
  addLegend();  // Add the legend after drawing the lines

  return svg_nucl
}