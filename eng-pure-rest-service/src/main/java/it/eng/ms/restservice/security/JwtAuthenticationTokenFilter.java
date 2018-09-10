package it.eng.ms.restservice.security;



import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jose4j.jwt.JwtClaims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.OncePerRequestFilter;

@Configuration
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {
	
	@Bean
	public FilterRegistrationBean<JwtAuthenticationTokenFilter> loggingFilter(){
		System.out.println("FilterRegistrationBean");
	    FilterRegistrationBean<JwtAuthenticationTokenFilter> registrationBean 
	      = new FilterRegistrationBean<>();
	         
	    registrationBean.setFilter(new JwtAuthenticationTokenFilter());
	    registrationBean.addUrlPatterns("/private/*");
	         
	    return registrationBean;    
	}

	private static 	EngOidcTokenVerifier verifier = null;
	private final String BEARER_PREFIX = "Bearer ";
	
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        
    	// per le richieste "public/*" non serve il token
    	if (request.getPathInfo().startsWith("/public/")) {
	        chain.doFilter(request, response);
	        return;
    	}

    	// estrae il token dall'header della richiesta
    	String authToken = request.getHeader("Authorization");
        if (authToken==null)
        	throw new ServletException("manca l'header Authorization");
        if (!authToken.startsWith(BEARER_PREFIX))
        	throw new ServletException("l'header Authorization non è di tipo Bearer");
        authToken = authToken.substring(BEARER_PREFIX.length());
        
        try {
        	if (verifier==null)
        		verifier = new EngOidcTokenVerifier();
        	JwtClaims jwtClaims = verifier.valida(authToken);
			request.setAttribute("jwtClaims", jwtClaims);
			
			if (jwtClaims==null) {
				response.setStatus(401); // unauthorized
				response.getWriter().write("unauthorized");
			}
			else
		        chain.doFilter(request, response);
		} 
        catch (Exception e) {
			e.printStackTrace();
			throw new ServletException(e);
		}

    }
}