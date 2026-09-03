import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client'; // <-- 1. ADDED THIS IMPORT
import { Activity, Move3d, Weight } from 'lucide-react';

import TopBarAlerts from '../components/TopBarAlerts';
import MetricCard from '../components/MetricCard';
import TelemetryChart from '../components/TelemetryChart';

const MAX_DATA_POINTS = 30;

const Dashboard = () => {
  const [isConnected, setIsConnected] = useState(false);

  const [latestData, setLatestData] = useState({
    deviceId: "WAITING_FOR_DATA...",
    tiltX: 0,
    tiltY: 0,
    pressureKg: 0,
    vibrationDetected: false
  });

  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const stompClient = new Client({
      // --- 2. THE FIX IS HERE ---
      // Removed brokerURL and replaced it with webSocketFactory using SockJS via http://
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-telemetry'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // --------------------------

      onConnect: () => {
        console.log('Connected to Spring Boot WebSocket');
        setIsConnected(true);

        stompClient.subscribe('/topic/sensor-updates', (message) => {
          const payload = JSON.parse(message.body);
          handleIncomingTelemetry(payload);
        });
      },

      onDisconnect: () => {
        console.log('Disconnected from Spring Boot WebSocket');
        setIsConnected(false);
      },
      onWebSocketClose: () => setIsConnected(false),
      onStompError: (error) => console.error('STOMP error', error)
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const handleIncomingTelemetry = (payload) => {
    setLatestData(payload);

    // Provide a fallback timestamp if the backend doesn't send one
    const timestamp = payload.timestamp ? new Date(payload.timestamp) : new Date();
    const timeString = timestamp.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const newChartPoint = {
      time: timeString,
      tiltX: payload.tiltX,
      tiltY: payload.tiltY,
      pressure: payload.pressureKg
    };

    setHistoricalData((prevData) => {
      const updatedData = [...prevData, newChartPoint];
      if (updatedData.length > MAX_DATA_POINTS) {
        return updatedData.slice(updatedData.length - MAX_DATA_POINTS);
      }
      return updatedData;
    });
  };

  const getTiltStatus = (val) => Math.abs(val) > 5.0 ? 'danger' : Math.abs(val) > 2.0 ? 'warning' : 'normal';
  const getPressureStatus = (val) => val > 4.5 ? 'danger' : val > 3.5 ? 'warning' : 'normal';

  return (
    <div style={styles.dashboardContainer}>
      <TopBarAlerts
        isConnected={isConnected}
        vibrationDetected={latestData.vibrationDetected}
        deviceId={latestData.deviceId}
      />

      <div style={styles.metricsGrid}>
        <MetricCard
          title="X-Axis Tilt"
          value={latestData.tiltX}
          unit="°"
          icon={Move3d}
          status={getTiltStatus(latestData.tiltX)}
        />
        <MetricCard
          title="Y-Axis Tilt"
          value={latestData.tiltY}
          unit="°"
          icon={Move3d}
          status={getTiltStatus(latestData.tiltY)}
        />
        <MetricCard
          title="Load Cell Pressure"
          value={latestData.pressureKg}
          unit="kg"
          icon={Weight}
          status={getPressureStatus(latestData.pressureKg)}
        />
      </div>

      <div style={styles.chartsGrid}>
        <TelemetryChart
          title="Structural Tilt Timeline"
          data={historicalData}
          domain={[-10, 10]}
          lines={[
            { key: 'tiltX', name: 'X-Axis', color: '#38bdf8' },
            { key: 'tiltY', name: 'Y-Axis', color: '#a78bfa' }
          ]}
        />

        <TelemetryChart
          title="Load Pressure Timeline"
          data={historicalData}
          domain={[0, 6]}
          lines={[
            { key: 'pressure', name: 'Pressure (kg)', color: '#4ade80' }
          ]}
        />
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    padding: '24px',
    backgroundColor: '#0f172a',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  metricsGrid: {
    display: 'flex',
    gap: '20px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '20px'
  }
};

export default Dashboard;