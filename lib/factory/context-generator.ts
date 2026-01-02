import { HandoffState } from "@/lib/swarm/schema";

export function generateAgentsMarkDown(handoff: HandoffState): string {
    const { id, target_role, intent, memory_ref, context_cache_id } = handoff;

    return `
# MISSION
Start Date: ${handoff.timestamp}
Tx ID: ${id}

You are an autonomous agent with the role: **${target_role}**.
Your primary directive is to execute the intent defined below.

## INTENT
> ${intent.summary}

## CONTEXT
${intent.files_focus ? `- **Focus Files**: ${intent.files_focus.join(", ")}` : ""}
${intent.constraints ? `- **Constraints**: ${intent.constraints.join(", ")}` : ""}

## MEMORY LINKS
- Cold Memory Ref: \`${memory_ref || "None"}\`
- Hot Context Cache: \`${context_cache_id || "None"}\`

## EXEUCTION PROTOCOL
1. Read this mission file.
2. Initialize your workspace according to the intent.
3. If memory references are present, query them to understand past decisions.
`;
}
