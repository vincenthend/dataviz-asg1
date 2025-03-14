import React from 'react';
import { Pie, G2 } from '@antv/g2plot';
import { DataType } from '../types';
const G = G2.getEngine('canvas');

interface Props {
  data: DataType[];
}

function PieChart({ data: _data }: Props) {
  const chartRef = React.useRef<Pie | null>(null);

  React.useEffect(() => {
    const data = _data.reduce(
      (acc, curr) => {
        if (!curr.year) return acc;

        const status = curr.status.trim();
        if (!acc[status]) {
          acc[status] = {};
        }
        acc[status] = {
          ...curr,
          value: (acc[status]?.value ?? 0) + curr.no_of_drug_abusers,
        };

        return acc;
      },
      {} as Record<string, any>,
    );

    const dataFlat = Object.values(data);

    const cfg = {
      appendPadding: 10,
      data: dataFlat,
      angleField: 'value',
      colorField: 'status',
      radius: 0.75,
      legend: false,
      label: {
        type: 'spider',
        labelHeight: 40,
        formatter: (data, mappingData) => {
          const group = new G.Group({});
          group.addShape({
            type: 'circle',
            attrs: {
              x: 0,
              y: 0,
              width: 40,
              height: 50,
              r: 5,
              fill: mappingData.color,
            },
          });
          group.addShape({
            type: 'text',
            attrs: {
              x: 10,
              y: 8,
              text: `${data.status}`,
              fill: mappingData.color,
            },
          });
          group.addShape({
            type: 'text',
            attrs: {
              x: 0,
              y: 25,
              text: `${data.value}`,
              fill: 'rgba(0, 0, 0, 0.65)',
              fontWeight: 700,
            },
          });
          return group;
        },
      },
      interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    };
    const piePlot = new Pie('pie-chart', cfg);
    chartRef.current = piePlot;
    piePlot.render();

    return () => {
      // Destroy the chart when the component unmounts
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [_data]);

  return <div id="pie-chart"></div>;
}

export default PieChart;
