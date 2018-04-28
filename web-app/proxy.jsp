<%@page session="false"%>
<%@page import="java.net.*,java.io.*" %>
<%
try {
    String reqUrl = request.getQueryString();
    //System.out.println(reqUrl);
    URL url = new URL(reqUrl);
    URLConnection con = url.openConnection();
    con.connect();
    double t1 = System.currentTimeMillis();
    InputStream in = con.getInputStream();
    double t2 = System.currentTimeMillis();
   // System.out.println((t2-t1)/1000);
    BufferedReader rd = new BufferedReader(new InputStreamReader(in,"UTF-8"));
    String line;
    while ((line = rd.readLine()) != null) {
        out.println(line); 
    }
    rd.close();
} catch(Exception e) {
    response.setStatus(500);
}
%>