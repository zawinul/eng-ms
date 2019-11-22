package it.eng.ms.engservice1;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MyBeanSecondProvider {
	@Bean 
	List<String> dogs() {
		return Arrays.asList("bau", "ringhio");
	}
	

}
