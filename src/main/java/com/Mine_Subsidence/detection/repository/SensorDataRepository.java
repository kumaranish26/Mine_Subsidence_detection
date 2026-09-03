package com.Mine_Subsidence.detection.repository;



import com.Mine_Subsidence.detection.entity.MineSensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SensorDataRepository extends JpaRepository<MineSensorData, Long> {


    List<MineSensorData> findByTimestampAfterOrderByTimestampAsc(LocalDateTime startDate);

}
