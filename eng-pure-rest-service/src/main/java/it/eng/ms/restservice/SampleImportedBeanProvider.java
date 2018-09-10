package it.eng.ms.restservice;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;

public class SampleImportedBeanProvider {
	@Bean 
	List<String> friends() {
		return Arrays.asList("john", "bob", "alice");
	}
}
