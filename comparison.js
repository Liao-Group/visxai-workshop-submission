// function nucleotideComparison(data, comparison, classSelected = null) {
//   var sequence = data.sequence;
//   var structs = data.structs;
//   var dataIncl = data.nucleotide_activations.children[0].children;
//   var dataSkip = data.nucleotide_activations.children[1].children;

//   // Check if comparison data exists and has the expected structure
//   var compIncl = comparison && comparison.nucleotide_activations && 
//                  comparison.nucleotide_activations.children && 
//                  comparison.nucleotide_activations.children[0] ? 
//                  comparison.nucleotide_activations.children[0].children : null;
//   var compSkip = comparison && comparison.nucleotide_activations && 
//                  comparison.nucleotide_activations.children && 
//                  comparison.nucleotide_activations.children[1] ? 
//                  comparison.nucleotide_activations.children[1].children : null;
//   const svgContainer = d3.select(".nucleotide-view");
//   const width = svgContainer.node().clientWidth;
//   const height = 400
//   const heightRatio = height / 400;
//   const widthRatio = width / 1000;

//   var margin = { top: 30, right: 10, bottom: 20, left: 50, middle: 22 };
//   var svg_nucl = d3.select(".nucleotide-comp").attr("width", width)
//     .attr("height", height);

//   // Title
//   svg_nucl.append("text")
//     .attr("x", width / 2)
//     .attr("y", margin.top / 2 + 5)
//     .attr("text-anchor", "middle")
//     .style('font-size', `${14 * widthRatio}px`)
//     .text(compIncl && compSkip ? "Exon View Comparison" : "Exon View");

//   // Add X axis
//   var positions = Array.from(new Array(sequence.length), (x, i) => i + 1);
//   var x = d3.scaleBand()
//     .range([margin.left, (width - margin.right)])
//     .domain(positions)
//     .paddingInner(0.2)
//     .paddingOuter(0.25);

//   var xInclAxis = d3.axisBottom(x)
//     .tickSize(2 * widthRatio)
//     .tickFormat(function (d) {
//       if ((d - flanking_length) % 10 == 0 ) {
//         return d - flanking_length;
//       } else { return "" };
//       return Array.from(structs)[d - 1];
//     });
//   var xSkipAxis = d3.axisTop(x)
//     .tickSize(2 * widthRatio)
//     .tickFormat(function (d) {
//       return Array.from(structs)[d - 1];
//     });
//   var xNuAxis = d3.axisBottom(x)
//     .tickSize(0)
//     .tickFormat(function (d) {
//       return Array.from(sequence)[d - 1];
//     });
//   var gxIncl = svg_nucl.append("g")
//     .attr("class", "x axis")
//     .attr("font-size", `${12 * heightRatio}px`)
//     .attr("transform", "translate(0," + (margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle) + ")")
//     .call(xInclAxis);
//   var gxSkip = svg_nucl.append("g")
//     .attr("class", "x axis")
//     .attr("font-size", `${12 * heightRatio}px`)
//     .attr("transform", "translate(0," + (margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle) + ")")
//     .call(xSkipAxis);
//   var gxNu = svg_nucl.append("g")
//     .attr("class", "x axis")
//     .attr("font-size", `${12 * heightRatio}px`)
//     .attr("transform", "translate(0," + (margin.top + (height - margin.top - margin.bottom) / 2 - 5) + ")")
//     .call(xNuAxis)

//   gxNu.call(xNuAxis)
//     .selectAll('.tick')
//     .style("cursor", "pointer");

//   gxNu.selectAll("path")
//     .style("stroke-width", 0);
//   gxNu.selectAll(".tick")
//     .each(function (d, i) {
//       d3.select(this)
//         .select("text")
//         .attr("font-size", `${12 * widthRatio}px`)
//         .attr("fill", (d <= flanking_length || d > flanking_length + exon_length) ? line_color : nucleotide_color)
//     });

//   // Add Y axis
//   var max_incl = d3.max(compIncl ? 
//       [...dataIncl, ...compIncl].map(recursive_total_strength) : 
//       dataIncl.map(recursive_total_strength));
//   var max_skip = d3.max(compSkip ? 
//       [...dataSkip, ...compSkip].map(recursive_total_strength) : 
//       dataSkip.map(recursive_total_strength));

