
import axios from 'axios';
import fs from 'fs';

/**
 * PASO 246: SINCRONIZACIÓN DE "VERDAD" (Figma API)
 */

export class FigmaSync {
    private figmaToken = process.env.FIGMA_ACCESS_TOKEN;

    async downloadReference(fileKey: string, nodeId: string, outputDir: string): Promise<string> {
        console.log(`📐 [Figma-Sync] Fetching high-fidelity reference for node: ${nodeId}`);

        if (!this.figmaToken) {
            console.warn("⚠️ FIGMA_ACCESS_TOKEN missing. Using placeholder reference.");
            return "/Users/imacdesantiago/proyecto fabricaria/attached_assets/mock_figma.png";
        }

        try {
            // 1. Obtener URL de imagen con escala 2x (Retina/High-Fi)
            const response = await axios.get(`https://api.figma.com/v1/images/${fileKey}?ids=${nodeId}&scale=2&format=png`, {
                headers: { 'X-Figma-Token': this.figmaToken }
            });

            const imageUrl = response.data.images[nodeId];
            const outputPath = `${outputDir}/figma_${nodeId}.png`;

            // 2. Descargar y guardar
            const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            fs.writeFileSync(outputPath, imgRes.data);

            console.log(`✅ [Figma-Sync] Reference saved to: ${outputPath}`);
            return outputPath;

        } catch (e) {
            console.error("❌ [Figma-Sync] Failed to fetch Figma reference:", e);
            throw e;
        }
    }
}
