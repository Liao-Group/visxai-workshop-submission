let comp = [];

function callFunctions() {
  document.addEventListener("DOMContentLoaded", function () {
    Promise.all([
      fetch('data/exon_s1_34c>a_strengths.json').then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }),
      fetch('data/exon_s1_strengths.json').then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }),
      fetch('data/exon_s1_comp1_strengths.json').then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }),
      fetch('data/brca2_exon_strengths.json').then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }),
      fetch('data/cftr_exon_strengths.json').then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
    ])
      .then(([compData, dados, exon_s1_comp1_data, brca2_data, cfrt_data]) => {
        comp = compData;
        console.log(comp);

        var svg_name = ".nucleotide-view-exon-s1-mutation"

        var labels = {
          'skip': ["S1 Exon Skipping", "S1 Exon Mutation Skipping"],
          'incl': ["S1 Exon Inclusion", "S1 Exon Mutation Inclusion"]
        }
        nucleotideComparison(dados, comp, svg_name, labels);
        // var svg_name = ".nucleotide-view-exon-s1"

        // nucleotideComparisonSingle(dados, comparison = null, svg_name)
        var labels = {
          'skip': ["S1 Exon Skipping", "S1 Exon Comparison Skipping"],
          'incl': ["S1 Exon Inclusion", "S1 Exon Comparison Inclusion"]
        }
        var svg_name = "#nucleotide-view-exon1"
        nucleotideComparisonSingle(dados, svg_name, labels);
        updatePSIBarChart({ psi: 0.15048794448375702, deltaForce: -13.903689982126025 }, '#psi-bar-chart-s1', 'Difference-to-Prediction');

        var svg_name = "#nucleotide-view-exon-comp"
        nucleotideComparisonSingle(exon_s1_comp1_data, svg_name, labels);
        updatePSIBarChart({ psi: 0.15040773153305054, deltaForce: -13.908240915963916 }, '#psi-bar-chart-s1-comparison', ' Difference-to-Prediction');

        var svg_name = "#nucleotide-view-exon-brca2"
        nucleotideComparisonSingle(brca2_data, svg_name, labels);
        updatePSIBarChart({ psi: brca2_data.psi, deltaForce: brca2_data.delta_strength }, '#psi-bar-chart-exon-brca2', 'Difference-to-Prediction');

        var svg_name = "#nucleotide-view-exon-cfrt"
        nucleotideComparisonSingle(cfrt_data, svg_name, labels);
        updatePSIBarChart({ psi: cfrt_data.psi, deltaForce: cfrt_data.delta_strength }, '#psi-bar-chart-exon-cfrt', 'Difference-to-Prediction');

        // need to change to the correct data
        //  the number for the nucleotides are not resizgin correctly
        for (let i = 1; i <= 9; i++) {
          let svg_name = `#nucleotide-view-exon-s1-${i}`;
          nucleotideComparisonSingle(exon_s1_comp1_data, svg_name, labels);
        }
      })
      .catch(error => {
        console.error("Failed to fetch or parse data:", error);
        // Optionally, inform the user visually
      });
  });
  document.addEventListener("DOMContentLoaded", function () {
    Promise.all([
      fetch('data/exon_s1_comp1_strengths.json').then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }),
      fetch('data/exon_s1_comp_grid2_strengths.json').then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }),
      fetch('data/exon_s1_comp_grid3_strengths.json').then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }),
      fetch('data/exon_s1_comp_grid4_strengths.json').then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }),
      fetch('data/exon_s1_comp_grid5_strengths.json').then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }),
      fetch('data/exon_s1_comp_grid6_strengths.json').then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }),
      fetch('data/exon_s1_comp_grid7_strengths.json').then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }),
      fetch('data/exon_s1_comp_grid8_strengths.json').then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }),
      fetch('data/exon_s1_comp_grid9_strengths.json').then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
    ])
      .then((data) => {
        console.log(data)
        // need to change to the correct data
        //  the number for the nucleotides are not resizgin correctly
        for (let i = 1; i <= 9; i++) {
          console.log(i)
          let svg_name = `#nucleotide-view-exon-s1-${i}`;
          nucleotideComparisonGrid(data[i - 1], svg_name);
        }
      })
      .catch(error => {
        console.error("Failed to fetch or parse data:", error);
        // Optionally, inform the user visually
      });
  });

}

