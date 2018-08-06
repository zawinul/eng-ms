package com.oreilly.cloud;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Bean
	public AuthenticationManager authenticationManagerBean() throws Exception{
		return super.authenticationManagerBean();
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		Breakpoint.stop();
		auth.inMemoryAuthentication()
		.withUser("user1")
		.password("password1")
		.roles("USER");
	auth.inMemoryAuthentication()
		.withUser("user2")
		.password("password2")
		.roles("AMMINISTRATORE");
	}
	
}
