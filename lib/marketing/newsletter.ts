
import { MarketingMastermind } from "../agents/marketing";
import { AegisMailInterceptor } from "../security/mail_interceptor";

/**
 * PASO 388: GESTIÓN DE NEWSLETTER AUTOMATIZADA
 * Objetivo: Mantener el engagement mediante resúmenes semanales automáticos.
 */

export class NewsletterManager {
    private mastermind = new MarketingMastermind();
    private aegis = new AegisMailInterceptor();

    async generateWeeklySummary(commits: string[]): Promise<string> {
        const topic = "Resumen semanal de innovaciones en Fabricaria";
        const plan = await this.mastermind.planContent(`${topic} basado en estos cambios: ${commits.join(", ")}`);

        const article = await this.mastermind.writeArticle(plan);
        return article;
    }

    async sendBorrador(content: string, adminEmail: string) {
        const job = {
            to: adminEmail,
            subject: "📝 BORRADOR NEWSLETTER: Lo nuevo en Fabricaria",
            body: content
        };

        const check = this.aegis.validate(job);
        if (!check.allowed) {
            throw new Error(`Newsletter blocked by Aegis: ${check.reason}`);
        }

        console.log(`📧 [Newsletter] Borrador enviado a ${adminEmail} para aprobación.`);
        // Aquí se llamaría al MCP SendGrid: mcp.use_tool("SendGrid", "send_email", job);
    }
}