callFunctions()

function nucleotideComparison(data, comparison, svg_name, labels, classSelected = null) {
  var exon_length = data.sequence.length - 10 * 2;
  var sequence = data.sequence;
  var compSequence = comparison.sequence || [];
  var structs = data.structs;
  var compStructs = comparison.structs || [];
  var dataIncl = data.inclusion;
  var dataSkip = data.skipping;

  if (!comparison.sequence) {
    console.log("Comparison sequence is missing:", comparison.sequence);
    callFunctions();
  }

  var compIncl = comparison.inclusion || {};
  var compSkip = comparison.skipping || {};


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
  positions.push(positions[positions.length - 1] + 1);
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
    });

  // var xSkipAxis = d3.axisTop(x)
  //   .tickSize(2 * widthRatio)
  //   .tickFormat(d => Array.from(structs)[d - 1]);

  function comparisonSequence(isMutation = false) {
    const sequenceToChange = isMutation ? compSequence : sequence;
    const structToChange = isMutation ? compStructs : structs;
    svg_nucl.selectAll(".x.axis.nuc.ticks").remove(); // Remove the existing nucleotide letter ticks
    svg_nucl.selectAll(".x.axis.struct.ticks").remove();
    var xSkipAxis = d3.axisTop(x)
      .tickSize(2 * widthRatio)
      .tickFormat((d, i) => {
        if (i < structs.length && i < compStructs.length && structs[i] !== compStructs[i]) {
          return structToChange[i];
        }
        return i < structs.length ? structs[i] : '';
      });
    // .tickFormat(d => Array.from(structs)[d - 1]);

    var xNuAxis = d3.axisBottom(x)
      .tickSize(0)
      .tickFormat((d, i) => {
        if (i < sequence.length && i < compSequence.length && sequence[i] !== compSequence[i]) {
          return sequenceToChange[i];
        }
        return i < sequence.length ? sequence[i] : '';
      });

    var gxSkip = svg_nucl.append("g")
      .attr("class", "x axis struct ticks")
      .attr("font-size", `${12 * heightRatio}px`)
      .attr("transform", `translate(0, ${margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle})`)
      .call(xSkipAxis);
    gxSkip.selectAll(".tick line")
      .style("display", "none");

    gxSkip.selectAll(".tick text")
      .attr("font-size", `${12 * widthRatio}px`)
      .attr("fill", (d, i) => {
        if (i < structs.length && i < compStructs.length && structs[i] !== compStructs[i]) {
          return "#BF40BF";
        }
        return (i < flanking_length || i >= flanking_length + exon_length) ? line_color : nucleotide_color;
      })
      .attr("font-weight", (d, i) => (i < structs.length && i < compStructs.length && structs[i] !== compStructs[i]) ? "bold" : "normal")

    var gxNu = svg_nucl.append("g")
      .attr("class", "x axis nuc ticks")
      .attr("font-size", `${12 * heightRatio}px`)
      .attr("transform", `translate(0, ${margin.top + (height - margin.top - margin.bottom) / 2 - 5})`)
      .attr("id", "#nucleotide ticks")
      .call(xNuAxis);

    gxNu.selectAll('.tick').style("cursor", "pointer");
    gxNu.selectAll("path").style("stroke-width", 0);

    gxNu.selectAll(".tick text")
      .attr("font-size", `${12 * widthRatio}px`)
      .attr("fill", (d, i) => {
        if (i < sequence.length && i < compSequence.length && sequence[i] !== compSequence[i]) {
          return "#BF40BF";
        }
        return (i < flanking_length || i >= flanking_length + exon_length) ? line_color : nucleotide_color;
      })
      .attr("font-weight", (d, i) => (i < sequence.length && i < compSequence.length && sequence[i] !== compSequence[i]) ? "bold" : "normal")
  }

  comparisonSequence()
  var gxIncl = svg_nucl.append("g")
    .attr("class", "x axis")
    .attr("font-size", `${12 * heightRatio}px`)
    .attr("transform", `translate(0, ${margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle})`)
    .call(xInclAxis);


  var max_incl = d3.max(compIncl ? [...Object.values(dataIncl), ...Object.values(compIncl)] : Object.values(dataIncl));
  var max_skip = d3.max(compSkip ? [...Object.values(dataSkip), ...Object.values(compSkip)] : Object.values(dataSkip));

  var yIncl = d3.scaleLinear()
    .domain([0, max_incl])
    .range([margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle, margin.top]);

  var ySkip = d3.scaleLinear()
    .domain([0, max_skip])
    .range([margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle, height - margin.bottom]);


  function drawInclusionAxis(original = false) {
    const lineColor = original ? inclusion_highlight_color : inclusion_color;
    const lineHighlightColor = original ? inclusion_color : inclusion_highlight_color;

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
      .text("Strength (a.u.)");

    var line = d3.line()
      .x(d => x(parseInt(d[0].slice(4))) + x.bandwidth() / 2)
      .y(d => yIncl(d[1]))
      .curve(d3.curveStepAfter);

    if (original) {
      if (compIncl) {
        svg_nucl.append("path")
          .datum(Object.entries(compIncl))
          .attr("class", "line incl comparison")
          .attr("d", line)
          .attr("fill", "none")
          .attr("stroke", lineHighlightColor)
          .attr("stroke-width", .5);
      }
      svg_nucl.append("path")
        .datum(Object.entries(dataIncl))
        .attr("class", "line incl original")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", lineColor)
        .attr("stroke-width", .5);

    } else {
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

  }

  function drawSkipAxis(original = false) {
    const lineColor = original ? skipping_highlight_color : skipping_color;
    const lineHighlightColor = original ? skipping_color : skipping_highlight_color;

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
      .text("Strength (a.u.)");

    var line = d3.line()
      .x(d => x(parseInt(d[0].slice(4))) + x.bandwidth() / 2)
      .y(d => ySkip(d[1]))
      .curve(d3.curveStepAfter)
      .defined(d => !isNaN(x(parseInt(d[0].slice(4)))) && !isNaN(ySkip(d[1])));

    var skipData = Object.entries(dataSkip).filter(d => !isNaN(parseInt(d[0].slice(4))) && !isNaN(d[1]))

    var compSkipData = Object.entries(compSkip).filter(d => !isNaN(parseInt(d[0].slice(4))) && !isNaN(d[1]));
    // For skipData (positive values)
    var extendedSkipData = [];
    skipData.forEach(function (d, i, arr) {
      var xValue = parseInt(d[0].slice(4));
      extendedSkipData.push([xValue, d[1]]);
      if (i < arr.length - 1) {
        extendedSkipData.push([xValue + 1, d[1]]);
      } else {
        // Add extra points to close the path
        extendedSkipData.push([xValue + 1, d[1]]);
        extendedSkipData.push([xValue + 1, 0]);  // Extend one more step at y=0

        extendedSkipData.push([xValue + 2, 0]);  // Extend one more step at y=0
      }
    });

    // For compSkipData (negative values)
    var extendedCompSkipData = [];
    compSkipData.forEach(function (d, i, arr) {
      var xValue = parseInt(d[0].slice(4));
      extendedCompSkipData.push([xValue, d[1]]);
      if (i < arr.length - 1) {
        extendedCompSkipData.push([xValue + 1, d[1]]);
      } else {
        // Add extra points to close the path
        extendedCompSkipData.push([xValue + 1, d[1]]);
        extendedCompSkipData.push([xValue + 1, 0]);  // Extend one more step at y=0

        extendedCompSkipData.push([xValue + 2, 0]);  // Extend one more step at y=0
      }
    });

    // Now you can use extendedSkipData and extendedCompSkipData to draw your lines

    // For the positive values (skipData)
    var lineSkip = d3.line()
      .x(function (d) { return x(d[0]); })
      .y(function (d) { return ySkip(d[1]); })
      .curve(d3.curveStepAfter)
      .defined(function (d) { return !isNaN(x(d[0])) && !isNaN(ySkip(d[1])); });

    // For the negative values (compSkipData)
    var lineCompSkip = d3.line()
      .x(function (d) { return x(d[0]); })
      .y(function (d) { return ySkip(d[1]); })
      .curve(d3.curveStepAfter)
      .defined(function (d) { return !isNaN(x(d[0])) && !isNaN(ySkip(d[1])); });

    if (original) {
      if (compSkip) {
        svg_nucl.append("path")
          .datum(extendedCompSkipData)
          .attr("class", "line comp-skip original")
          .attr("d", lineCompSkip)
          .attr("fill", "none")
          .attr("stroke", lineHighlightColor)  // Assuming you have a different color for this line
          .attr("stroke-width", .5);
      }
      svg_nucl.append("path")
        .datum(extendedSkipData)
        .attr("class", "line skip original")
        .attr("d", lineSkip)
        .attr("fill", "none")
        .attr("stroke", lineColor)
        .attr("stroke-width", .5);


    } else {

      svg_nucl.append("path")
        .datum(extendedSkipData)
        .attr("class", "line skip original")
        .attr("d", lineSkip)
        .attr("fill", "none")
        .attr("stroke", lineColor)
        .attr("stroke-width", .5);

      if (compSkip) {
        svg_nucl.append("path")
          .datum(extendedCompSkipData)
          .attr("class", "line comp-skip original")
          .attr("d", lineCompSkip)
          .attr("fill", "none")
          .attr("stroke", lineHighlightColor)  // Assuming you have a different color for this line
          .attr("stroke-width", .5);
      }
    }
  }
  function createToggleButton(svg, x, y) {
    let isActive = true;
    // addLegend(isActive)
    const button = svg.append("g")
      .attr("cursor", "pointer")
      .attr("transform", `translate(${x}, ${y})`);

    button.append("rect")
      .attr("width", 75)
      .attr("height", 30)
      .attr("rx", 5)
      .attr("ry", 5)
      .style("stroke", 'black')
      .attr("fill", "white");

    const buttonText = button.append("text")
      .attr("x", 10)
      .attr("y", 20)
      .style('font-weight', "bold")
      .attr("text-anchor", "center")
      .attr("fill", "black")
      .text("Orignal");

    const button2 = svg.append("g")
      .attr("cursor", "pointer")
      .attr("transform", `translate(${x + 80}, ${y})`);


    button2.append("rect")
      .attr("width", 70)
      .attr("height", 30)
      .attr("rx", 5)
      .attr("ry", 5)
      .style("stroke", 'black')
      .attr("fill", "white");

    const buttonText2 = button2.append("text")
      .attr("x", 10)
      .attr("y", 20)
      .attr("text-anchor", "center")
      .attr("fill", "black")
      .text("31C>A");

    button.on("click", function () {
      isActive = true;
      buttonText2.
        style('fill', "black")
        .style('font-weight', "normal")

      buttonText
        .attr("x", 10)
        .style('font-weight', "bold")
      drawInclusionAxis(isActive);
      drawSkipAxis(isActive);
      comparisonSequence(!isActive)
      // addLegend(isActive)

    });
    button2.on("click", function () {
      isActive = false;
      buttonText
        .style('fill', "black")
        .style('font-weight', "normal")

      buttonText2
        .attr("x", 10)
        .style('font-weight', "bold")

      drawInclusionAxis(isActive);
      drawSkipAxis(isActive);
      comparisonSequence(!isActive)

      // addLegend(isActive)

    });
  }
  drawInclusionAxis(true);
  drawSkipAxis(true);
  createToggleButton(svg_nucl, 60, 30);

  return svg_nucl;
}

