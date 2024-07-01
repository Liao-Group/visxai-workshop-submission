document.addEventListener('DOMContentLoaded', function() {
  const inclusion_color = "#c5d6fb";
  const inclusion_highlight_color = "#669aff";
  const skipping_color = "#f6c3c2";
  const skipping_highlight_color = "#ff6666";

  // Set up SVG
  const width = 800;
  const height = 400;
  const svg = d3.select('.neural-network')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

  // Define network structure
  const layers = [
      {name: 'input', neurons: 1},
      {name: 'hidden', neurons: 4},
      {name: 'summation', neurons: 2},
      {name: 'difference', neurons: 1},
      {name: 'output', neurons: 1}
  ];

  // Create scales for positioning
  const xScale = d3.scaleLinear()
      .domain([0, layers.length - 1])
      .range([100, width - 100]);

  const yScales = layers.map(layer => 
      d3.scaleLinear()
          .domain([0, layer.neurons - 1])
          .range([height/2 - (layer.neurons-1)*40, height/2 + (layer.neurons-1)*40])
  );

  // Function to create connections
  function createConnections() {
      let connections = [];
      for (let i = 0; i < layers.length - 1; i++) {
          for (let j = 0; j < layers[i].neurons; j++) {
              for (let k = 0; k < layers[i+1].neurons; k++) {
                  connections.push({
                      source: [i, j],
                      target: [i+1, k],
                      value: Math.random(),
                      type: Math.random() > 0.5 ? 'inclusion' : 'skipping'
                  });
              }
          }
      }
      return connections;
  }

  let connections = createConnections();

  // Draw connections
  const connectionPaths = svg.append('g')
      .selectAll('.connection')
      .data(connections)
      .enter().append('path')
      .attr('class', 'connection')
      .attr('d', d => {
          const sourceX = xScale(d.source[0]);
          const sourceY = yScales[d.source[0]](d.source[1]);
          const targetX = xScale(d.target[0]);
          const targetY = yScales[d.target[0]](d.target[1]);
          return `M${sourceX},${sourceY} C${(sourceX+targetX)/2},${sourceY} ${(sourceX+targetX)/2},${targetY} ${targetX},${targetY}`;
      })
      .attr('fill', 'none')
      .attr('stroke', d => d.type === 'inclusion' ? inclusion_color : skipping_color)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)');

  // Define arrowhead marker
  svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999')
      .style('stroke', 'none');

  // Draw neurons
  const neurons = svg.append('g')
      .selectAll('.neuron')
      .data(layers.flatMap((layer, i) => 
          d3.range(layer.neurons).map(j => ({x: i, y: j, layer: layer.name}))
      ))
      .enter().append('g')
      .attr('class', 'neuron')
      .attr('transform', d => {
          let x = xScale(d.x);
          if (d.layer === 'summation') {
              x = xScale(d.x) - 50;
          } else if (d.layer === 'difference') {
              x = xScale(d.x) - 25;
          }
          return `translate(${x},${yScales[d.x](d.y)})`;
      });
      neurons.attr('transform', d => {
        let x = xScale(d.x);
        let y = yScales[d.x](d.y);
        
        if (d.layer === 'summation') {
            x = xScale(d.x) - 50;
        } else if (d.layer === 'difference') {
            x = xScale(d.x);
            y = height / 2;  // Center the difference node vertically
        } else if (d.layer === 'output') {
            x = xScale(d.x) + 50;
        }
        
        return `translate(${x},${y})`;
    });
    

  neurons.each(function(d) {
      const node = d3.select(this);
      if (d.layer === 'input') {
          node.append('rect')
              .attr('width', 100)
              .attr('height', 60)
              .attr('x', -50)
              .attr('y', -30)
              .attr('fill', inclusion_color)
              .attr('rx', 10)
              .attr('ry', 10);
          node.append('text')
              .attr('text-anchor', 'middle')
              .attr('dominant-baseline', 'central')
              .attr('fill', 'black')
              .attr('font-size', '14px')
              .text('ACG...CGA');
          node.append('text')
              .attr('text-anchor', 'middle')
              .attr('dominant-baseline', 'central')
              .attr('fill', 'black')
              .attr('font-size', '12px')
              .attr('y', 20)
              .text('((…))');
      } else if (d.layer === 'hidden') {
          node.append('rect')
              .attr('width', 80)
              .attr('height', 40)
              .attr('x', -40)
              .attr('y', -20)
              .attr('fill', d.y % 2 === 0 ? inclusion_color : skipping_color)
              .attr('rx', 20)
              .attr('ry', 20);
      } else if (d.layer === 'summation' || d.layer === 'difference') {
          node.append('circle')
          .attr('x', -40)
          .attr('y', -20)
              .attr('r', 20)
              .attr('fill', d.layer === 'summation' ? inclusion_color : skipping_color);
          node.append('text')
              .attr('text-anchor', 'middle')
              .attr('dominant-baseline', 'central')
              .attr('font-size', '20px')
              .attr('font-weight', 'bold')
              .text(d.layer === 'summation' ? '+' : '-');
      } else if (d.layer === 'output') {
          node.append('circle')
              .attr('r', 20)
              .attr('fill', inclusion_color);
      }
  });

  // Add title
  svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .text('Interactive Neural Network Visualization')
      .attr('text-anchor', 'middle')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold');

  // Add interactivity
  neurons.on('mouseover', function(event, d) {
      d3.select(this).select('rect, circle')
          .transition()
          .duration(200)
          .attr('fill', d.layer === 'difference' || (d.layer === 'hidden' && d.y % 2 !== 0) ? skipping_highlight_color : inclusion_highlight_color);

      // Highlight connected neurons and connections
      connectionPaths
          .attr('stroke-width', conn => {
              if ((conn.source[0] === d.x && conn.source[1] === d.y) ||
                  (conn.target[0] === d.x && conn.target[1] === d.y)) {
                  return 4;
              }
              return 2;
          })
          .attr('stroke', conn => {
              if ((conn.source[0] === d.x && conn.source[1] === d.y) ||
                  (conn.target[0] === d.x && conn.target[1] === d.y)) {
                  return conn.type === 'inclusion' ? inclusion_highlight_color : skipping_highlight_color;
              }
              return conn.type === 'inclusion' ? inclusion_color : skipping_color;
          });

      // Show tooltip
      const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', 'white')
          .style('padding', '5px')
          .style('border', '1px solid black')
          .style('border-radius', '5px')
          .style('pointer-events', 'none')
          .style('opacity', 0);

      tooltip.transition()
          .duration(200)
          .style('opacity', .9);

      tooltip.html(`Layer: ${d.layer}, Neuron: ${d.y + 1}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
  })
  .on('mouseout', function(d) {
      d3.select(this).select('rect, circle')
          .transition()
          .duration(200)
          .attr('fill', function(d) {
              if (d.layer === 'input' || d.layer === 'output') return inclusion_color;
              if (d.layer === 'hidden') return d.y % 2 === 0 ? inclusion_color : skipping_color;
              if (d.layer === 'summation') return inclusion_color;
              if (d.layer === 'difference') return skipping_color;
          });

      connectionPaths
          .attr('stroke-width', 2)
          .attr('stroke', d => d.type === 'inclusion' ? inclusion_color : skipping_color);

      d3.select('.tooltip').remove();
  });

  // Add button to randomize connections
  d3.select('.neural-network')
      .append('button')
      .text('Randomize Connections')
      .on('click', () => {
          connections = createConnections();
          connectionPaths.data(connections)
              .transition()
              .duration(500)
              .attr('stroke', d => d.type === 'inclusion' ? inclusion_color : skipping_color);
      });
});