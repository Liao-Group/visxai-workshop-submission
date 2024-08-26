
var exon_s1_data = []

/**
 * Recursively calculates the total strength of a nested data structure.
 * @param {Object} data - The nested data object.
 * @returns {number} The total strength of the data and its children.
 */
function recursive_total_strength(data) {
  if (!("children" in data)) { return data.strength; }
  else { return d3.sum(d3.map(data["children"], recursive_total_strength).keys()) }
}

/**
 * Flattens a nested JSON structure into a single-level array of objects.
 * @param {Object} data - The nested JSON object.
 * @returns {Array} An array of flattened objects with combined names, strengths, and lengths.
 */
function flatten_nested_json(data) {
  if (!("children" in data)) { return [data]; }

  var result = [];

  data.children.forEach(function (child) {
    var grandchildren = flatten_nested_json(child);

    grandchildren.forEach(function (grandchild) {
      result.push({
        "name": data.name + " " + grandchild.name,
        "strength": grandchild.strength,
        "length": grandchild.length
      });
    });
  });

  return result;
}
// Clip the sequence by removing `clipLength` nucleotides from each end
function clipSequence(sequence, clipLength = 5) {
  return sequence.slice(clipLength, -clipLength);
}

// Clip the struct by removing `clipLength` positions from each end
function clipStructure(struct, clipLength = 5) {
  return struct.slice(clipLength, -clipLength);
}

// Filter and adjust nucleotide positions
function filterNucleotidePositions(children, clipLength, sequenceLength) {
  return children.filter(child => {
      if (child.children) {
          child.children = filterNucleotidePositions(child.children, clipLength, sequenceLength);
      }

      if (child.name.startsWith('pos_')) {
          const position = parseInt(child.name.split('_')[1]);
          if (clipLength - 1 < position && position <= (sequenceLength - clipLength * 2)) {
              const adjustedPosition = position - clipLength;
              child.name = `pos_${adjustedPosition}`;
              return true;
          }
          return false;
      }
      return true;
  });
}

// Adjust the nucleotide activations after clipping
function adjustedNucleotideActivations(data, sequenceLength, clipLength = 5) {
  data.children = filterNucleotidePositions(data.children, clipLength, sequenceLength);
  return data;
}

// Adjust the feature activations after clipping
function adjustedFeatureActivations(activations, sequenceLength, clipLength = 5) {
  function filterPositions(children, clipLength, sequenceLength) {
      return children.filter(child => {
          if (child.children) {
              child.children = filterPositions(child.children, clipLength, sequenceLength);
          }

          if (child.name.startsWith('pos_')) {
              const position = parseInt(child.name.split('_')[1]);
              console.log(`Processing ${child.name} with position ${position}`); // Debugging line
              if (clipLength - 1 < position && position <= (sequenceLength - clipLength * 2)) {
                  const adjustedPosition = position - clipLength;
                  child.name = `pos_${adjustedPosition}`;
                  return true;
              } else {
                  console.log(`Excluding ${child.name} with position ${position}`); // Debugging line
                  return false;
              }
          }
          return true;
      });
  }

  activations.children = filterPositions(activations.children, clipLength, sequenceLength);
  return activations;
}

// Main function to clip the exon data
function clipExon(data) {
  data.feature_activations = adjustedFeatureActivations(data.feature_activations, data.sequence.length, 5);
  data.nucleotide_activations = adjustedNucleotideActivations(data.nucleotide_activations, data.sequence.length, 5);
  data.sequence = clipSequence(data.sequence);
  data.structs = clipStructure(data.structs);
  console.log(data.sequence);
  return data;
}

function getFillColor(input) {
  if (typeof input === "number") {
    return input === 1 ? skipping_color : inclusion_color;
  } else if (typeof input === "object" && input !== null) {
    if (input.data && typeof input.data === "object") {
      if (input.data.name === "skip" || input.data.name.split("_")[0] === "skip") {
        return skipping_color;
      } else {
        return inclusion_color;
      }
    } else if (input.name) {
      if (input.name === "skip" || input.name.split("_")[0] === "skip") {
        return skipping_color;
      } else {
        return inclusion_color;
      }
    }
  } else if (typeof input === "string") {
    if (input === "skip" || input.split("_")[0] === "skip") {
      return skipping_color;
    } else {
      return inclusion_color;
    }
  }
  return inclusion_color; // Default color if input format is not recognized
};

function getHighlightColor(input) {
  if (typeof input === "number") {
    return input === 1 ? skipping_highlight_color : inclusion_highlight_color;
  } else if (typeof input === "object" && input !== null) {
    if (input.data && typeof input.data === "object") {
      if (input.data.name === "skip" || input.data.name.split("_")[0] === "skip") {
        return skipping_highlight_color;
      } else {
        return inclusion_highlight_color;
      }
    } else if (input.name) {
      if (input.name === "skip" || input.name.split("_")[0] === "skip") {
        return skipping_highlight_color;
      } else {
        return inclusion_highlight_color;
      }
    }
  } else if (typeof input === "string") {
    if (input === "skip" || input.split("_")[0] === "skip") {
      return skipping_highlight_color;
    } else {
      return inclusion_highlight_color;
    }
  }
  return inclusion_highlight_color; // Default highlight color if input format is not recognized
};

