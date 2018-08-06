package it.eng.ms.consumer;


import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;
import org.springframework.cloud.netflix.hystrix.dashboard.EnableHystrixDashboard;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.netflix.appinfo.InstanceInfo;
import com.netflix.discovery.EurekaClient;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixProperty;

@SpringBootApplication
@EnableEurekaClient
@RestController
// @EnableCircuitBreaker // abilita solamente il circuit breaking
@EnableHystrix // abilitazione più ampia
@EnableHystrixDashboard
public class EngConsumerServiceApplication {

	@Autowired
	private EurekaClient client;
	
	@Autowired
	RestTemplate restTemplate;
	
	@Bean
	@LoadBalanced
	public RestTemplate restTemplate(){
		return new RestTemplate();
	}

	@LoadBalanced
	RestTemplate restTemplate2 = new RestTemplate();

	@RequestMapping("/info")
	public String info() {
		InstanceInfo instance = client.getNextServerFromEureka("eng-service-1", false);
		return instance.getHomePageUrl();
	}
	
	@RequestMapping("/consuma")
	@HystrixCommand(fallbackMethod="onFailure", commandProperties={
			@HystrixProperty(name="execution.isolation.thread.timeoutInMilliseconds", value="500")
	})
	public String consuma(@RequestParam(defaultValue ="-1") long time) {
		System.out.println("consuma "+time);
		Logger.getGlobal().info("consuma "+time);
		try {
			if (time>0)
				Thread.sleep(time);
		} 
		catch (InterruptedException e) {
			e.printStackTrace();
		}
		String result = restTemplate.getForObject("http://ENG-SERVICE-1/message", String.class);
		return "res=["+result+"], t="+time;
	}
	
	public String onFailure(long time) {
		return "onFailure time="+time;
	}	
	
	public static void main(String[] args) {
		ConfigurableApplicationContext ctx 
			= SpringApplication.run(EngConsumerServiceApplication.class, args);
		
		String port = ctx.getEnvironment().getProperty("server.port");
		System.out.println("\n\n\n\t\tSTARTED ON PORT "+port+"\n\n\n");  
	}
}
