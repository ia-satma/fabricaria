
import os
from fastmcp import FastMCP
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content

# THE FACTORY VOICE (Step 104)
mcp = FastMCP("SendGrid")

@mcp.tool()
def send_email(to_email: str, subject: str, html_content: str) -> str:
    """
    Sends a transactional email via SendGrid.
    """
    api_key = os.environ.get("SENDGRID_API_KEY")
    from_email = os.environ.get("DEFAULT_FROM_EMAIL", "agent@factory.internal")
    
    if not api_key:
        return "Error: SENDGRID_API_KEY not found in environment."

    sg = sendgrid.SendGridAPIClient(api_key=api_key)
    mail = Mail(
        Email(from_email),
        To(to_email),
        subject,
        Content("text/html", html_content)
    )
    
    try:
        response = sg.send(mail)
        return f"Email sent! Status code: {response.status_code}"
    except Exception as e:
        return f"Failed to send email: {str(e)}"

if __name__ == "__main__":
    mcp.run()
