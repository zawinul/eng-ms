package it.eng.ms.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
@EnableConfigServer
//@EnableDiscoveryClient
public class SpringCloudConfigServerApplication {

	public static void main(String[] args) {
		ConfigurableApplicationContext ctx = 
			SpringApplication.run(SpringCloudConfigServerApplication.class, args);
		String port = ctx.getEnvironment().getProperty("server.port");
		System.out.println("\n\n\n\t\tCONFIGURATION SERVER STARTED ON PORT "+port+"\n\n\n");  

	}
}
