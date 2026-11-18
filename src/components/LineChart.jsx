import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip);

const periodMilliseconds = {
  '3h': 3 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
  '3m': 90 * 24 * 60 * 60 * 1000,
  '1y': 365 * 24 * 60 * 60 * 1000,
  '3y': 3 * 365 * 24 * 60 * 60 * 1000,
  '5y': 5 * 365 * 24 * 60 * 60 * 1000,
};

const LineChart = ({ coinHistory, coinName, timeperiod }) => {
  const history = coinHistory?.data?.history || [];
  const cutoff = Date.now() - (periodMilliseconds[timeperiod] || periodMilliseconds['7d']);
  const visibleHistory = history.filter((entry) => entry.timestamp >= cutoff);

  const chartData = {
    labels: visibleHistory.map((entry) => new Date(entry.timestamp).toLocaleDateString()),
    datasets: [{
      label: `${coinName} price (USD)`,
      data: visibleHistory.map((entry) => entry.price),
      borderColor: '#0071bd',
      pointRadius: 0,
      tension: 0.2,
    }],
  };

  return (
    <div style={{ height: 400 }}>
      <Line
        data={chartData}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: { tooltip: { mode: 'index', intersect: false } },
          scales: { y: { ticks: { callback: (value) => `$${value}` } } },
        }}
      />
    </div>
  );
};

export default LineChart;
