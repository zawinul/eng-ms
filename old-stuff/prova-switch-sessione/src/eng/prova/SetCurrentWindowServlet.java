package eng.prova;

import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class SetCurrentWindowServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public static class Finestra {
		public int index;
		public String finestra;
		public HashMap<String, Object> variabili = new HashMap<String, Object>();
	}
	

    public SetCurrentWindowServlet() {
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession();
		String nuovaFinestra = request.getParameter("finestra");
		String vecchiaFinestra = (String) session.getAttribute("finestraCorrente");
		if (vecchiaFinestra==null) { // solo la prima volta
			System.out.println("salvo la finestra "+nuovaFinestra);			
			salva(nuovaFinestra, session);
			session.setAttribute("finestraCorrente", nuovaFinestra);
		}
		else if (vecchiaFinestra.equals(nuovaFinestra)) {
			System.out.println("rimango nella stessa finestra "+nuovaFinestra);
		}
		else if (!vecchiaFinestra.equals(nuovaFinestra)) {
			System.out.println("salvo la finestra "+vecchiaFinestra);			
			salva(vecchiaFinestra, session);
			
			System.out.println("passo alla finestra "+nuovaFinestra);
			ripristina(nuovaFinestra, session);
			session.setAttribute("finestraCorrente", nuovaFinestra);
		}
	}

	private void salva(String finestra, HttpSession session) {
		@SuppressWarnings("unchecked")
		HashMap<String, Finestra> finestre = (HashMap<String, Finestra>) session.getAttribute("finestreSalvate");
		if (finestre==null)
			finestre = new HashMap<String, Finestra>();

		try {
			Enumeration<String> variabili = session.getAttributeNames();
			Finestra f = finestre.get(finestra);
			if (f==null) {
				f=new Finestra();
				f.finestra = finestra;
				f.index = finestre.size();
				finestre.put(finestra, f);
			}
			
			while(variabili.hasMoreElements()) {
				String name = variabili.nextElement();
				if (name.equals("finestraCorrente"))
					continue;
				if (name.equals("finestreSalvate"))
					continue;
				f.variabili.put(name, session.getAttribute(name));
			}
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		session.setAttribute("finestreSalvate", finestre);
	}

	private void ripristina(String finestra, HttpSession session) {
		@SuppressWarnings("unchecked")
		HashMap<String, Finestra> finestre = (HashMap<String, Finestra>) session.getAttribute("finestreSalvate");
		
		if (finestre==null)
			return;
		Finestra f = finestre.get(finestra);
		if (f==null) 
			return;

		try {
			for(String s: f.variabili.keySet()) 
				session.setAttribute(s, f.variabili.get(s));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
