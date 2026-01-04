
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

/**
 * EL CRAWLER DE INTEGRIDAD (Step 124)
 * Objetivo: Escanear recursivamente el sitio para detectar enlaces rotos (404/500).
 */

const BASE_URL = 'http://localhost:3000';
const visited = new Set<string>();
const errors: any[] = [];

async function spider(url: string, depth: number = 2) {
    if (depth === 0 || visited.has(url)) return;
    visited.add(url);

    console.log(`🕷️ [Spider] Visiting: ${url}`);

    try {
        const response = await axios.get(url);
        if (response.status !== 200) {
            errors.push({ url, status: response.status });
            return;
        }

        const $ = cheerio.load(response.data);
        const links: string[] = [];

        $('a').each((_, el) => {
            const href = $(el).attr('href');
            if (href && href.startsWith('/') && !href.startsWith('//')) {
                links.push(BASE_URL + href);
            } else if (href && href.startsWith(BASE_URL)) {
                links.push(href);
            }
        });

        for (const link of links) {
            await spider(link, depth - 1);
        }

    } catch (error: any) {
        console.error(`❌ [Spider] Failed to visit ${url}:`, error.message);
        errors.push({ url, error: error.message });
    }
}

async function runAudit() {
    console.log("🚀 Starting Integrity Spider...");
    await spider(BASE_URL);

    const report = {
        scanTime: new Date().toISOString(),
        totalLinksChecked: visited.size,
        errorsFound: errors,
        status: errors.length === 0 ? "PASS" : "FAIL"
    };

    fs.writeFileSync('qa_report.json', JSON.stringify(report, null, 2));
    console.log(`✅ Audit complete. Found ${errors.length} errors.`);

    if (errors.length > 0) {
        console.log("⚠️ Broken Links Detected:", JSON.stringify(errors, null, 2));
    }
}

runAudit();
