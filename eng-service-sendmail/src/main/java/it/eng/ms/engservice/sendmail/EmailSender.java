package it.eng.ms.engservice.sendmail;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.Message.RecipientType;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class EmailSender {
    private static final Logger LOGGER = Logger.getAnonymousLogger();

    private static final String DEFAULT_SERVER = "smtp.office365.com";
    private static final int DEFAULT_PORT = 587;
    private static final String DEFAULT_LOGIN = "paolo.andrenacci@eng.it";
    private static final String DEFAULT_PASSWORD = "Spazio2000";
    private static final String DEFAULT_FROM = "paolo.andrenacci@eng.it";

    private String from;
    private Session session;

    public EmailSender() {
    	this(DEFAULT_SERVER, DEFAULT_PORT, DEFAULT_LOGIN, DEFAULT_PASSWORD, DEFAULT_FROM);
    }

    public EmailSender(String server, int port, String login, String password, String from) {
    	this.from = from;
    	
        session = Session.getInstance(this.getEmailProperties(), new Authenticator() {

            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(DEFAULT_LOGIN, DEFAULT_PASSWORD);
            }
        });    	
    }

    public void sendEmail(String subject, String content, String to[], String cc[]) {

        try {
            Message m = new MimeMessage(session);
            if (to!=null)
            	for(String adr: to)
            		m.addRecipient(RecipientType.TO, new InternetAddress(adr));
            if (cc!=null)
            	for(String adr: cc)
            		m.addRecipient(RecipientType.CC, new InternetAddress(adr));
            m.setFrom(new InternetAddress(from));
            m.setSubject(subject);
            m.setText(content);
            m.setSentDate(new Date());
            Transport.send(m);
        } catch (final MessagingException ex) {
            LOGGER.log(Level.WARNING, "Errore nell'invio mail: " + ex.getMessage(), ex);
        }
    }

    public Properties getEmailProperties() {
        final Properties config = new Properties();
        config.put("mail.smtp.auth", "true");
        config.put("mail.smtp.starttls.enable", "true");
        config.put("mail.smtp.host", DEFAULT_SERVER);
        config.put("mail.smtp.port", DEFAULT_PORT);
        return config;
    }

    public static void main(final String[] args) {
    	String to[] = new String[] {
    		"paolo.andrenacci@eng.it",
    		"paolo.andrenacci@gmail.com"
    	};
    	
        new EmailSender().sendEmail("prova", "lorem ipsum ...", to, null);
        LOGGER.log(Level.WARNING, "fatto!");
    }
}
