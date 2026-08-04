package com.example.folio_backend;

import com.example.folio_backend.role.Role;
import com.example.folio_backend.role.RoleRepossitory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
public class FolioBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(FolioBackendApplication.class, args);
	}

    @Bean
    public CommandLineRunner commandLineRunner(RoleRepossitory roleRepossitory) {
        return args -> {
            if (roleRepossitory.findByName("USER").isEmpty()) {
                roleRepossitory.save(
                        Role.builder().name("USER").build());
            }
        };
    }
}
