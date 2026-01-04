
import { FastMCP } from "fastmcp"; // There is a TS version too
import { MailService } from "@sendgrid/mail";

/**
 * THE FACTORY VOICE (Step 104 - TS Fallback)
 */
const mcp = new FastMCP("SendGrid");
const sg = new MailService();

mcp.addTool({
    name: "send_email",
    description: "Sends a transactional email via SendGrid.",
    parameters: {
        to_email: { type: "string" },
        subject: { type: "string" },
        html_content: { type: "string" }
    },
    execute: async ({ to_email, subject, html_content }) => {
        const apiKey = process.env.SENDGRID_API_KEY;
        const fromEmail = process.env.DEFAULT_FROM_EMAIL || "agent@factory.internal";

        if (!apiKey) return "Error: SENDGRID_API_KEY not found.";
        sg.setApiKey(apiKey);

        try {
            await sg.send({
                to: to_email,
                from: fromEmail,
                subject: subject,
                html: html_content
            });
            return "Email sent successfully via TS MCP.";
        } catch (e: any) {
            return `Failed to send email: ${e.message}`;
        }
    }
});

mcp.serve();
