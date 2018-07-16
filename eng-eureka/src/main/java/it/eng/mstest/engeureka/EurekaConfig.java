package it.eng.mstest.engeureka;

import org.springframework.cloud.commons.util.InetUtils;
import org.springframework.cloud.commons.util.InetUtilsProperties;
import org.springframework.cloud.netflix.eureka.EurekaInstanceConfigBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.netflix.appinfo.AmazonInfo;

//@Configuration
public class EurekaConfig {

	/*
	@Bean
	//@Profile("!default")
	public EurekaInstanceConfigBean eurekaInstanceConfig() {
		System.out.println("\n\n\t\tAWS 2\n\n");
	    EurekaInstanceConfigBean b = new EurekaInstanceConfigBean(new InetUtils(new InetUtilsProperties()));
	    System.out.println("b="+b);
	    AmazonInfo info = AmazonInfo.Builder.newBuilder().autoBuild("eureka");
	    System.out.println("info="+info);
	    
	    if (info!=null && info.getMetadata().keySet().size()>0) {
	    	for(String k:info.getMetadata().keySet()) 
			    System.out.println("\t"+k+":\t"+info.getMetadata().get(k));
		    System.out.println("\t\tAWS INITIALIZED\n");
	    	b.setDataCenterInfo(info);
	    }
	    else
		    System.out.println("\t\tAWS **NOT** INITIALIZED\n");
	    	
	    return b;
	}
	*/

}