function resetHighlight() {
  // Reset
  d3.select('div.feature-legend-container')
    .selectAll('rect.rectangle')
    .attr('fill', (d) => d.color);
  d3.select('div.feature-legend-container')
    .selectAll('.background')
    .style("fill", "none");

  d3.select('svg.feature-view-1')
    .selectAll(".bar").attr("fill", d => getFillColor(d));

  if (selectedBar !== null) {
    var color = null;
    var highlightColor = null;
    const className = d3.select(selectedBar).attr('class').split(' ')[1];
    d3.select('div.feature-legend-container')
      .select('rect.rectangle.' + className)
      .attr('fill', function (d) {
        color = d.color;
        highlightColor = d.highlight;
        return highlightColor;
      });
    d3.select('div.feature-legend-container')
      .selectAll('svg.feature-svg.' + className)
      .style("border", `2px solid ${highlightColor}`);
    d3.select('div.feature-legend-container')
      .selectAll('svg.feature-long-svg.' + className)
      .style("border", `2px solid ${highlightColor}`);
    d3.select(selectedBar).attr('fill', highlightColor);
    d3.select('svg.feature-view-2')
      .selectAll('.bar').attr('fill', color)
    if (selectedFeatureBar !== null) {
      const featureName = d3.select(selectedFeatureBar).attr('class').split(' ')[1];
      d3.select('div.feature-legend-container')
        .select('.background.' + featureName)
        .style("fill", color);
      d3.select(selectedFeatureBar).attr('fill', highlightColor);
    }
  }
}

let selected = null
let selectedClass = null
let previousClassColor = null

function featureSelection(featureName = null, className = null, features = []) {

  const gridContainer = document.querySelector('.feature-legend-container');
  const width = gridContainer.clientWidth;
  const height = gridContainer.clientHeight;
  const titleDiv = document.querySelector('.feature-legend-title'); // Select the title div
  const widthRatio = width / 491;
  const heightRatio = height / 381;
  titleDiv.style.fontSize = `${14 * widthRatio}px`;

  const legendInfo = [{ title: `Inclusion`, name: 'incl', color: inclusion_color, highlight: inclusion_highlight_color },
  { title: `Skipping`, name: 'skip', color: skipping_color, highlight: skipping_highlight_color }
  ];

  d3.select('.legend').selectAll("*").remove();
  // Append SVG to the legend div
  const svg = d3.select('.legend')
    .append('svg').attr('width', width)

  // Initialize legend
  const legendItemWidth = 100 * widthRatio;
  const legendItemHeight = 30 * widthRatio;
  const legendSpacing = 130;
  const xOffset = ((width - widthRatio) - (2 * legendItemWidth + legendSpacing)) / 2;
  const yOffset = 10;

  const legend = svg.selectAll('.legendItem')
    .data(legendInfo)
    .enter()
    .append('g')
    .attr('class', 'legendItem')
    .attr('transform', (d, i) => {
      var x = xOffset + (legendItemWidth + legendSpacing) * i; // Adjust x position for each legend item
      var y = yOffset;
      return `translate(${x}, ${y})`;
    });

  // Create legend color rectangles
  legend.append('rect')
    .attr('class', (d) => 'rectangle ' + d.name)
    .attr('width', legendItemWidth)
    .attr('height', legendItemHeight)
    .attr('rx', 4)
    .attr('ry', 4)
    .style("cursor", "pointer")
    .attr('fill', function (d) {
      if (className !== null && className === d.name) { return d.highlight; }
      else { return d.color; }
    })
    .on('click', function (event) {

    })
    .on('mouseover', function (d) {

    })
    .on('mouseout', function (d) {

    });

  // Create legend labels
  legend.append('text')
    .attr('x', legendItemWidth / 2)
    .attr('y', legendItemHeight / 2)
    .attr('dy', '0.15em')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style("cursor", "pointer")
    .style('font-size', `${13 * widthRatio}px`)
    .text(d => d.title);

  // Function to update SVGs with new data and highlight the selected feature
  const updateSVGs = (containerSelector, svgSelector, imagesArray, colors) => {
    const svgContainer = d3.select(containerSelector)
      .selectAll(svgSelector)
      .data(imagesArray, d => d.feature);

    const svgEnter = svgContainer.enter()
      .append("svg")
      .attr("class", d => `${svgSelector.slice(1)} ${d.feature} ${d.feature.split('_')[0]}`);

    svgEnter.append("rect").attr("class", (d) => "background " + d.feature);
    svgEnter.append("image");

    const svgMerged = svgEnter.merge(svgContainer);

    svgMerged.each(function (d) {
      const svg = d3.select(this);

      if (d.feature.split('_')[0] === className) {
        svg.style("border", `2px solid ${colors[1]}`);
      } else {
        svg.style("border", `2px solid ${colors[0]}`).style("box-shadow", "none");
      }

      const background = svg.select(".background")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", "100%")
        .attr("height", "100%")
        .style("fill", "none");

      try {
        if (d.feature === featureName) {
          background.style("fill", colors[0])
        }
        else {
          background.style("fill", "none");
        }
      } catch (error) {
        background.style("fill", "none");
      }

      if (svgSelector === ".feature-long-svg") {
        svg.select("image")
          .attr("xlink:href", d.url)
          .attr("preserveAspectRatio", "none")
          .attr("width", "100%") // Use percentage width
          .attr("height", "100%"); // Use percentage height
      } else {
        svg.select("image")
          .attr("xlink:href", d.url)
          .attr("preserveAspectRatio", "none")
          .attr("width", "100%") // Use percentage width
          .attr("height", "100%"); // Use percentage height
      }

      svg
      .style("cursor", "pointer")
      .on("mouseover", (event, data) => {
        background.style("fill", colors[0]);
      })
        .on("mouseleave", (event, data) => {
            if (selectedFeatureBar === null) {
              d3.selectAll('.background').style('fill', 'none');
            }else{
              d3.selectAll('.background').style('fill', 'none');
              d3.select('.background.' +selectedFeatureBar).style('fill', colors[0]);
            }
          // }
        }).on("click", (event, info) => {
          d3.selectAll('.background').style('fill', 'none');
          background.style("fill", colors[0]);
          selectedFeatureBar = info.feature
          if (Data) {
            d3.selectAll(".line incl original").remove();
            // d3.select("svg.nucleotide-view").select('line incl original').remove();

            nucleotideFeatureView(exon_s1_data, exon_s1_data.feature_activations, d.feature);
          }

        });
    });

    svgContainer.exit().remove();
  };

  // Update SVGs for inclusion images
  updateSVGs("div.svg-grid-inclusion", ".feature-svg", newImagesData.inclusion, [inclusion_color, inclusion_highlight_color]);

  // Update SVGs for skipping images
  updateSVGs("div.svg-grid-skipping", ".feature-svg", newImagesData.skipping, [skipping_color, skipping_highlight_color]);

  // Update SVGs for long skipping images
  updateSVGs("div.svg-grid-long-skipping", ".feature-long-svg", newImagesData.longSkipping, [skipping_color, skipping_highlight_color]);
}

