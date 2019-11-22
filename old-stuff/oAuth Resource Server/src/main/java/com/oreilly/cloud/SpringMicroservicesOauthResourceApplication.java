package com.oreilly.cloud;

import java.security.Principal;

import javax.sql.DataSource;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.provider.token.RemoteTokenServices;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JdbcTokenStore;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@EnableResourceServer
@RestController
@EnableGlobalMethodSecurity(prePostEnabled=true)
@SpringBootApplication
public class SpringMicroservicesOauthResourceApplication {

	@RequestMapping("/resource/endpoint")
	@PreAuthorize("hasRole('ADMIN')")
	public String endpoint(Principal principal){
		return "Welcome " + principal.getName() +", This message is protected by the resource server.";
	}
	
	@Bean
	public RemoteTokenServices tokenService(){
		RemoteTokenServices tokenService = new RemoteTokenServices();
		tokenService.setCheckTokenEndpointUrl("http://localhost:9090/oauth/check_token");
		tokenService.setClientId("resource1");
		tokenService.setClientSecret("secret");
		return tokenService;
	}

	@Bean
	public TokenStore tokenStore(){
		return new JdbcTokenStore(dataSource());
	}
	
	@Bean
	public DataSource dataSource(){
		DriverManagerDataSource dataSource = new DriverManagerDataSource();
		dataSource.setDriverClassName("org.hsqldb.jdbcDriver");
		dataSource.setUrl("jdbc:hsqldb:hsql://localhost/testdb");
		dataSource.setUsername("SA");
		dataSource.setPassword("");
		return dataSource;
	}

	public static void main(String[] args) {
		SpringApplication.run(SpringMicroservicesOauthResourceApplication.class, args);
	}
	
	
}
