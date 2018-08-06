package it.eng.ms.oauthserver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter{

//	@Autowired
//	public PasswordEncoder encoder;

	Log logger = LogFactory.getLog(this.getClass());
	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}
	
	@Autowired
	public PasswordEncoder passwordEncoder;
	
	@Bean
	public AuthenticationManager authenticationManagerBean() throws Exception {
		AuthenticationManager a = super.authenticationManager();
		return a;
		
	}

	//private BCryptPasswordEncoder e = new BCryptPasswordEncoder();

	@Override
	protected void configure(AuthenticationManagerBuilder auth)	throws Exception {
		UserDetails ud = User.builder().passwordEncoder(x->x).username("user1").password("password1").roles("USER").build();
		
		auth.inMemoryAuthentication().withUser(ud);
//		auth
//		.userDetailsService(null)
//		.passwordEncoder(encoder);	
	}
	
	
}
