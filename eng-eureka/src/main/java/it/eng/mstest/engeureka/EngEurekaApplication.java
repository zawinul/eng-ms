package it.eng.mstest.engeureka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.commons.util.InetUtils;
import org.springframework.cloud.commons.util.InetUtilsProperties;
import org.springframework.cloud.netflix.eureka.EurekaInstanceConfigBean;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

import com.netflix.appinfo.AmazonInfo;


@EnableAutoConfiguration
@EnableEurekaServer
@SpringBootApplication
public class EngEurekaApplication {

	public static void main(String[] args) {

		ConfigurableApplicationContext ctx 
			= SpringApplication.run(EngEurekaApplication.class, args);
		String port = ctx.getEnvironment().getProperty("server.port");
		System.out.println("\n\n\n\t\tSTARTED ON PORT "+port+"\n\n\n");  
	}
	
	/*
	@Bean
	//@Profile("!default")
	public EurekaInstanceConfigBean eurekaInstanceConfig() {
		System.out.println("\n\nAWS\n\n");
	    EurekaInstanceConfigBean b = new EurekaInstanceConfigBean(new InetUtils(new InetUtilsProperties()));
	    AmazonInfo info = AmazonInfo.Builder.newBuilder().autoBuild("eureka");
	    b.setDataCenterInfo(info);
	    return b;
	}
*/

	

}