//   var yIncl = d3.scaleLinear()
//     .domain([0, max_incl])
//     .range([margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle, margin.top]);
//   var ySkip = d3.scaleLinear()
//     .domain([0, max_skip])
//     .range([margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle, height - margin.bottom]);

//   const InclusionAxis = (color = false) => {
//     const barColor = color ? lightOther : inclusion_color;
//     const barHighlightColor = color ? darkBackground : inclusion_highlight_color;

//     var gyIncl = svg_nucl.append("g")
//       .attr("class", "y axis")
//       .attr("transform", "translate(" + margin.left + ",0)")
//       .attr("font-size", `${12 * heightRatio}px`)
//     gyIncl.call(d3.axisLeft(yIncl).ticks(4));

//     svg_nucl.append("text")
//       .attr("class", "ylabel_inclusion")
//       .attr("text-anchor", "middle")
//       .attr("x", -(margin.top + (height - margin.top - margin.bottom) / 4 - margin.middle / 2))
//       .attr("y", margin.left)
//       .attr("dy", "-2.25em")
//       .attr("font-size", `${12 * heightRatio}px`)
//       .attr("transform", "rotate(-90)")
//       .text("Inclusion strength (a.u.)");

//     // Original data bars
//     svg_nucl.selectAll("nucleotide-incl-bar-original")
//       .data(dataIncl)
//       .enter()
//       .append("rect")
//       .datum(function (d) { return d; })
//       .attr("class", function (d) { return "obj incl original pos_" + d.name.slice(4); })
//       .attr("x", function (d) { return x(parseInt(d.name.slice(4))) + (compIncl ? 0 : x.bandwidth() / 4); })
//       .attr("y", function (d) { return yIncl(recursive_total_strength(d)); })
//       .attr("width", x.bandwidth() )
//       .attr("height", function (d) { return (margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle) - yIncl(recursive_total_strength(d)); })
//       .attr("fill", color ? lightOther : inclusion_color)
//       .attr("stroke", line_color)
//       .attr("opacity", 0.7)
//       .lower();

//     // Comparison data bars (only if comparison data exists)
//     if (compIncl) {
//       svg_nucl.selectAll("nucleotide-incl-bar-comparison")
//         .data(compIncl)
//         .enter()
//         .append("rect")
//         .datum(function (d) { return d; })
//         .attr("class", function (d) { return "obj incl comparison pos_" + d.name.slice(4); })
//         .attr("x", function (d) { return x(parseInt(d.name.slice(4))); })
//         .attr("y", function (d) { return yIncl(recursive_total_strength(d)); })
//         .attr("width", x.bandwidth())
//         .attr("height", function (d) { return (margin.top + (height - margin.top - margin.bottom) / 2 - margin.middle) - yIncl(recursive_total_strength(d)); })
//         .attr("fill", color ? darkBackground : inclusion_highlight_color)
//         .attr("stroke", line_color)
//         .attr("opacity", 0.7)
//         .lower();
//     }
//   }

//   const SkipAxis = (color = false) => {
//     const barColor = color ? lightOther : skipping_color;
//     const barHighlightColor = color ? darkBackground : skipping_highlight_color;

//     var gySkip = svg_nucl.append("g")
//       .attr("class", "y axis")
//       .attr("font-size", `${12 * heightRatio}px`)
//       .attr("transform", "translate(" + margin.left + ",0)");
//     gySkip.call(d3.axisLeft(ySkip).ticks(4));

//     svg_nucl.append("text")
//       .attr("class", "ylabel_skip")
//       .attr("text-anchor", "middle")
//       .attr("x", -(margin.top / 2 + (height - margin.top - margin.bottom) / 4 + margin.middle / 2 + height / 2 - margin.bottom / 2))
//       .attr("y", margin.left)
//       .attr("dy", "-2.25em")
//       .attr("font-size", `${12 * heightRatio}px`)
//       .attr("transform", "rotate(-90)")
//       .text("Skipping strength (a.u.)");

//     // Original data bars
//     svg_nucl.selectAll("nucleotide-skip-bar-original")
//       .data(dataSkip)
//       .enter()
//       .append("rect")
//       .datum(function (d) { return d; })
//       .attr("class", function (d) { return "obj skip original pos_" + d.name.slice(4); })
//       .attr("x", function (d) { return x(parseInt(d.name.slice(4))) + (compSkip ? 0 : x.bandwidth() / 2); })
//       .attr("y", (margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle))
//       .attr("width", x.bandwidth())
//       .attr("height", function (d) { return ySkip(recursive_total_strength(d)) - (margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle); })
//       .attr("fill", color ? lightOther : skipping_color)
//       .attr("stroke", line_color)
//       .attr("opacity", 0.7)
//       .lower();

