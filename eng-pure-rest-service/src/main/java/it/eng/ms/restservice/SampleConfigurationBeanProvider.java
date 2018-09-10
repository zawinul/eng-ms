package it.eng.ms.restservice;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SampleConfigurationBeanProvider {
	@Bean 
	List<String> fruits() {
		return Arrays.asList("apple", "orange", "ananas");
	}
}
