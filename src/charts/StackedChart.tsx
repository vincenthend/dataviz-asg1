import React from 'react';
import { Area } from '@antv/g2plot';
import { DataType } from '../types';

interface Props {
  data: DataType[];
}

function StackedChart({ data: _data }: Props) {
  const chartRef = React.useRef<Area | null>(null);

  React.useEffect(() => {
    const data = _data.reduce(
      (acc, curr) => {
        if (!acc[curr.year]) {
          acc[curr.year] = {};
        }
        acc[curr.year][curr.age_group] = {
          ...curr,
          value:
            (acc[curr.year][curr.age_group]?.value ?? 0) +
            curr.no_of_drug_abusers,
        };

        return acc;
      },
      {} as Record<string, Record<string, any>>,
    );

    const dataFlat = Object.values(data)
      .map((x) => Object.values(x))
      .flat();

    const config = {
      autoFit: true,
      height: 600,
      data: dataFlat,
      xField: 'year',
      yField: 'value',
      seriesField: 'age_group',
      isStack: true,
      color: ({ age_group }) => {
        // Define custom colors based on the age group
        switch (age_group) {
          case 'Below 20':
            return '#98abc5';
          case '20-29':
            return '#8a89a6';
          case '30-39':
            return '#7b6888';
          case '40-49':
            return '#6b486e';
          case '50-59':
            return '#a05d56';
          case '59+':
            return '#d0743c';
          default:
            return '#ccc';
        }
      },
    };

    // Initialize the chart
    const chart = new Area('stacked-chart', config);
    chartRef.current = chart;
    chart.render();

    return () => {
      // Destroy the chart when the component unmounts
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [_data]);

  return <div id="stacked-chart"></div>;
}

export default StackedChart;
