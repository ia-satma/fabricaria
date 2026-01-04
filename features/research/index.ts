
"use server";

import { analyzeRepositoryAction } from "../actions";

// Re-export for client use
export async function ingestRepository(url: string) {
    return await analyzeRepositoryAction(url);
}
