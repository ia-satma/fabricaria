
import { MarketingMastermind } from "../agents/marketing";

/**
 * PASO 382: SEO PROGRAMÁTICO (Generación de Landing Pages)
 * Objetivo: Capturar tráfico de Long Tail automáticamente.
 */

export interface LandingData {
    sector: string;
    title: string;
    description: string;
    benefits: string[];
    useCase: string;
    cta: string;
}

export class ProgrammaticSEO {
    private mastermind = new MarketingMastermind();

    private sectors = [
        "Abogados",
        "Arquitectos",
        "Médicos",
        "Ingenieros",
        "Logística",
        "Retail",
        "Manufactura",
        "Finanzas"
    ];

    async generateAllLandings(): Promise<LandingData[]> {
        const landings: LandingData[] = [];

        for (const sector of this.sectors) {
            console.log(`🏭 Generating landing data for: ${sector}`);
            const plan = await this.mastermind.planContent(`Estrategia de IA para el sector ${sector}`);

            landings.push({
                sector,
                title: plan.topic,
                description: `Soluciones agénticas personalizadas para el sector ${sector}.`,
                benefits: plan.keyPoints,
                useCase: plan.structure[0] || "Caso de éxito industrial.",
                cta: "Comenzar Transformación"
            });
        }

        return landings;
    }
}
