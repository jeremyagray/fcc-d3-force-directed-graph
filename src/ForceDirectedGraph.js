/**
 *
 * fcc-d3-force-directed-graph, fCC D3 Force Directed Graph Project
 *
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Copyright 2021-2022 Jeremy A Gray <gray@flyquackswim.com>.
 *
 * All rights reserved.
 *
 */

// React.
import {
  useEffect,
  useRef,
  useState,
  forwardRef
} from 'react';
import React from 'react';

import axios from 'axios';

// D3.
import * as d3 from 'd3';

// Hooks.
import { useChartDimensionsWithRef } from './hooks/useChartDimensions';
import { useChartDimensions } from './hooks/useChartDimensions';
import useFetchData from './hooks/useFetchData';

// Components.
import LoadingError from './LoadingError';
import LoadingSpinner from './LoadingSpinner';


function ForceDirectedGraph() {
  return (
    <div id="visualization">
      <ForceDirectedGraphSVG />
    </div>
  );
}

function ForceDirectedGraphSVG() {
  // Refs.
  const ref = useRef();

  // Data state.
  const [data, setData] = useState({'nodes': [{'dependency': ''}], 'links': []});
  const [loadingData, setLoadingData] = useState(true);
  const [loadingDataError, setLoadingDataError] = useState(null);

  useEffect(() => {
    const dataURL = 'data.json';
    let isMounted = true;
    setLoadingData(true);

    async function fetchData() {
      try {
        const response = await axios.get(dataURL);
        if (isMounted) {
          setData(response.data);
          setLoadingData(false);
          generateForceDirectedGraph(data, ref.current);
        }
      } catch (error) {
        if (isMounted) {
          setLoadingDataError(error.message);
          setLoadingData(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.nodes[0].dependency]);

  if (loadingData) {
    return (
      <div>
        <p>
          Loading dependency data...
        </p>
      </div>
    );
  } else if (loadingDataError) {
    return (
      <div>
        <p>
          Error loading data:  {loadingDataError}
        </p>
      </div>
    );
  } else {
    return (
      <div
        ref={ref}
      />
    );
  }
}

export default ForceDirectedGraph;

function generateForceDirectedGraph(deps, element, dimensions = {
  height: 800,
  width: 1200,
  marginTop: 50,
  marginRight: 50,
  marginBottom: 50,
  marginLeft: 50,
}) {
  // Tooltip.
  const tooltip = d3.select(element)
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
  const svg = d3.select(element)
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
}
