package it.eng.ms.engservice1;


import java.util.List;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@Import(MyFirstBeanProvider.class)
@Configuration
@RefreshScope
@EnableEurekaClient
public class EngService1Application {

	@Value("${message}")
	public String message;
	
	@Autowired
	@Resource(name="cats")
	public List<String> cats; // from myFirstBeanProvider (imported)
	
	@Autowired
	@Resource(name="dogs")
	public List<String> dogs; // from mySecondBeanProvider (declared as @configuration)
	

	
	@RequestMapping("/pippo")
	public SempliceOggetto message() {
		SempliceOggetto x = new SempliceOggetto();
		x.y = 100;
		return x;
	}
	
	@RequestMapping("/pippo2")
	public String message2() {
		return String.join(", ",cats);
	}
	
	@RequestMapping("/pippo3")
	public String message3() {
		return String.join(", ",dogs);
	}
	
	@RequestMapping("/message")
	public String configMessage() {
		return message;
	}
	
	
	public static void main(String[] args) {
		//System.setProperty("server.servlet.context-path", "/root-differente");
		   
		ConfigurableApplicationContext ctx 
		= SpringApplication.run(EngService1Application.class, args);
		
		String port = ctx.getEnvironment().getProperty("server.port");
		System.out.println("\n\n\n\t\tSTARTED ON PORT "+port+"\n\n\n");  
	}
}
