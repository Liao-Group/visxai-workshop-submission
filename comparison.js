let comp = [];

function callFunctions() {
  document.addEventListener("DOMContentLoaded", function () {
    Promise.all([
      fetch('exon_s1_34c>a_strengths.json').then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }),
      fetch('exon_1_strengths.json').then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }),
      fetch('exon_s1_comp1_strengths.json').then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
    ])
      .then(([compData, dados, exon_s1_comp1_data]) => {
        comp = compData;
        console.log(comp);

        var svg_name = ".nucleotide-view-exon-s1-mutation"

        var labels = {'skip': ["S1 Exon Skipping","S1 Exon Mutation Skipping"],
      'incl':["S1 Exon Inclusion","S1 Exon Mutation Inclusion"]}
        nucleotideComparison(dados, comp, svg_name,labels);
        // var svg_name = ".nucleotide-view-exon-s1"

        // nucleotideComparisonSingle(dados, comparison = null, svg_name)
        var labels = {'skip': ["S1 Exon Skipping","S1 Exon Comparison Skipping"],
      'incl':["S1 Exon Inclusion","S1 Exon Comparison Inclusion"]}
        var svg_name = ".nucleotide-comp2"
        nucleotideComparison(dados, exon_s1_comp1_data, svg_name,labels);
        updatePSIBarChart({psi:0.15048794448375702,deltaForce:-13.903689982126025},'#psi-bar-chart-s1','Exon S1 PSI');
        updatePSIBarChart({psi:0.15040773153305054,deltaForce:-13.908240915963916},'#psi-bar-chart-s1-comparison','Exon S1 Comparison PSI');

      })
      .catch(error => {
        console.error("Failed to fetch or parse data:", error);
        // Optionally, inform the user visually
      });
  });
}

callFunctions()

