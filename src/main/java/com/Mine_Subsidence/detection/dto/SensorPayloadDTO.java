package com.Mine_Subsidence.detection.dto;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

public record SensorPayloadDTO(

        @NotBlank(message = "Device ID cannot be empty")
        String deviceId,

        @NotNull(message = "Tilt X value is required")
        Double tiltX,

        @NotNull(message = "Tilt Y value is required")
        Double tiltY,

        @NotNull(message = "Vibration status is required")
        Boolean vibrationDetected,

        @NotNull(message = "Pressure value is required")
        @Min(value = 0, message = "Pressure cannot be negative")
        Double pressureKg
) {}
