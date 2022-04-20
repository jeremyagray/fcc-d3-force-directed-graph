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
  const div = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('opacity', '0')
        .style('display', 'none')
        .style('visibility', 'hidden');

  // SVG canvas.
  const svg = d3.select("div#visualization")
        .append("svg")
        .attr("id", "canvas")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        .style('background-color', '#005900');
});
