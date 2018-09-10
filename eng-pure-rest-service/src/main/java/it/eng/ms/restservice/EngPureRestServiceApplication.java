package it.eng.ms.restservice;


import java.util.Arrays;
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
@Import(SampleImportedBeanProvider.class)
@Configuration
@RefreshScope
@EnableEurekaClient
public class EngPureRestServiceApplication {
	

	@Value("${message}")
	public String message;
	
	@Autowired
	@Resource(name="friends")
	public List<String> friends; // from SampleImportedProvider (imported)
	
	@Autowired
	@Resource(name="fruits")
	public List<String> fruits; // from SampleConfigurationBeanProvider (declared as @configuration)
	
	@RequestMapping("/public/info")
	public SempliceOggetto publicPippo() {
		SempliceOggetto x = new SempliceOggetto();
		x.y = 100;
		x.message = "messaggio pubblico";
		return x;
	}
	
	@RequestMapping("/info")
	public SempliceOggetto privatePippo() {
		SempliceOggetto x = new SempliceOggetto();
		x.y = 101;
		x.message = "messaggio privato";
		return x;
	}
	
	@RequestMapping("/beandata")
	public List<List<String>> message2() {
		return Arrays.asList(friends, fruits);
	}
	

	public static void main(String[] args) {
		//System.setProperty("server.servlet.context-path", "/root-differente");
		   
		ConfigurableApplicationContext ctx;
		ctx = SpringApplication.run(EngPureRestServiceApplication.class, args);
		
		String port = ctx.getEnvironment().getProperty("server.port");
		System.out.println("\n\n\n\t\tSTARTED ON PORT "+port+"\n\n\n");  
	}
}
