package com.Mine_Subsidence.detection;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class DetectionApplication {

	public static void main(String[] args) {
		SpringApplication.run(DetectionApplication.class, args);
	}

}
