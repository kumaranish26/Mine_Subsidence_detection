package com.Mine_Subsidence.detection.entity;



import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "sensor_telemetry")
@Data
@NoArgsConstructor
public class MineSensorData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "device_id", nullable = false, length = 50)
    private String deviceId;

    @Column(name = "tilt_x", nullable = false)
    private Double tiltX;

    @Column(name = "tilt_y", nullable = false)
    private Double tiltY;

    @Column(name = "vibration_detected", nullable = false)
    private Boolean vibrationDetected;

    @Column(name = "pressure_kg", nullable = false)
    private Double pressureKg;


    @Column(name = "recorded_at", nullable = false, updatable = false)
    private LocalDateTime timestamp;
}
