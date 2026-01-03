import { db } from "./index";
import { agents } from "./schema";

const seedAgents = [
    {
        name: "Agent-Alpha",
        replId: "repl-alpha-001",
        url: "https://repl.co/alpha",
        status: "active",
        tasksCompleted: 1247,
        cpuLoad: 45,
    },
    {
        name: "Agent-Bravo",
        replId: "repl-bravo-002",
        url: "https://repl.co/bravo",
        status: "active",
        tasksCompleted: 892,
        cpuLoad: 72,
    },
    {
        name: "Agent-Charlie",
        replId: "repl-charlie-003",
        url: null,
        status: "booting",
        tasksCompleted: 0,
        cpuLoad: 0,
    },
    {
        name: "Agent-Delta",
        replId: "repl-delta-004",
        url: null,
        status: "failed",
        tasksCompleted: 156,
        cpuLoad: 0,
    },
    {
        name: "Agent-Echo",
        replId: "repl-echo-005",
        url: "https://repl.co/echo",
        status: "idle",
        tasksCompleted: 2341,
        cpuLoad: 5,
    },
];

async function seed() {
    console.log("Seeding agents...");
    
    for (const agent of seedAgents) {
        await db.insert(agents).values(agent);
        console.log(`Inserted: ${agent.name}`);
    }
    
    console.log("Seed complete!");
    process.exit(0);
}

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
