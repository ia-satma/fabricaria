
"use server";

import { db } from "../../db";
import { learnedPatterns } from "../../db/schema";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { GeminiCacheManager } from "../../lib/ai/gemini-client";

export async function savePattern(content: string, metadata: Record<string, any> = {}) {
    try {
        const embedding = await GeminiCacheManager.getEmbedding(content);

        // Check if embedding generation was successful (not all zeros if we care, but assuming manager handles it)
        await db.insert(learnedPatterns).values({
            pattern: content,
            metadata,
            embedding,
        });

        console.log(`[Memory] Pattern saved: "${content.substring(0, 50)}..."`);
        return true;
    } catch (error) {
        console.error("[Memory] Failed to save pattern:", error);
        return false;
    }
}

export async function findSimilarPatterns(query: string, limit = 5) {
    try {
        const queryEmbedding = await GeminiCacheManager.getEmbedding(query);

        const similarity = sql<number>`1 - (${cosineDistance(learnedPatterns.embedding, queryEmbedding)})`;

        const similarPatterns = await db.select({
            id: learnedPatterns.id,
            pattern: learnedPatterns.pattern,
            metadata: learnedPatterns.metadata,
            similarity: similarity
        })
            .from(learnedPatterns)
            .where(gt(similarity, 0.7)) // Similarity threshold
            .orderBy(desc(similarity))
            .limit(limit);

        return similarPatterns;
    } catch (error) {
        console.error("[Memory] Search failed:", error);
        // Return empty array on failure to be resilient
        return [];
    }
}