function highlightLogos(listOfLogos = []) {
  d3.select('div.feature-legend-container')
    .selectAll('.background')
    .style("fill", 'none');
  listOfLogos.forEach(logo => {
    const fillColor = getFillColor(logo);
    // const highlightColor = getHighlightColor(logo);  // Uncomment if needed

    d3.select('div.feature-legend-container')
      .select('.background.' + logo)
      .style("fill", fillColor);
  });
}


document.addEventListener("DOMContentLoaded", function () {
  Promise.all([
      fetch('data/exon_s1_strengths_clipped.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }),
    fetch('data/exon_s1.json').then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
  ])
    .then(([data_clipped,data]) => {
      window.Data = data_clipped;
      exon_s1_data = clipExon(data);
      // Render data
      nucleotideView(Data.sequence, Data.structs, [data_clipped, data]);
      featureSelection(featureSelected = null, className = null)

    })
    .catch(error => {
      console.error("Failed to fetch or parse data:", error);
    });

    
});

document.addEventListener("DOMContentLoaded", function() {
  var replayButtonNucleotideView = document.getElementById("replayButtonNucleotideView");

  replayButtonNucleotideView.addEventListener("click", function() {
      nucleotideView(Data.sequence, Data.structs, Data);
      d3.selectAll('.background').style('fill', 'none');
      d3.selectAll('svg.nucleotide-sort')
      .attr('opacity', 0);
      d3.selectAll('svg.nucleotide-zoom')
      .attr('opacity', 0);

      selectedFeatureBar = null;
  });
});


// Author details
document.addEventListener('DOMContentLoaded', () => {
  const authors = document.querySelectorAll('.author');

  authors.forEach((author, index) => {
    if (index < 2) {
      const tooltipText = author.getAttribute('data-tooltip');
      const tooltip = document.createElement('div');
      tooltip.classList.add('tooltip');
      tooltip.textContent = tooltipText;
      author.appendChild(tooltip);

      author.addEventListener('mouseover', () => {
        tooltip.style.display = 'block';
      });

      author.addEventListener('mouseout', () => {
        tooltip.style.display = 'none';
      });
    }
  });
});



