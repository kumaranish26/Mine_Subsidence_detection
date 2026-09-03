import { Wifi, WifiOff, AlertTriangle, ShieldCheck } from 'lucide-react';

const TopBarAlerts = ({ isConnected, vibrationDetected }) => {
  return (
    <div style={styles.container}>

      {/* Brand / Title Section */}
      <div>
        <h2 style={styles.title}>Mine Subsidence Monitor</h2>
        <p style={styles.subtitle}>ESP32 Telemetry Dashboard</p>
      </div>

      {/* Status Indicators Section */}
      <div style={styles.statusGroup}>

        {/* Connection Status Card */}
        <div style={{ ...styles.card, borderLeft: isConnected ? '4px solid #10b981' : '4px solid #ef4444' }}>
          {isConnected ? (
            <>
              <Wifi color="#10b981" size={24} />
              <div style={styles.textGroup}>
                <span style={styles.label}>System Status</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>Live / Connected</span>
              </div>
            </>
          ) : (
            <>
              <WifiOff color="#ef4444" size={24} />
              <div style={styles.textGroup}>
                <span style={styles.label}>System Status</span>
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Offline / Disconnected</span>
              </div>
            </>
          )}
        </div>

        {/* SW-420 Vibration Alert Card */}
        <div style={{
          ...styles.card,
          backgroundColor: vibrationDetected ? '#fee2e2' : 'transparent',
          borderLeft: vibrationDetected ? '4px solid #ef4444' : '4px solid #10b981',
          animation: vibrationDetected ? 'pulse 2s infinite' : 'none'
        }}>
          {vibrationDetected ? (
            <>
              <AlertTriangle color="#ef4444" size={24} />
              <div style={styles.textGroup}>
                <span style={styles.label}>Seismic Activity</span>
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>SHIFT DETECTED</span>
              </div>
            </>
          ) : (
            <>
              <ShieldCheck color="#10b981" size={24} />
              <div style={styles.textGroup}>
                <span style={styles.label}>Seismic Activity</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>Stable</span>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

// Simple inline styles to keep it looking clean without needing external CSS files right away
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '24px'
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#1f2937'
  },
  subtitle: {
    margin: 0,
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  statusGroup: {
    display: 'flex',
    gap: '16px'
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    boxShadow: 'inset 0 0 0 1px #e5e7eb'
  },
  textGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    color: '#6b7280',
    letterSpacing: '0.05em'
  }
};

export default TopBarAlerts;