package it.eng.mstest.engeureka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.context.ConfigurableApplicationContext;


@EnableAutoConfiguration
@EnableEurekaServer
@SpringBootApplication
public class EngEurekaApplication {

	public static void main(String[] args) {

		ConfigurableApplicationContext ctx;
		ctx = SpringApplication.run(EngEurekaApplication.class, args);
		String port = ctx.getEnvironment().getProperty("server.port");
		System.out.println("\n\n\nSTARTED ON PORT "+port+"\n\n\n");  
	}
}
