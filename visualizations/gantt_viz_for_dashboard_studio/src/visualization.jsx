import React, { useMemo } from 'react';
import { useDataSources } from '@splunk/dashboard-studio-extension/react';

import { Gantt, Willow } from '@svar-ui/react-gantt';
import '@svar-ui/react-gantt/all.css';

export default function Visualization() {
    const { dataSources, loading } = useDataSources();

    // Get primary search results
    const rows = dataSources?.primary?.data || [];

    /**
     * Transform Splunk rows -> Gantt tasks
     * Expected fields from SPL:
     * id, label, start_time, end_time, parent_id, progress
     */
    const tasks = useMemo(() => {
        if (!rows || rows.length === 0) return [];

        return rows.map((row, index) => {
            return {
                id: row.id || index + 1,
                text: row.label || row.name || `Task ${index + 1}`,
                start: row.start_time ? new Date(row.start_time) : undefined,
                end: row.end_time ? new Date(row.end_time) : undefined,
                parent: row.parent_id || 0,
                type: row.parent_id ? "task" : "summary",
                progress: row.progress ? Number(row.progress) : 0,
            };
        });
    }, [rows]);

    /**
     * Simple dependency mapping (optional v1)
     * SPL fields: dependency_from, dependency_to
     */
    const links = useMemo(() => {
        if (!rows || rows.length === 0) return [];

        return rows
            .filter(r => r.dependency_from && r.dependency_to)
            .map((row, idx) => ({
                id: idx + 1,
                source: row.dependency_from,
                target: row.dependency_to,
                type: "e2e"
            }));
    }, [rows]);

    /**
     * Loading / empty state
     */
    if (loading) {
        return <div style={{ padding: 16 }}>Loading Gantt...</div>;
    }

    if (!tasks.length) {
        return <div style={{ padding: 16 }}>No data available</div>;
    }

    /**
     * Render Gantt
     */
    return (
        <div style={{ height: "100%", width: "100%" }}>
            <Willow>
                <Gantt
                    tasks={tasks}
                    links={links}
                    readonly={true}
                />
            </Willow>
        </div>
    );
}