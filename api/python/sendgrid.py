from http.server import BaseHTTPRequestHandler
import json
import os
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        to_email = data.get("to_email")
        subject = data.get("subject")
        html_content = data.get("html_content")
        
        api_key = os.environ.get("SENDGRID_API_KEY")
        from_email = os.environ.get("DEFAULT_FROM_EMAIL", "agent@factory.internal")

        if not api_key:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(b"Error: SENDGRID_API_KEY not found")
            return

        sg = sendgrid.SendGridAPIClient(api_key=api_key)
        mail = Mail(Email(from_email), To(to_email), subject, Content("text/html", html_content))
        
        try:
            response = sg.send(mail)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "code": response.status_code}).encode())
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode())
