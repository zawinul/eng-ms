package it.eng.ms.restservice.security;

import java.io.InputStream;
import java.security.Key;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.consumer.ErrorCodes;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.jwt.consumer.JwtContext;

public class EngOidcTokenVerifier {
	private Key oidcProviderPublicKey;
	private JwtConsumer consumerWithExpire;
	private JwtConsumer consumerWithoutExpire;
	
	public EngOidcTokenVerifier() throws Exception {
	    CertificateFactory fact = CertificateFactory.getInstance("X.509");
	    InputStream is = this.getClass().getClassLoader().getResourceAsStream("eng-cert.pem");
	    X509Certificate cer = (X509Certificate) fact.generateCertificate(is);
	    oidcProviderPublicKey = cer.getPublicKey();		
	}
	
	private JwtConsumer getJwtConsumer(boolean withExpire) {
		if (withExpire) {
			if (consumerWithExpire==null) {
				consumerWithExpire = new JwtConsumerBuilder()
					.setRequireExpirationTime() 				// the JWT must have an expiration time
					.setAllowedClockSkewInSeconds(60*60*24*10) 	// allow some leeway in validating time based
																// claims to account for clock skew
					.setRequireSubject() // the JWT must have a subject claim
					.setExpectedIssuer("https://oidc-provider:3043") // whom the JWT needs to have been issued by
					.setExpectedAudience("foo") // to whom the JWT is intended for
					.setVerificationKey(oidcProviderPublicKey) // verify the signature  with the public key
					.build(); // create the JwtConsumer instance
			}
			return consumerWithExpire;
		}
		else {
			if (consumerWithoutExpire==null) {
				consumerWithoutExpire = new JwtConsumerBuilder()
					.setRequireExpirationTime() 				// the JWT must have an expiration time
					.setAllowedClockSkewInSeconds(60*60*24*10) 	// allow some leeway in validating time based
																// claims to account for clock skew
					.setRequireSubject() // the JWT must have a subject claim
					.setExpectedIssuer("https://oidc-provider:3043") // whom the JWT needs to have been issued by
					.setExpectedAudience("foo") // to whom the JWT is intended for
					.setVerificationKey(oidcProviderPublicKey) // verify the signature  with the public key
					.build(); // create the JwtConsumer instance
			}
			return consumerWithoutExpire;
		}
	}
	
	public JwtClaims valida(String jwt) throws Exception {
		return valida(jwt, true);
	}
	
	public JwtClaims valida(String jwt, boolean withExpiration) throws Exception {
		JwtConsumer jwtConsumer = getJwtConsumer(withExpiration);
		try {
			JwtContext ctx = jwtConsumer.process(jwt);
			JwtClaims jwtClaims = ctx.getJwtClaims();
			if (jwtClaims!=null) {
				System.out.println("JWT validation succeeded! " + jwtClaims);
				for(String name: jwtClaims.getClaimNames()) {
					System.out.println("\t"+name+": " + jwtClaims.getClaimValue(name)+" ("+jwtClaims.getClaimValue(name).getClass().getName() +") ");
				}
			}
			return jwtClaims;
		} 
		catch (InvalidJwtException e) {
			System.out.println("Invalid JWT! " + e);

			// Whether or not the JWT has expired being one common reason for invalidity
			if (e.hasExpired()) {
				System.out.println("JWT expired at " + e.getJwtContext().getJwtClaims().getExpirationTime());
			}

			// Or maybe the audience was invalid
			if (e.hasErrorCode(ErrorCodes.AUDIENCE_INVALID)) {
				System.out.println("JWT had wrong audience: "
					+ e.getJwtContext().getJwtClaims().getAudience());
			}
			return null;
		}
	}
	
	public static void main(String args[]) throws Exception {
		EngOidcTokenVerifier x = new EngOidcTokenVerifier();
		String token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ink5dGhmUElrT0RDZFlnTnpSMHlkeHMzZ3VhTFpPeTNELTdHT0NDVFVsTkEifQ.eyJqdGkiOiJqVF9EZUpEem1hT2xsVExleDR3RlAiLCJzdWIiOiIyMzEyMWQzYy04NGRmLTQ0YWMtYjQ1OC0zZDYzYTlhMDU0OTciLCJpc3MiOiJodHRwczovL29pZGMtcHJvdmlkZXI6MzA0MyIsImlhdCI6MTUzNTk2MTE1MywiZXhwIjoxNTM1OTY0NzUzLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGRhdGlfYXBwbGljYXRpdmkgYWx0cm8gc2Vydml6aW8xIHNlcnZpemlvNSIsImF1ZCI6ImZvbyJ9.sUPEqokV56KeAR259gjJ6o3n1MT6hnGY8_uPqJ1gBLsIQ1i0PqHuiOkaIrM-voaGlrh1Wvh6HlE0uoWSv8n_1kpdtGlRXx6Z-4WMxJp75jR8W2SajvgABkEx8AuMHT5soxTi04tG9hUeprherwGjQaJPco4W875WaNtBEdThhP5-J8sI9ZqdAhfNtT16yJeNWNmrYfAu6G07gUh6bNpxUwVlaswr-LH6QqJxhlKANVGXfmSIpfA2ikvxFz7wcoi9eBkG3ihPciDO-QztBD__gD1nqp-KhUsXU6Zl4aHCIn5eeC7W1LGIbZjNyp23uTG8jwI4e2OalizbWKkRJHA37A";
		x.valida(token);
	}
}
