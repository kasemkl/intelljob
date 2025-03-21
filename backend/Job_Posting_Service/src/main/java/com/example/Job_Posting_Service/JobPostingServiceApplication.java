package com.example.Job_Posting_Service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("com.example.Job_Posting_Service.DAO")
public class JobPostingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(JobPostingServiceApplication.class, args);
	}

}
