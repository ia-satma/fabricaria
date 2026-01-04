
import pino from 'pino';

/**
 * TELEMETRÍA ESTRUCTURADA (Step 134)
 * Objetivo: Logs JSON para trazabilidad total y FinOps.
 */

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    base: {
        env: process.env.NODE_ENV,
        component: 'agentic-software-factory'
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        },
    },
});

export const log = (event: string, data: any = {}) => {
    logger.info({
        event,
        ...data,
        trace_id: data.trace_id || 'no-trace',
        cost_estimate: data.cost_estimate || 0
    });
};

export default logger;