//     // Comparison data bars (only if comparison data exists)
//     if (compSkip) {
//       svg_nucl.selectAll("nucleotide-skip-bar-comparison")
//         .data(compSkip)
//         .enter()
//         .append("rect")
//         .datum(function (d) { return d; })
//         .attr("class", function (d) { return "obj skip comparison pos_" + d.name.slice(4); })
//         .attr("x", function (d) { return x(parseInt(d.name.slice(4))); })
//         .attr("y", (margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle))
//         .attr("width", x.bandwidth())
//         .attr("height", function (d) { return ySkip(recursive_total_strength(d)) - (margin.top + (height - margin.top - margin.bottom) / 2 + margin.middle); })
//         .attr("fill", color ? darkBackground : skipping_highlight_color)
//         .attr("stroke", line_color)
//         .attr("opacity", 0.7)
//         .lower();
//     }
//   };

//   if (classSelected === "incl") {
//     InclusionAxis()
//     SkipAxis(true)
//   } else if (classSelected === "skip") {
//     SkipAxis()
//     InclusionAxis(true)
//   } else {
//     InclusionAxis()
//     SkipAxis()
//   }

//   return svg_nucl
// }

function nucleotideComparison(data, comparison, classSelected = null) {
  var sequence = data.sequence;
  var structs = data.structs;
  var dataIncl = data.nucleotide_activations.children[0].children;
  var dataSkip = data.nucleotide_activations.children[1].children;

  // Check if comparison data exists and has the expected structure
  var compIncl = comparison && comparison.nucleotide_activations &&
    comparison.nucleotide_activations.children &&
    comparison.nucleotide_activations.children[0] ?
    comparison.nucleotide_activations.children[0].children : null;
  var compSkip = comparison && comparison.nucleotide_activations &&
    comparison.nucleotide_activations.children &&
    comparison.nucleotide_activations.children[1] ?
    comparison.nucleotide_activations.children[1].children : null;

  const svgContainer = d3.select(".nucleotide-view");
  const width = svgContainer.node().clientWidth;
  const height = 400

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

  //  Add X axis
  var positions = Array.from(new Array(sequence.length), (x, i) => i + 1);
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

  gxNu.call(xNuAxis)
    .selectAll('.tick')
    .style("cursor", "pointer");

  gxNu.selectAll("path")
    .style("stroke-width", 0);
  gxNu.selectAll(".tick")
    .each(function (d, i) {
      d3.select(this)
        .select("text")
        .attr("font-size", `${12 * widthRatio}px`)
        .attr("fill", (d <= flanking_length || d > flanking_length + exon_length) ? line_color : nucleotide_color)
    });

  // Add Y axis
  var max_incl = d3.max(compIncl ?
    [...dataIncl, ...compIncl].map(recursive_total_strength) :
    dataIncl.map(recursive_total_strength));
  var max_skip = d3.max(compSkip ?
    [...dataSkip, ...compSkip].map(recursive_total_strength) :
    dataSkip.map(recursive_total_strength));

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
      .x(function (d) { return x(parseInt(d.name.slice(4))); })
      .y(function (d) { return yIncl(recursive_total_strength(d)); });

    svg_nucl.append("path")
      .datum(dataIncl)
      .attr("class", "line incl original")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 2);

    // Comparison data line (only if comparison data exists)
    if (compIncl) {
      svg_nucl.append("path")
        .datum(compIncl)
        .attr("class", "line incl comparison")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", lineHighlightColor)
        .attr("stroke-width", 2);
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

    // Original data line
    var line = d3.line()
      .x(function (d) { return x(parseInt(d.name.slice(4))); })
      .y(function (d) { return ySkip(recursive_total_strength(d)); });

    svg_nucl.append("path")
      .datum(dataSkip)
      .attr("class", "line skip original")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 2);

    // Comparison data line (only if comparison data exists)
    if (compSkip) {
      svg_nucl.append("path")
        .datum(compSkip)
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

  return svg_nucl
}