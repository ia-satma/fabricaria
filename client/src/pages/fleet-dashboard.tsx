
import React from 'react';

/**
 * DASHBOARD DE LA FLOTA (Step 163)
 * Objetivo: Torre de Control para monitorear múltiples agentes.
 */

export default function FleetDashboard() {
    const agents = [
        { id: 'repl-001', name: 'Alpha-Legal', status: 'Online', cost: 12.50, errors: 0 },
        { id: 'repl-002', name: 'Beta-Retail', status: 'Online', cost: 45.30, errors: 2 },
        { id: 'repl-003', name: 'Gamma-Dev', status: 'Offline', cost: 0.00, errors: 0 },
    ];

    return (
        <div className="p-8 bg-slate-900 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-8">🛰️ Command Center: Agent Fleet</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {agents.map(agent => (
                    <div key={agent.id} className="p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">{agent.name}</h2>
                            <span className={`px-2 py-1 rounded text-xs ${agent.status === 'Online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {agent.status}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-slate-400">
                            <p>ID: <span className="text-slate-200">{agent.id}</span></p>
                            <p>Cost (MTD): <span className="text-green-400">${agent.cost.toFixed(2)}</span></p>
                            <p>Active Errors: <span className={agent.errors > 0 ? 'text-red-400' : 'text-slate-200'}>{agent.errors}</span></p>
                        </div>

                        <button className="mt-6 w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-medium transition-colors">
                            Inspect Genome
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
