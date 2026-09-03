import React from 'react';

/**
 * MetricCard Component
 * Displays individual sensor measurements (Tilt X, Tilt Y, Load Cell Pressure)
 * with visual status indicators.
 *
 * Props:
 *  - title (string): Label of the metric (e.g., "X-Axis Tilt")
 *  - value (number | string): The sensor reading value
 *  - unit (string): Measurement unit (e.g., "°", "kg")
 *  - icon (React.Component): Icon component from lucide-react
 *  - status (string): 'normal' | 'warning' | 'danger'
 *  - description (string): Helper text or threshold hint
 */
const MetricCard = ({
  title = 'Metric',
  value = 0,
  unit = '',
  icon: Icon,
  status = 'normal',
  description = ''
}) => {

  // Dynamic border & highlight colors based on status
  const getStatusStyles = () => {
    switch (status) {
      case 'danger':
        return {
          borderColor: '#ef4444',
          glowColor: 'rgba(239, 68, 68, 0.15)',
          badgeColor: '#f87171',
          badgeBg: 'rgba(239, 68, 68, 0.1)'
        };
      case 'warning':
        return {
          borderColor: '#f59e0b',
          glowColor: 'rgba(245, 158, 11, 0.15)',
          badgeColor: '#fbbf24',
          badgeBg: 'rgba(245, 158, 11, 0.1)'
        };
      default:
        return {
          borderColor: '#334155',
          glowColor: 'transparent',
          badgeColor: '#38bdf8',
          badgeBg: 'rgba(56, 189, 248, 0.1)'
        };
    }
  };

  const currentStatusStyle = getStatusStyles();

  return (
    <div style={{
      ...styles.card,
      borderColor: currentStatusStyle.borderColor,
      boxShadow: `0 4px 20px ${currentStatusStyle.glowColor}`
    }}>
      {/* Card Header: Title & Icon */}
      <div style={styles.cardHeader}>
        <span style={styles.title}>{title}</span>
        {Icon && (
          <div style={{
            ...styles.iconWrapper,
            backgroundColor: currentStatusStyle.badgeBg,
            color: currentStatusStyle.badgeColor
          }}>
            <Icon size={20} />
          </div>
        )}
      </div>

      {/* Card Body: Numeric Value */}
      <div style={styles.valueContainer}>
        <span style={styles.value}>
          {typeof value === 'number' ? value.toFixed(2) : value}
        </span>
        <span style={styles.unit}>{unit}</span>
      </div>

      {/* Card Footer: Status or Helper Text */}
      {description && (
        <div style={styles.footer}>
          <span style={{
            ...styles.description,
            color: currentStatusStyle.badgeColor
          }}>
            {description}
          </span>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
    borderWidth: '1px',
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'all 0.3s ease',
    flex: '1 1 250px',
    minWidth: '220px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  title: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  iconWrapper: {
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  valueContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
    margin: '10px 0'
  },
  value: {
    fontSize: '2.25rem',
    fontWeight: '700',
    color: '#f8fafc',
    fontFamily: 'monospace'
  },
  unit: {
    fontSize: '1.1rem',
    fontWeight: '500',
    color: '#64748b'
  },
  footer: {
    marginTop: '8px',
    fontSize: '0.8rem'
  },
  description: {
    fontWeight: '500'
  }
};

export default MetricCard;