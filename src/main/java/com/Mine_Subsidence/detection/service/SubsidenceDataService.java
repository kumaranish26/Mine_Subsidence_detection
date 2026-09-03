package com.Mine_Subsidence.detection.service;



import com.Mine_Subsidence.detection.dto.SensorPayloadDTO;
import com.Mine_Subsidence.detection.entity.MineSensorData;
import com.Mine_Subsidence.detection.repository.SensorDataRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class SubsidenceDataService {

    private static final Logger log = LoggerFactory.getLogger(SubsidenceDataService.class);

    private final SensorDataRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    // Constructor Injection
    public SubsidenceDataService(SensorDataRepository repository, SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * @Async forces this method to run on a separate background thread.
     * This allows the Controller to instantly return the 202 response to the hardware.
     */
    @Async
    @Transactional
    public void processHardwareData(SensorPayloadDTO payload) {
        try {
            // 1. Map the validated DTO to your Database Entity
            MineSensorData entity = new MineSensorData();
            entity.setDeviceId(payload.deviceId());
            entity.setTiltX(payload.tiltX());
            entity.setTiltY(payload.tiltY());
            entity.setVibrationDetected(payload.vibrationDetected());
            entity.setPressureKg(payload.pressureKg());

            // Tag the record with the exact time the server processed it
            entity.setTimestamp(LocalDateTime.now());

            // 2. Save Entity to PostgreSQL/MySQL via ORM
            MineSensorData savedData = repository.save(entity);

            // 3. Broadcast the saved data (which now includes the DB-generated ID and timestamp)
            // to the React frontend dashboard over WebSockets
            messagingTemplate.convertAndSend("/topic/sensor-updates", savedData);

            log.debug("Processed and broadcasted data for device: {}", savedData.getDeviceId());

        } catch (Exception e) {
            // Because this is @Async, exceptions do not bubble up to the Controller's @ExceptionHandler.
            // You must catch and log them here so you don't lose visibility into database failures.
            log.error("Critical failure while processing telemetry: {}", e.getMessage(), e);
        }
    }
}
