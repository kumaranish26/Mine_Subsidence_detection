package com.Mine_Subsidence.detection.repository;



import com.Mine_Subsidence.detection.entity.MineSensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SensorDataRepository extends JpaRepository<MineSensorData, Long> {

    /**
     * Custom query method for the historical "Pull" API.
     * Spring Data JPA automatically translates this method name into a SQL query:
     * SELECT * FROM sensor_telemetry WHERE recorded_at > ? ORDER BY recorded_at ASC;
     */
    List<MineSensorData> findByTimestampAfterOrderByTimestampAsc(LocalDateTime startDate);

}
