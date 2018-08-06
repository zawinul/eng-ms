package it.eng.ms.oauthserver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.oauth2.config.annotation.builders.InMemoryClientDetailsServiceBuilder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;

@Configuration
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

	@Autowired
	AuthenticationManager authManager;

	@Override
	public void configure(AuthorizationServerEndpointsConfigurer endpoints)	throws Exception {
		endpoints.authenticationManager(authManager);
	}

	@Override
	public void configure(ClientDetailsServiceConfigurer clients)	throws Exception {
		InMemoryClientDetailsServiceBuilder build = clients.inMemory();
		build.withClient("webapp").secret("websecret").authorizedGrantTypes("password").scopes("read,write,trust");
		
	}

	
	
}