function nucleotideComparisonSingle(data, svg_name, classSelected = null) {
  var sequence = data.sequence;
  var structs = data.structs;
  var dataIncl = data.inclusion;
  var dataSkip = data.skipping;

  svg = d3.select(svg_name)
  svg.selectAll("*").remove();

  const svgContainer = d3.select(svg_name); // Ensure you have a container with this class
  const width = svgContainer.node().clientWidth;
  const height = svgContainer.node().clientHeight;
  const heightRatio = height / 400;
  const widthRatio = width / 1000;

  var margin = { top: 30, right: 10, bottom: 20, left: 50, middle: 22 };
  var svg_nucl = d3.select(svg_name);
  // Title
  svg_nucl.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2 + 5)
    .attr("text-anchor", "middle")
    .style('font-size', `${14 * widthRatio}px`)
    .text("Exon View");

  // Add X axis
  var positions = Array.from(new Array(sequence.length + 1), (x, i) => i + 1);
  var x = d3.scaleBand()
    .range([margin.left, (width - margin.right)])
    .domain(positions)


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

      // Highlight the clicked bars
      svg_nucl.select(`.obj.incl.${pos}`)
        .style("fill", inclusion_highlight_color)
        .attr("opacity", 1);
      svg_nucl.select(`.obj.skip.${pos}`)
        .style("fill", skipping_highlight_color)
        .attr("opacity", 1);
      getFeaturesForPosition(position, data)
      nucleotideSort(position, data, margin, 250, 450, colors);
      nucleotideZoom(data, sequence, structs, position, margin, 250, 450, max_strength, colors);
    });
  gxSkip.selectAll(".tick line")
    .style("display", "none");
  gxNu.selectAll("path")
    .style("stroke-width", 0);
  gxNu.selectAll(".tick")
    .each(function (d, i) {
      d3.select(this)
        .select("text")
        .attr("font-size", `${12 * widthRatio}px`)
        .attr("fill", (d <= flanking_length || d > flanking_length + exon_length) ? line_color : nucleotide_color)
    });

  var max_incl = d3.max(Object.values(data.inclusion));
  var max_skip = d3.max(Object.values(data.skipping));
  console.log("Max inclusion strength:", max_incl);
  console.log("Max skipping strength:", max_skip);

  var max_strength = d3.max([max_incl, max_skip]);

  var yIncl = d3.scaleLinear()
    .domain([0, max_strength])
    .range([margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle, margin.top]);
  var ySkip = d3.scaleLinear()
    .domain([0, max_strength])
    .range([margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle, height - margin.bottom]);



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
      .attr("x", -(margin.top + (height - margin.top - margin.bottom) / 4 - margin.middle / 2))
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
    svg_nucl.selectAll("nucleotide-incl-bar")
      .data(Object.entries(data.inclusion))
      .enter()
      .append("rect")
      .attr("class", function (d) { return "obj incl pos_" + d[0].slice(4); })
      .attr("x", function (d) { return x(parseInt(d[0].slice(4))); })
      .attr("y", function (d) { return yIncl(d[1]); })
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return Math.abs(yIncl(0) - yIncl(d[1])); })
      .attr("fill", barColor)
      .attr("stroke", inclusion_highlight_color)
      .style("stroke-width", "2px") // Add px and !important if necessary
      .attr("opacity", .1)


      .lower()
      .on("click", function (d) {
        d3.selectAll(".obj.incl")
          .style("fill", inclusion_color)
          .attr("opacity", 0.1)
          .classed("free", true);
        d3.selectAll(".obj.skip")
          .style("fill", skipping_color)
          .attr("opacity", 0.1)

          .classed("free", true);
        d3.selectAll(".obj.nt")
          .style("font-weight", "normal")
          .classed("free", true);

        var pos = d3.select(this)
          .attr("class")
          .slice(9, -4);
        d3.select(".obj.incl.free." + pos)
          .style("fill", inclusion_highlight_color)
          .attr("opacity", 1)
          .classed("free", false);
        d3.select(".obj.skip.free." + pos)
          .style("fill", skipping_highlight_color)
          .attr("opacity", 1)

          .classed("free", false);
        d3.select(".obj.nt." + pos)
          .style("font-weight", "bold")
          .classed("free", false);
        var position = d3.select(this).attr("class").split(" ")[2].split('_')[1]
        console.log(d3.select(this).attr("class").split(" ")[2])
        getFeaturesForPosition(position, data)
        nucleotideSort(position, data, margin, 250, 450, colors);
        nucleotideZoom(data, sequence, structs, position, margin, 250, 450, max_strength, colors);
      });
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

    svg_nucl.append("text")
      .attr("class", "ylabel_skip")
      .attr("text-anchor", "middle")
      .attr("x", -(margin.top / 2 + (height - margin.top - margin.bottom) / 4 + margin.middle / 2 + height / 2 - margin.bottom / 2))
      .attr("y", margin.left)
      .attr("dy", "-2.25em")
      .attr("font-size", `${12 * heightRatio}px`)
      .attr("transform", "rotate(-90)")
      .text("Strength (a.u.)");

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
    svg_nucl.selectAll("nucleotide-skip-bar")
      .data(Object.entries(data.skipping))
      .enter()
      .append("rect")
      .attr("class", function (d) { return "obj skip pos_" + d[0].slice(4); })
      .attr("x", function (d) { return x(parseInt(d[0].slice(4))); })
      .attr("y", margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle)
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return ySkip(d[1]) - (margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle); })
      .attr("fill", barColor)
      .attr("stroke", lineHighlightColor)
      .style("stroke-width", "2px") // Add px and !important if necessary
      .attr("opacity", .1) // Adjust opacity as needed

      .lower()
      .on("click", function (d) {
        d3.selectAll(".obj.incl")
          .style("fill", inclusion_color)
          .attr("opacity", 0.1)
          .classed("free", true);
        d3.selectAll(".obj.skip")
          .style("fill", skipping_color)
          .attr("opacity", 0.1)

          .classed("free", true);
        d3.selectAll(".obj.nt")
          .style("font-weight", "normal")
          .classed("free", true);

        var pos = d3.select(this)
          .attr("class")
          .slice(9, -4);
        d3.select(".obj.incl.free." + pos)
          .style("fill", inclusion_highlight_color)
          .attr("opacity", 1)
          .classed("free", false);
        d3.select(".obj.skip.free." + pos)
          .style("fill", skipping_highlight_color)
          .attr("opacity", 1)

          .classed("free", false);
        d3.select(".obj.nt." + pos)
          .style("font-weight", "bold")
          .classed("free", false);
        var position = d3.select(this).attr("class").split(" ")[2].split('_')[1]
        console.log(d3.select(this).attr("class").split(" ")[2])
        getFeaturesForPosition(position, data)
        nucleotideSort(position, data, margin, 250, 450, colors);
        nucleotideZoom(data, sequence, structs, position, margin, 250, 450, max_strength, colors);
      });
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
}

