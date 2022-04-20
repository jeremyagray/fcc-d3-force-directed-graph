/**
 *
 * fcc-d3-force-directed-graph, fCC D3 Force Directed Graph Project
 *
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Copyright 2022 Jeremy A Gray <gray@flyquackswim.com>.
 *
 * All rights reserved.
 *
 */

d3.json('data.json').then((deps) => {
  // Dimensions.
  const dimensions = {
    height: 800,
    width: 1200,
    marginTop: 50,
    marginRight: 50,
    marginBottom: 50,
    marginLeft: 50,
  };

  dimensions.hCenter = dimensions.height / 2;
  dimensions.vCenter = dimensions.width / 2;

  // Tooltip.
  const tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('opacity', '0')
        .style('display', 'none')
        .style('visibility', 'hidden');

  // Construct the forces.
  const forceNode = d3.forceManyBody();
  const forceLink = d3.forceLink(deps.links).id((d) => {
    return d['dependency'];
  });

  const nodeStrength = -5;
  const linkStrength = 0.1;

  forceNode.strength(nodeStrength);
  forceLink.strength(linkStrength);

  const simulation = d3.forceSimulation(deps.nodes)
        .force("link", forceLink)
        .force("charge", forceNode)
        .force("center",  d3.forceCenter())
        .on("tick", ticked);

  // SVG canvas.
  const svg = d3.select("div#visualization")
        .append("svg")
        .attr("id", "canvas")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        .attr("viewBox", [-dimensions.width / 2, -dimensions.height / 2, dimensions.width, dimensions.height])
        .style('background-color', '#ffffff');

  const link = svg.append("g")
        .attr("stroke", '#ff0000')
        .attr("stroke-opacity", 100)
        .attr("stroke-width", 1)
        .attr("stroke-linecap", 'round')
        .selectAll("line")
        .data(deps.links)
        .join("line")
        .attr('class', 'link')
        .attr('data-source', (d) => {
          return d['source'];
        })
        .attr('data-target', (d) => {
          return d['target'];
        })
        .attr('data-links', (d) => {
          return d['links'];
        });

  const node = svg.append("g")
        .attr("fill", '#000000')
        .attr("stroke", '#000000')
        .attr("stroke-opacity", 100)
        .attr("stroke-width", 1)
        .selectAll("circle")
        .data(deps.nodes)
        .join("circle")
        .attr('class', 'node')
        .attr("r", 5)
        .attr('data-dependency', (d) => {
          return d['dependency'];
        })
        .on('mouseenter mouseover', (event, datum) =>
          {
            tooltip
	      .style('display', 'inline')
              .style('position', 'absolute')
              .style('width', '250px')
              .style('height', '50px')
	      .style('visibility', 'visible')
	      .style('opacity', '0.75')
	      .style('background-color', '#590000')
	      .style('color', '#ffffff')
              .style('left', (event.pageX + 20) + 'px')
              .style('top', (event.pageY + 20) + 'px')
	      .attr('data-dependency', datum['dependency'])
	      .html(`<p>${datum['dependency']}<\/p>`);
          })
        .on('mousemove', (event, datum) =>
          {
            tooltip
              .style('left', (event.pageX + 20) + 'px')
              .style('top', (event.pageY + 20) + 'px');
          })
        .on('mouseout mouseleave', (event, datum) =>
          {
            tooltip
              .style('opacity', '0')
	      .style('display', 'none')
	      .style('visibility', 'hidden');
          })
        .call(drag(simulation));

  function ticked() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }

  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
});
