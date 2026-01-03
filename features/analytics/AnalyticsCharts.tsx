import { AnalyticsChartsClient } from "./AnalyticsChartsClient";
import {
    getTasksOverviewData,
    getPerformanceData,
    getAgentActivityData,
} from "./actions";

export async function AnalyticsCharts() {
    const [taskData, performanceData, agentActivityData] = await Promise.all([
        getTasksOverviewData(),
        getPerformanceData(),
        getAgentActivityData(),
    ]);

    return (
        <AnalyticsChartsClient
            taskData={taskData}
            performanceData={performanceData}
            agentActivityData={agentActivityData}
        />
    );
}
