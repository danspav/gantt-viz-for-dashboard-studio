/* To-DO get this working: https://help.splunk.com/en/splunk-cloud-platform/developing-views-and-apps-for-splunk-web/10.4.2604/custom-visualizations-for-dashboard-studio/tutorial-build-a-custom-visualization
import { VisualizationAPI } from '@splunk/dashboard-studio-extension';
*/
import { useDataSources } from '@splunk/dashboard-studio-extension/react';
import Paragraph from '@splunk/react-ui/Paragraph';
import Table from '@splunk/react-ui/Table';
import WaitSpinner from '@splunk/react-ui/WaitSpinner';
import { useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import './visualization.css';



import { Gantt, Willow } from '@svar-ui/react-gantt';
//import ganttCss from '@svar-ui/react-gantt/all.css';
import "@svar-ui/react-gantt/all.css"; //import css file from the package

/*
import ganttStyles from '@svar-ui/react-gantt/all.css';
const style = document.createElement("style");
style.textContent = ganttStyles;
document.head.appendChild(style);
*/




const ParagraphComponent = Paragraph.default || Paragraph;
const WaitSpinnerComponent = WaitSpinner.default || WaitSpinner;
const TableComponent = Table.default || Table;
const { Head, Body, Row, Cell, HeadCell } = TableComponent;


const state = {
    data: null,
    loading: false,
    options: {},
};



function normalizeData(data) {
    console.log("Normalizing data: ", data)
    if (data.rows && data.rows.length > 0) return data.rows;
    if (data.columns && data.columns.length > 0) {
        const numRows = data.columns[0].length;
        return Array.from({ length: numRows }, (_, i) => data.columns.map((col) => col[i]));
    }
    return [];
}

function LoadingState() {
    console.log("Loading - in LoadingState()")
    return (
        <div className="viz-container viz-container--empty">
            <WaitSpinnerComponent size="large" />
        </div>
    );
}

function NoDataState() {
    console.log("No data found - in NoDataState()")
    return (
        <div className="viz-container viz-container--empty">
            <div className="viz-message">
                <img src={chartIcon} className="viz-message-icon" alt="" />
                <ParagraphComponent>No data available</ParagraphComponent>
            </div>
        </div>
    );
}

function DataTable({ fieldNames, rows, options }) {
    
    const scaleMode = options?.scaleMode || "overview";
    const scaleOptions = {
        overview: [
            { unit: "month", step: 1, format: "%F %Y" }
        ],
        detailed: [
            { unit: "month", step: 1, format: "%F %Y" },
            { unit: "day", step: 1, format: "%j" }
        ],
        fine: [
            { unit: "day", step: 1, format: "%M %j" }
        ]
    };



    const mappedRows = rows.map((row) => {
        const obj = {};
        fieldNames.forEach((field, i) => {
            obj[field] = row[i];
        });
        return obj;
    });

    // Add simple status logic
    const tasks = mappedRows.map((row, index) => {
        let cssClass = "status-planned";

        if (row.progress >= 100) cssClass = "status-complete";
        else if (row.progress > 0) cssClass = "status-progress";

        return {
            id: Number(row.id) || index + 1,
            text: row.label || `Task ${index + 1}`,
            start: row.start_time ? new Date(row.start_time) : new Date(),
            end: row.end_time ? new Date(row.end_time) : new Date(),
            parent: row.parent_id ? Number(row.parent_id) : 0,
            type: row.parent_id ? "task" : "summary",
            progress: row.progress ? Number(row.progress) : 0,
            cssClass
        };
    });

    const links = mappedRows
        .filter(r => r.dependency_from && r.dependency_to)
        .map((row, i) => ({
            id: i + 1,
            source: Number(row.dependency_from),
            target: Number(row.dependency_to),
            type: "e2e"
        }));

    return (
        <div className="viz-container">
            <Willow>
                <Gantt
                    tasks={tasks}
                    links={links}
                    readonly={true}
                    scales={scaleOptions[scaleMode]}
                    markers={[
                        {
                            start: new Date(),
                            css: "today-marker",
                            text: "Now"
                        }
                    ]}
                    columns={[
                        { id: "text", header: "Task", flexgrow: 1 },
                        { id: "start", header: "Start", width: 90 },
                        { id: "end", header: "End", width: 90 },
                        { id: "progress", header: "%", width: 50 }
                    ]}

                />
            </Willow>

            <ParagraphComponent className="viz-row-count">
                Showing {rows.length} row{rows.length !== 1 ? 's' : ''}
            </ParagraphComponent>
        </div>
    );
}

function TableVisualization({ options }) {
    const { dataSources, loading } = useDataSources();
    const data = dataSources?.primary?.data || null;

    const rows = useMemo(() => (data ? normalizeData(data) : []), [data]);
    const fieldNames = useMemo(() => (data?.fields || []).map((f) => f.name || f), [data]);
    if (loading) return <LoadingState />;
    if (!data) return <NoDataState />;
    if (rows.length === 0) return <NoDataState />;
    return <DataTable fieldNames={fieldNames} rows={rows} options={options} />;
}

/*
TO-DO: get these working: https://help.splunk.com/en/splunk-cloud-platform/developing-views-and-apps-for-splunk-web/10.4.2604/custom-visualizations-for-dashboard-studio/tutorial-build-a-custom-visualization

VisualizationAPI.addOptionsListener(({ options }) => {
    state.options = options;
    render();
});


VisualizationAPI.addDataSourcesListener(
    ({ dataSources, loading }) => {
        state.loading = loading;
        state.data = dataSources?.primary?.data ?? null;
        render();
    },
    { invokeImmediately: true }
);
*/

const rootElement = document.getElementById('root') || document.body;
createRoot(rootElement).render(<TableVisualization />);
