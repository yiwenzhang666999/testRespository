package com.forestar.cas.client.ext;
import java.io.IOException;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.PostMethod;

public final class CasClientUtil {
	private static final Logger logger = Logger.getLogger(CasClientUtil.class
			.getName());

	private CasClientUtil() {
		// static-only access
	}

	public static String getTicket(final String server, final String username,
			final String password, final String service) {
		notNull(server, "server must not be null");
		notNull(username, "username must not be null");
		notNull(password, "password must not be null");
		notNull(service, "service must not be null");

		return getServiceTicket(server,
				getTicketGrantingTicket(server, username, password), service);
	}

	private static String getServiceTicket(final String server,
			final String ticketGrantingTicket, final String service) {
		if (ticketGrantingTicket == null)
			return null;

		final HttpClient client = new HttpClient();

		final PostMethod post = new PostMethod(server + "/"
				+ ticketGrantingTicket);

		post.setRequestBody(new NameValuePair[] { new NameValuePair("service",
				service) });

		try {
			client.executeMethod(post);

			final String response = post.getResponseBodyAsString();

			switch (post.getStatusCode()) {
			case 200:
				return response;

			default:
				logger.warning("Invalid response code (" + post.getStatusCode()
						+ ") from CAS server!");
				logger.info("Response (1k): "
						+ response.substring(0,
								Math.min(1024, response.length())));
				break;
			}
		}

		catch (final IOException e) {
			logger.warning(e.getMessage());
		}

		finally {
			post.releaseConnection();
		}

		return null;
	}
	
	
	public static void logout(String server,String tgt){
		final HttpClient client = new HttpClient();
		final PostMethod post = new PostMethod(server);
		post.setRequestBody(new NameValuePair[] {new NameValuePair("TGT", tgt)});
		try {
			client.executeMethod(post);
		}catch (final IOException e) {
			logger.warning(e.getMessage());
		}finally {
			post.releaseConnection();
		}
	}

	public static String getTicketGrantingTicket(final String server,
			final String username, final String password) {
		final HttpClient client = new HttpClient();
		final PostMethod post = new PostMethod(server);
		post.setRequestBody(new NameValuePair[] {new NameValuePair("username", username),
				new NameValuePair("password", password) });
		try {
			client.executeMethod(post);

			final String response = post.getResponseBodyAsString();

			switch (post.getStatusCode()) {
			case 201: {
				final Matcher matcher = Pattern.compile(".*action=\".*/(.*?)\".*").matcher(response);

				if (matcher.matches()){
					return "{\"status\" : \"1\",\"tgt\" : \""+matcher.group(1)+"\",\"msg\":\"ok\"}";
				}
				//logger.warning("Successful ticket granting request, but no ticket found!");
				//logger.info("Response (1k): "+ response.substring(0,Math.min(1024, response.length())));
				return "{\"status\" : \"0\",\"msg\" : \"Successful ticket granting request, but no ticket found!\"}";
			}

			default:
				//logger.warning("Invalid response code (" + post.getStatusCode()+ ") from CAS server!");
			//	logger.info("Response (1k): "+ response.substring(0,Math.min(1024, response.length())));
				return "{\"status\" : \"0\",\"msg\" : \""+ response.substring(0,Math.min(1024, response.length())).replace("\"", "")+"\"}";
			}
		}catch (final IOException e) {
			logger.warning(e.getMessage());
		}finally {
			post.releaseConnection();
		}
		return null;
	}

	private static void notNull(final Object object, final String message) {
		if (object == null)
			throw new IllegalArgumentException(message);
	}

	public static void main(final String[] args) {
		final String server = "http://localhost:8090/cas/v1/tickets";
		final String username = "admin";
		final String password = "1234562";
		final String service = "http://localhost:8090/service";
		String tgt = getTicketGrantingTicket(server, username, password);
		System.out.println(tgt);
		//logger.info(getTicket(server, username, password, service));
		//System.out.println(getServiceTicket(server, "TGT-1-ewi0t6WSLzanhf0UyYfw3EnXDPPbzIMFbLOew5S6rjEzTC9Oa1-cas01.example.org", service));
	}
}