function nucleotideComparison(data, comparison, svg_name,labels, classSelected = null) {
  var sequence = data.sequence;
  var compSequence = comparison.sequence || [];
  var structs = data.structs;
  var dataIncl = data.inclusion;
  var dataSkip = data.skipping;

  if (!comparison.sequence) {
    console.log("Comparison sequence is missing:", comparison.sequence);
    callFunctions();
  }

  var compIncl = comparison.inclusion || {};
  var compSkip = comparison.skipping || {};

  function addLegend() {
    const legendData = [];
    if (classSelected === "incl" || classSelected === null) {
      legendData.push(
        { label: labels['incl'][0], color: inclusion_color },
        { label: labels['incl'][1], color: inclusion_highlight_color }
      );
    }
    if (classSelected === "skip" || classSelected === null) {
      legendData.push(
        { label: labels['skip'][0], color: skipping_color },
        { label: labels['skip'][1], color: skipping_highlight_color }
      );
    }

    const legendWidth = 180;
    const legendHeight = legendData.length * 20 + 10;
    const legendX = margin.left + 10;
    const legendY = margin.top -10;

    const legend = svg_nucl.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${legendX}, ${legendY})`);

    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .attr("fill", "white")
      .attr("opacity", 0.8)
      .attr("rx", 10)
      .attr("ry", 10);

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
      .attr("stroke-width",10);

    legendItems.append("text")
      .attr("x", 25)
      .attr("y", 4)
      .text(d => d.label)
      .attr("font-size", `${14 * widthRatio}px`)
      .attr("alignment-baseline", "middle");
  }

  const svgContainer = d3.select(".nucleotide-view");
  const width = svgContainer.node().clientWidth;
  const height = 400;

  const heightRatio = height / 400;
  const widthRatio = width / 1000;

  var margin = { top: 30, right: 10, bottom: 20, left: 50, middle: 22 };
  var svg_nucl = d3.select(svg_name).attr("width", width).attr("height", height);

  svg_nucl.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2 + 5)
    .attr("text-anchor", "middle")
    .style('font-size', `${14 * widthRatio}px`)
    .text(compIncl && compSkip ? "Exon View Comparison" : "Exon View");

  var positions = Object.keys(dataSkip).map(pos => parseInt(pos.slice(4)));
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
    .tickFormat(d => Array.from(structs)[d - 1]);

  var xNuAxis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat((d, i) => {
      if (i < sequence.length && i < compSequence.length && sequence[i] !== compSequence[i]) {
        return compSequence[i];
      }
      return i < sequence.length ? sequence[i] : '';
    });

  var gxNu = svg_nucl.append("g")
    .attr("class", "x axis")
    .attr("font-size", `${12 * heightRatio}px`)
    .attr("transform", `translate(0, ${margin.top + (height - margin.top - margin.bottom) / 2 - 5})`)
    .call(xNuAxis);

  gxNu.selectAll('.tick').style("cursor", "pointer");
  gxNu.selectAll("path").style("stroke-width", 0);
  gxNu.selectAll(".tick text").attr("font-size", `${12 * widthRatio}px`)
    .attr("fill", (d, i) => {
      if (i < sequence.length && i < compSequence.length && sequence[i] !== compSequence[i]) {
        return "#BF40BF";
      }
      return (i < flanking_length || i >= flanking_length + exon_length) ? line_color : nucleotide_color;
    })
    .attr("font-weight", (d, i) => (i < sequence.length && i < compSequence.length && sequence[i] !== compSequence[i]) ? "bold" : "normal");

  var gxIncl = svg_nucl.append("g")
    .attr("class", "x axis")
    .attr("font-size", `${12 * heightRatio}px`)
    .attr("transform", `translate(0, ${margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle})`)
    .call(xInclAxis);

  var gxSkip = svg_nucl.append("g")
    .attr("class", "x axis")
    .attr("font-size", `${12 * heightRatio}px`)
    .attr("transform", `translate(0, ${margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle})`)
    .call(xSkipAxis);

  var max_incl = d3.max(compIncl ? [...Object.values(dataIncl), ...Object.values(compIncl)] : Object.values(dataIncl));
  var max_skip = d3.max(compSkip ? [...Object.values(dataSkip), ...Object.values(compSkip)] : Object.values(dataSkip));

  var yIncl = d3.scaleLinear()
    .domain([0, max_incl])
    .range([margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle, margin.top]);

  var ySkip = d3.scaleLinear()
    .domain([0, max_skip])
    .range([margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle, height - margin.bottom]);

  function drawInclusionAxis(color = false) {
    const lineColor = color ? lightOther : inclusion_color;
    const lineHighlightColor = color ? darkBackground : inclusion_highlight_color;

    var gyIncl = svg_nucl.append("g")
      .attr("class", "y axis")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("font-size", `${12 * heightRatio}px`);
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

    var line = d3.line()
      .x(d => x(parseInt(d[0].slice(4))) + x.bandwidth() / 2)
      .y(d => yIncl(d[1]))
      .curve(d3.curveStepAfter);

    svg_nucl.append("path")
      .datum(Object.entries(dataIncl))
      .attr("class", "line incl original")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", .5);

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

  function drawSkipAxis(color = false) {
    const lineColor = color ? lightOther : skipping_color;
    const lineHighlightColor = color ? darkBackground : skipping_highlight_color;

    var gySkip = svg_nucl.append("g")
      .attr("class", "y axis")
      .attr("font-size", `${12 * heightRatio}px`)
      .attr("transform", `translate(${margin.left},0)`);
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

    var line = d3.line()
      .x(d => x(parseInt(d[0].slice(4))) + x.bandwidth() / 2)
      .y(d => ySkip(d[1]))
      .curve(d3.curveStepAfter)
      .defined(d => !isNaN(x(parseInt(d[0].slice(4)))) && !isNaN(ySkip(d[1])));

    var skipData = Object.entries(dataSkip).filter(d => !isNaN(parseInt(d[0].slice(4))) && !isNaN(d[1]));

    svg_nucl.append("path")
      .datum(skipData)
      .attr("class", "line skip original")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 2);

    if (compSkip) {
      var compSkipData = Object.entries(compSkip).filter(d => !isNaN(parseInt(d[0].slice(4))) && !isNaN(d[1]));

      svg_nucl.append("path")
        .datum(compSkipData)
        .attr("class", "line skip comparison")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", lineHighlightColor)
        .attr("stroke-width", 2);
    }
  }

  if (classSelected === "incl") {
    drawInclusionAxis();
    drawSkipAxis(true);
  } else if (classSelected === "skip") {
    drawSkipAxis();
    drawInclusionAxis(true);
  } else {
    drawInclusionAxis();
    drawSkipAxis();
  }

  addLegend();

  return svg_nucl;
}


function nucleotideComparisonSingle(data, svg_name, classSelected = null) {
  var sequence = data.sequence;
  var structs = data.structs;
  var dataIncl = data.inclusion;
  var dataSkip = data.skipping;


  function addLegend() {
    const legendData = [];
    if (classSelected === "incl" || classSelected === null) {
      legendData.push(
        { label: "S1 Exon Inclusion", color: inclusion_color },
        { label: "S1 Exon Mutation Inclusion", color: inclusion_highlight_color }
      );
    }
    if (classSelected === "skip" || classSelected === null) {
      legendData.push(
        { label: "S1 Exon Skipping", color: skipping_color },
        { label: "S1 Exon Mutation Skipping", color: skipping_highlight_color }
      );
    }

    const legendWidth = 180;
    const legendHeight = legendData.length * 20 + 10;
    const legendX = margin.left + 10;
    const legendY = margin.top + 10;
    svg_nucl.select("body")
      .append("button")
      .html("Click me")
      .on("click", console.log("you clicked me"));
    const legend = svg_nucl.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${legendX}, ${legendY})`);

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
  }

  const svgContainer = d3.select(".nucleotide-view");
  const width = svgContainer.node().clientWidth;
  const height = 400;

  const heightRatio = height / 400;
  const widthRatio = width / 1000;

  var margin = { top: 30, right: 10, bottom: 20, left: 50, middle: 22 };
  var svg_nucl = d3.select(svg_name).attr("width", width).attr("height", height);

  svg_nucl.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2 + 5)
    .attr("text-anchor", "middle")
    .style('font-size', `${14 * widthRatio}px`)
    .text(compIncl && compSkip ? "Exon View Comparison" : "Exon View");

  var positions = Object.keys(dataSkip).map(pos => parseInt(pos.slice(4)));
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
    .tickFormat(d => Array.from(structs)[d - 1]);

    var xNuAxis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat(function (d) {
      return Array.from(sequence)[d - 1];
    });
  var gxNu = svg_nucl.append("g")
    .attr("class", "x axis")
    .attr("font-size", `${12 * heightRatio}px`)
    .attr("transform", `translate(0, ${margin.top + (height - margin.top - margin.bottom) / 2 - 5})`)
    .call(xNuAxis);

  gxNu.selectAll('.tick').style("cursor", "pointer");
  gxNu.selectAll("path").style("stroke-width", 0);
  gxNu.call(xNuAxis)
  .selectAll('.tick')
  .style("cursor", "pointer")

  var gxIncl = svg_nucl.append("g")
    .attr("class", "x axis")
    .attr("font-size", `${12 * heightRatio}px`)
    .attr("transform", `translate(0, ${margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle})`)
    .call(xInclAxis);

  var gxSkip = svg_nucl.append("g")
    .attr("class", "x axis")
    .attr("font-size", `${12 * heightRatio}px`)
    .attr("transform", `translate(0, ${margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle})`)
    .call(xSkipAxis);

  var max_incl = d3.max(compIncl ? [...Object.values(dataIncl), ...Object.values(compIncl)] : Object.values(dataIncl));
  var max_skip = d3.max(compSkip ? [...Object.values(dataSkip), ...Object.values(compSkip)] : Object.values(dataSkip));

  var yIncl = d3.scaleLinear()
    .domain([0, max_incl])
    .range([margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle, margin.top]);

  var ySkip = d3.scaleLinear()
    .domain([0, max_skip])
    .range([margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle, height - margin.bottom]);

  function drawInclusionAxis(color = false) {
    const lineColor = color ? lightOther : inclusion_color;
    const lineHighlightColor = color ? darkBackground : inclusion_highlight_color;

    var gyIncl = svg_nucl.append("g")
      .attr("class", "y axis")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("font-size", `${12 * heightRatio}px`);
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

    var line = d3.line()
      .x(d => x(parseInt(d[0].slice(4))) + x.bandwidth() / 2)
      .y(d => yIncl(d[1]))
      .curve(d3.curveStepAfter);

    svg_nucl.append("path")
      .datum(Object.entries(dataIncl))
      .attr("class", "line incl original")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", .5);

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

  function drawSkipAxis(color = false) {
    const lineColor = color ? lightOther : skipping_color;
    const lineHighlightColor = color ? darkBackground : skipping_highlight_color;

    var gySkip = svg_nucl.append("g")
      .attr("class", "y axis")
      .attr("font-size", `${12 * heightRatio}px`)
      .attr("transform", `translate(${margin.left},0)`);
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

    var line = d3.line()
      .x(d => x(parseInt(d[0].slice(4))) + x.bandwidth() / 2)
      .y(d => ySkip(d[1]))
      .curve(d3.curveStepAfter)
      .defined(d => !isNaN(x(parseInt(d[0].slice(4)))) && !isNaN(ySkip(d[1])));

    var skipData = Object.entries(dataSkip).filter(d => !isNaN(parseInt(d[0].slice(4))) && !isNaN(d[1]));

    svg_nucl.append("path")
      .datum(skipData)
      .attr("class", "line skip original")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 2);

    if (compSkip) {
      var compSkipData = Object.entries(compSkip).filter(d => !isNaN(parseInt(d[0].slice(4))) && !isNaN(d[1]));

      svg_nucl.append("path")
        .datum(compSkipData)
        .attr("class", "line skip comparison")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", lineHighlightColor)
        .attr("stroke-width", 2);
    }
  }

  if (classSelected === "incl") {
    drawInclusionAxis();
    drawSkipAxis(true);
  } else if (classSelected === "skip") {
    drawSkipAxis();
    drawInclusionAxis(true);
  } else {
    drawInclusionAxis();
    drawSkipAxis();
  }

  addLegend();

  return svg_nucl;
}
