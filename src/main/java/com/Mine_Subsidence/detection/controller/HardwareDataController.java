package com.Mine_Subsidence.detection.controller;

import com.Mine_Subsidence.detection.dto.SensorPayloadDTO;
import com.Mine_Subsidence.detection.service.SubsidenceDataService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@RestController
@RequestMapping("/api/v1/hardware")
public class HardwareDataController {

    private static final Logger log = LoggerFactory.getLogger(HardwareDataController.class);
    private final SubsidenceDataService dataService;

    // 1. Constructor Injection (Safer and more testable than @Autowired)
    public HardwareDataController(SubsidenceDataService dataService) {
        this.dataService = dataService;
    }

    /**
     * Endpoint to receive continuous real-time data from the ESP32.
     */
    @PostMapping("/telemetry")
    public ResponseEntity<Map<String, String>> receiveSensorData(
            @Valid @RequestBody SensorPayloadDTO payload) {

        log.debug("Received telemetry from device: {}", payload.deviceId());

        // 2. Immediate Handoff to Service Layer
        // The service layer handles the DB save and WebSocket push
        dataService.processHardwareData(payload);

        // 3. Fast Acknowledgement (HTTP 202 Accepted)
        // Tells the hardware "I got it, move on" without waiting for deep processing
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Telemetry accepted");

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    /**
     * 4. Graceful Error Handling
     * If the ESP32 sends bad JSON or missing fields, this catches the error
     * so the server doesn't throw a messy 500 Internal Server Error stack trace.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        log.warn("Hardware sent invalid payload: {}", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
