package it.eng.ms.engservice1;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;

public class MyFirstBeanProvider {
	@Bean 
	List<String> cats() {
		return Arrays.asList("micio", "mao");
	}
	

}
