import { useDataSources } from '@splunk/dashboard-studio-extension/react';
import Paragraph from '@splunk/react-ui/Paragraph';
import Table from '@splunk/react-ui/Table';
import WaitSpinner from '@splunk/react-ui/WaitSpinner';
import { useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import './visualization.css';
import chartIcon from './assets/ChartColumnSquare.svg';

function normalizeData(data) {
    if (data.rows && data.rows.length > 0) return data.rows;
    if (data.columns && data.columns.length > 0) {
        const numRows = data.columns[0].length;
        return Array.from({ length: numRows }, (_, i) => data.columns.map((col) => col[i]));
    }
    return [];
}

function LoadingState() {
    return (
        <div className="viz-container viz-container--empty">
            <WaitSpinner size="large" />
        </div>
    );
}

function NoDataState() {
    return (
        <div className="viz-container viz-container--empty">
            <div className="viz-message">
                <img src={chartIcon} className="viz-message-icon" alt="" />
                <Paragraph>No data available</Paragraph>
            </div>
        </div>
    );
}

function DataTable({ fieldNames, rows }) {
    return (
        <div className="viz-container">
            <div className="viz-scroll">
                <Table stripeRows>
                    <Table.Head>
                        <Table.Row>
                            {fieldNames.map((field) => (
                                <Table.HeadCell key={String(field)}>{field}</Table.HeadCell>
                            ))}
                        </Table.Row>
                    </Table.Head>
                    <Table.Body>
                        {rows.map((row, index) => (
                            <Table.Row key={index}>
                                {row.map((cell, cellIndex) => (
                                    <Table.Cell key={cellIndex}>{String(cell)}</Table.Cell>
                                ))}
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
            <Paragraph className="viz-row-count">
                Showing {rows.length} row{rows.length !== 1 ? 's' : ''}
            </Paragraph>
        </div>
    );
}

function TableVisualization() {
    const { dataSources, loading } = useDataSources();
    const data = dataSources?.primary?.data || null;

    const rows = useMemo(() => (data ? normalizeData(data) : []), [data]);
    const fieldNames = useMemo(() => (data?.fields || []).map((f) => f.name || f), [data]);

    if (loading) return <LoadingState />;
    if (!data) return <NoDataState />;
    if (rows.length === 0) return <NoDataState />;

    return <DataTable fieldNames={fieldNames} rows={rows} />;
}

const rootElement = document.getElementById('root') || document.body;
createRoot(rootElement).render(<TableVisualization />);
