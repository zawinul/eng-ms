package it.eng.ms.engservice.sendmail;


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
@Configuration
@RefreshScope
@EnableEurekaClient
public class SendMailApplication {


	@RequestMapping("/send-mail-sync")
	public String sendMailSync() {
		return "OK";
	}
	
	@RequestMapping("/send-mail-async")
	public String sendMailAsync() {
		return "OK";
	}
	
	
	
	public static void main(String[] args) {
		//System.setProperty("server.servlet.context-path", "/root-differente");
		   
		ConfigurableApplicationContext ctx 
		= SpringApplication.run(SendMailApplication.class, args);
		
		String port = ctx.getEnvironment().getProperty("server.port");
		System.out.println("\n\n\n\t\tSTARTED ON PORT "+port+"\n\n\n");  
	}
}