function nucleotideComparisonGrid(data, svg_name, classSelected = null) {
  var exon_length = data.sequence.length - 10 * 2;
  var sequence = data.sequence;
  var structs = data.structs;
  var dataIncl = data.inclusion;
  var dataSkip = data.skipping;

  svg = d3.select(svg_name)
  svg.selectAll("*").remove();

  const svgContainer = d3.select(svg_name); // Ensure you have a container with this class
  const width = svgContainer.node().clientWidth;
  const height = svgContainer.node().clientHeight;
  const heightRatio = height / 400;
  const widthRatio = width / 1000;

  var margin = { top: 10, right: 10, bottom: 10, left: 20, middle: 22 };
  var svg_nucl = d3.select(svg_name);
  // Title

  // Add X axis
  var positions = Array.from(new Array(sequence.length + 1), (x, i) => i + 1);
  var x = d3.scaleBand()
    .range([margin.left, (width - margin.right)])
    .domain(positions)
    .paddingInner(0.2)
    .paddingOuter(0.25);

  var xInclAxis = d3.axisBottom(x)
    .tickSize(1)
    .tickFormat(function (d) {
      return "";
    });

  var xSkipAxis = d3.axisTop(x)
    .tickSize(1 * heightRatio)
    .tickFormat(function (d) {
      return "";
    });

  var xNuAxis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat(function (d) {
      return "";
    });
  var gxIncl = svg_nucl.append("g")
    .attr("class", "x axis")
    .attr("font-size", `${10 * heightRatio}px`)
    .attr("opacity", 0)
    .attr("transform", "translate(0," + (margin.top + 21 + (height - margin.top - margin.bottom) / 2 - margin.middle) + ")")
    .call(xInclAxis);

  var gxSkip = svg_nucl.append("g")
    .attr("class", "x axis")
    .attr("font-size", `${10 * heightRatio}px`)
    // .attr("opacity", 0)
    .attr("transform", "translate(0," + (margin.top - 20 + (height - margin.top - margin.bottom) / 2 + margin.middle) + ")")
    .call(xSkipAxis);

  var gxNu = svg_nucl.append("g")
    .attr("class", "x axis")
    .attr("font-size", `${40 * heightRatio}px`)
    .attr("transform", "translate(0," + (margin.top + (height - margin.top - margin.bottom) / 2 - 5) + ")")
    .call(xNuAxis)

  var colors = [skipping_color, skipping_highlight_color, inclusion_color, inclusion_highlight_color]

  gxNu.selectAll("path")
    .style("stroke-width", 0);
  gxNu.selectAll(".tick")
    .each(function (d, i) {
      d3.select(this)
        .select("text")
        .attr("font-size", `${12 * widthRatio}px`)
        .attr("fill", (d <= flanking_length || d > flanking_length + exon_length) ? line_color : nucleotide_color)
    });
  gxNu.selectAll('.tick text').style("font-size", "6px");

  gxSkip.selectAll('.tick text').style("font-size", "6px");
  gxIncl.selectAll('.tick text').style("font-size", "6px");
  var max_incl = d3.max(Object.values(data.inclusion));
  var max_skip = d3.max(Object.values(data.skipping));
  console.log("Max inclusion strength:", max_incl);
  console.log("Max skipping strength:", max_skip);

  var max_strength = d3.max([max_incl, max_skip]);

  var yIncl = d3.scaleLinear()
    .domain([0, max_strength])
    .range([margin.top + 21 + (height - margin.top - margin.bottom) / 2 - margin.middle, margin.top]);
  var ySkip = d3.scaleLinear()
    .domain([0, max_strength])
    .range([margin.top - 18 + (height - margin.top - margin.bottom) / 2 + margin.middle, height - margin.bottom]);



  const InclusionAxis = (color = false) => {
    const barColor = color ? lightOther : inclusion_color;
    const barHighlightColor = color ? darkBackground : inclusion_highlight_color;
    const lineColor = color ? lightOther : inclusion_color;
    const lineHighlightColor = color ? darkBackground : inclusion_highlight_color;

    // var gyIncl = svg_nucl.append("g")
    //   .attr("class", "y axis")
    //   .attr("transform", "translate(" + margin.left + ",0)")
    //   .attr("font-size", `${12 * heightRatio}px`)
    // gyIncl.call(d3.axisLeft(yIncl).ticks(4));

    // svg_nucl.append("text")
    //   .attr("class", "ylabel_inclusion")
    //   .attr("text-anchor", "middle")
    //   .attr("x", -(margin.top + (height - margin.top - margin.bottom) / 4 - margin.middle / 2))
    //   .attr("y", margin.left)
    //   .attr("dy", "-2.25em")
    //   .attr("font-size", `${12 * heightRatio}px`)
    //   .attr("transform", "rotate(-90)")
    //   .text("Inclusion strength (a.u.)");
    var extendedData = [];
    Object.entries(dataIncl).forEach(function (d, i, arr) {
      var xValue = parseInt(d[0].slice(4));
      extendedData.push([xValue, d[1]]);
      if (i < arr.length - 1) {
        extendedData.push([xValue + 1, d[1]]);
      } else {
        // Add twoxtra points to close the path
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

    // // Draw the bars
    // svg_nucl.selectAll("nucleotide-incl-bar")
    //   .data(Object.entries(data.inclusion))
    //   .enter()
    //   .append("rect")
    //   .attr("class", function (d) { return "obj incl pos_" + d[0].slice(4); })
    //   .attr("x", function (d) { return x(parseInt(d[0].slice(4))); })
    //   .attr("y", function (d) { return yIncl(d[1]); })
    //   .attr("width", x.bandwidth())
    //   .attr("height", function (d) { return Math.abs(yIncl(0) - yIncl(d[1])); })
    //   .attr("fill", barColor)
    //   .attr("stroke", inclusion_highlight_color)
    //   .style("stroke-width", "2px") // Add px and !important if necessary
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
    //     console.log(d3.select(this).attr("class").split(" ")[2])
    //     getFeaturesForPosition(position, data)
    //     nucleotideSort(position, data, margin, 250, 450, colors);
    //     nucleotideZoom(data, sequence, structs, position, margin, 250, 450, max_strength, colors);
    //   });
  }

  const SkipAxis = (color = false) => {
    const lineColor = color ? lightOther : skipping_color;
    const lineHighlightColor = color ? darkBackground : skipping_highlight_color;

    const barColor = color ? lightOther : skipping_color;
    const barHighlightColor = color ? darkBackground : skipping_highlight_color;

    // var gySkip = svg_nucl.append("g")
    //   .attr("class", "y axis")
    //   .attr("font-size", `${12 * heightRatio}px`)
    //   .attr("transform", "translate(" + margin.left + ",0)");
    // gySkip.call(d3.axisLeft(ySkip).ticks(4));

    // svg_nucl.append("text")
    //   .attr("class", "ylabel_skip")
    //   .attr("text-anchor", "middle")
    //   .attr("x", -(margin.top / 2 + (height - margin.top - margin.bottom) / 4 + margin.middle / 2 + height / 2 - margin.bottom / 2))
    //   .attr("y", margin.left)
    //   .attr("dy", "-2.25em")
    //   .attr("font-size", `${12 * heightRatio}px`)
    //   .attr("transform", "rotate(-90)")
    //   .text("Skipping strength (a.u.)");

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

    // The rest of the code remains the same
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
      .style("stroke-width", "2px");
    // // Draw the bars
    // svg_nucl.selectAll("nucleotide-skip-bar")
    //   .data(Object.entries(data.skipping))
    //   .enter()
    //   .append("rect")
    //   .attr("class", function (d) { return "obj skip pos_" + d[0].slice(4); })
    //   .attr("x", function (d) { return x(parseInt(d[0].slice(4))); })
    //   .attr("y", margin.top -15+ (height - margin.top - margin.bottom) / 2 + margin.middle)
    //   .attr("width", x.bandwidth())
    //   .attr("height", function (d) { return ySkip(d[1]) - (margin.top  + (height - margin.top - margin.bottom) / 2 + margin.middle); })
    //   .attr("fill", barColor)
    //   .attr("stroke", lineHighlightColor)
    //   .style("stroke-width", "2px") // Add px and !important if necessary
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
    //     console.log(d3.select(this).attr("class").split(" ")[2])
    //     getFeaturesForPosition(position, data)
    //     nucleotideSort(position, data, margin, 250, 450, colors);
    //     nucleotideZoom(data, sequence, structs, position, margin, 250, 450, max_strength, colors);
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
}