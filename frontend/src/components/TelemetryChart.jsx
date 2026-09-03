import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

/**
 * TelemetryChart Component
 * Plots real-time array data using Recharts.
 *
 * Props:
 *  - title (string): Chart title
 *  - data (array): Array of historical data objects
 *  - lines (array): Array of configuration objects for each line to draw
 *    e.g., [{ key: 'tiltX', name: 'Tilt X', color: '#38bdf8' }]
 *  - domain (array): Min/max for Y-axis, defaults to auto-scaling
 */
const TelemetryChart = ({
  title = "Telemetry Data",
  data = [],
  lines = [],
  domain = ['auto', 'auto']
}) => {

  // Custom Tooltip for Dark Mode
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltipContainer}>
          <p style={styles.tooltipTime}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: '4px 0', fontWeight: 600 }}>
              {entry.name}: {Number(entry.value).toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.chartCard}>
      <h3 style={styles.chartTitle}>{title}</h3>

      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            {/* Subtle grid lines for readability */}
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />

            {/* X-Axis shows the formatted time string */}
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              fontSize={12}
              tickMargin={10}
              minTickGap={20}
            />

            {/* Y-Axis auto-scales based on the domain prop */}
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              domain={domain}
              tickFormatter={(val) => val.toFixed(1)}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />

            {/* Dynamically render lines based on the 'lines' prop */}
            {lines.map((lineConfig, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={lineConfig.key}
                name={lineConfig.name}
                stroke={lineConfig.color}
                strokeWidth={2}
                dot={false} // Hiding dots improves performance on real-time charts
                activeDot={{ r: 6 }}
                // Pro-Tip: Disabling animation prevents stuttering when
                // WebSockets push high-frequency updates
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const styles = {
  chartCard: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#334155',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  chartTitle: {
    margin: '0 0 16px 0',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#f8fafc',
    letterSpacing: '0.5px'
  },
  chartWrapper: {
    height: '300px',
    width: '100%'
  },
  tooltipContainer: {
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    padding: '12px',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
  },
  tooltipTime: {
    margin: '0 0 8px 0',
    color: '#94a3b8',
    fontSize: '0.85rem'
  }
};

export default TelemetryChart;