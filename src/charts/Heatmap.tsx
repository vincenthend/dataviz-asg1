import React, { useCallback } from 'react';
import { DataType } from '../types';
import { useD3 } from '../hooks/useD3';
import type d3 from 'd3';
import { AGE_GROUP_ORDER, YEAR_ORDER } from '../constants';
import './styles.css';

interface Props {
  data: DataType[];
}

interface GroupData {
  x: number;
  y: number;
  value: number;
}

function Heatmap(props: Props) {
  const { data: _data } = props;
  const [svgRef, updateSvg] = useD3();

  // Function to initialize the heatmap
  const initHeatmap = useCallback(
    async (
      d3Instance: typeof d3,
      svgElement: SVGElement,
    ): Promise<SVGElement> => {
      // Process Data
      const data = _data.reduce(
        (acc, curr) => {
          if (!acc[curr.year]) {
            acc[curr.year] = {};
          }
          acc[curr.year][curr.age_group] = {
            y: AGE_GROUP_ORDER[curr.age_group] as number,
            x: YEAR_ORDER[curr.year] as number,
            value:
              (acc[curr.year][curr.age_group]?.value ?? 0) +
              curr.no_of_drug_abusers,
          };

          return acc;
        },
        {} as Record<string, Record<string, GroupData>>,
      );

      const dataFlat = Object.values(data)
        .map((x) => Object.values(x))
        .flat();

      svgElement.innerHTML = '';

      // Generate SVG
      const width = 1500;
      const height = 450;
      const cellSize = 60;

      const labelWidth = 75;

      function getXPos(x): number {
        return (x % Math.ceil(width / cellSize)) * cellSize + labelWidth;
      }

      function getYPos(y: number): number {
        return y * cellSize;
      }

      const svg = d3Instance
        .select(svgElement)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      // Create a color scale
      const colorScale = d3Instance
        .scaleSequential(d3Instance.interpolateViridis)
        .domain([0, d3Instance.max(dataFlat.map((d) => d.value)) || 1]);

      // Bind data to rectangles and update their fill colors
      dataFlat.forEach((d) => {
        if (isNaN(d.value)) {
          return;
        }

        svg
          .append('rect')
          .attr('x', getXPos(d.x))
          .attr('y', getYPos(d.y))
          .attr('width', cellSize - 1)
          .attr('height', cellSize - 1)
          .attr('class', 'heatmapelmt')
          .style('fill', colorScale(d.value));

        svg
          .append('text')
          .attr('x', getXPos(d.x) + cellSize / 2)
          .attr('y', getYPos(d.y) + cellSize / 2)
          .text(d.value)
          .style('font-size', '12px')
          .style('text-anchor', 'middle')
          .style('dominant-baseline', 'middle');
      });

      // Add y label to heatmap
      Object.entries(AGE_GROUP_ORDER).forEach(([val, order]) => {
        svg
          .append('text')
          .attr('x', 0)
          .attr('y', getYPos(order) + cellSize / 2)
          .text(val)
          .attr('width', cellSize - 1)
          .attr('height', cellSize - 1)
          .style('font-size', '12px')
          .style('text-anchor', 'left')
          .style('dominant-baseline', 'middle');
      });

      svg
        .append('g')
        .attr(
          'transform',
          `translate(${labelWidth + cellSize / 2},${height - 60})`,
        )
        .call(
          d3Instance
            .axisBottom()
            .scale(
              d3Instance
                .scaleLinear()
                .domain([2003, 2023])
                .range([0, cellSize * (Object.values(YEAR_ORDER).length - 1)]),
            )
            .tickFormat((d) => parseInt(d).toString()),
        );

      return svgElement;
    },
    [props.data],
  );

  // Update the SVG with the heatmap
  React.useEffect(() => {
    updateSvg(initHeatmap);
  }, [updateSvg, initHeatmap]);

  return (
    <div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        ref={svgRef}
      ></div>
    </div>
  );
}

export default Heatmap;
