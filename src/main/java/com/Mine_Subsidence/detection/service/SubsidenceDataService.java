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


    public SubsidenceDataService(SensorDataRepository repository, SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }


    @Async
    @Transactional
    public void processHardwareData(SensorPayloadDTO payload) {
        try {

            MineSensorData entity = new MineSensorData();
            entity.setDeviceId(payload.deviceId());
            entity.setTiltX(payload.tiltX());
            entity.setTiltY(payload.tiltY());
            entity.setVibrationDetected(payload.vibrationDetected());
            entity.setPressureKg(payload.pressureKg());


            entity.setTimestamp(LocalDateTime.now());

            MineSensorData savedData = repository.save(entity);

            messagingTemplate.convertAndSend("/topic/sensor-updates", savedData);

            log.debug("Processed and broadcasted data for device: {}", savedData.getDeviceId());

        } catch (Exception e) {
            log.error("Critical failure while processing telemetry: {}", e.getMessage(), e);
        }
    }
}
