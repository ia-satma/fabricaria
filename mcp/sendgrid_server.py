
from mcp.server.fastmcp import FastMCP
import os
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content

# PASO 384: DESPLIEGUE DEL SERVIDOR MCP SENDGRID
# Objetivo: Dotar a la fábrica de capacidad de envío de correos.

mcp = FastMCP("SendGrid")

@mcp.tool()
def send_email(to_email: str, subject: str, content_html: str) -> str:
    """
    Sends a transactional email using SendGrid.
    """
    api_key = os.environ.get("SENDGRID_API_KEY")
    if not api_key:
        return "Error: SENDGRID_API_KEY not found in environment."

    sg = sendgrid.SendGridAPIClient(api_key=api_key)
    from_email = Email("marketing@fabricaria.vercel.app") # Sender verificado
    to_email_obj = To(to_email)
    content = Content("text/html", content_html)
    
    mail = Mail(from_email, to_email_obj, subject, content)
    
    try:
        response = sg.client.mail.send.post(request_body=mail.get())
        return f"Email sent successfully. Status Code: {response.status_code}"
    except Exception as e:
        return f"Failed to send email: {str(e)}"

if __name__ == "__main__":
    mcp.run()
