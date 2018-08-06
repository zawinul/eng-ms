package com.oreilly.cloud;

import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;

public class Breakpoint {
	public static int cnt = 0;
	public static void wsc_configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.inMemoryAuthentication()
			.withUser("user1")
			.password("password1")
			.roles("USER");
	}

	public static void asc_configure(ClientDetailsServiceConfigurer clients) throws Exception {
		clients.inMemory()
			.withClient("webapp")
			.secret("websecret")
			.authorizedGrantTypes("password")
			.scopes("read,write,trust");
	}

	public static void stop() {
		cnt++;
	}
}
