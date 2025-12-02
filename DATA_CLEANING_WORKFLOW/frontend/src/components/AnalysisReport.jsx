import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { dataAPI } from '../services/api';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  FileText, 
  BarChart2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download,
  ChevronDown,
  ChevronUp,
  Database
} from 'lucide-react';
import { formatDate, safeJSONParse } from '../utils/helpers';

const AnalysisReport = () => {
    const { reportId } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedSection, setExpandedSection] = useState('summary');

    useEffect(() => {
        if (reportId) {
            fetchReport(reportId);
        } else {
            toast.error('No report ID provided');
            setLoading(false);
        }
    }, [reportId]);

    // Auto-refresh if report is still processing
    useEffect(() => {
        if (report && report.status === 'processing') {
            const interval = setInterval(() => {
                fetchReport(reportId);
            }, 3000); // Refresh every 3 seconds while processing
            return () => clearInterval(interval);
        }
    }, [report, reportId]);

    const fetchReport = async (reportId) => {
        try {
            setLoading(true);
            const response = await dataAPI.getReport(reportId);
            
            // Parse summary if it's a string (legacy) or keep as object
            if (response.summary && typeof response.summary === 'string') {
                response.summary = safeJSONParse(response.summary, response.summary);
            }
            
            setReport(response);
        } catch (error) {
            console.error('Failed to fetch report:', error);
            toast.error('Failed to load report');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="w-8 h-8 border-4 border-[#ff9900] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Report Not Found</h2>
                <Link to="/dashboard" className="text-[#007185] hover:text-[#005a6c] font-medium hover:underline">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const renderStatisticsTable = (stats) => {
        if (!stats) return null;
        
        const columns = Object.keys(stats);
        if (columns.length === 0) return null;
        
        const metrics = Object.keys(stats[columns[0]]);

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full" style={{ border: '1px solid #ddd' }}>
                    <thead style={{ background: '#f3f3f3' }}>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#0f1111', borderBottom: '1px solid #ddd' }}>Metric</th>
                            {columns.map(col => (
                                <th key={col} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#0f1111', borderBottom: '1px solid #ddd' }}>
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody style={{ background: '#ffffff' }}>
                        {metrics.map((metric, idx) => (
                            <tr key={metric} style={{ borderBottom: idx < metrics.length - 1 ? '1px solid #e5e5e5' : 'none' }}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium capitalize" style={{ color: '#0f1111' }}>
                                    {metric}
                                </td>
                                {columns.map(col => (
                                    <td key={`${col}-${metric}`} className="px-4 py-3 whitespace-nowrap text-sm" style={{ color: '#565959' }}>
                                        {stats[col][metric] !== null ? 
                                            (typeof stats[col][metric] === 'number' ? 
                                                stats[col][metric].toFixed(2) : stats[col][metric]) 
                                            : '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderDatasetHead = (dataHead) => {
        if (!dataHead) return null;
        
        try {
            const data = typeof dataHead === 'string' ? JSON.parse(dataHead) : dataHead;
            
            if (Array.isArray(data) && data.length > 0) {
                const columns = Object.keys(data[0]);
                
                return (
                    <div className="overflow-x-auto relative shadow-sm rounded-lg border border-gray-200">
                        <table className="min-w-full text-sm divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {columns.map(col => (
                                        <th 
                                            key={col} 
                                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" 
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        {columns.map(col => (
                                            <td 
                                                key={`${idx}-${col}`} 
                                                className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap" 
                                            >
                                                {row[col] !== null && row[col] !== undefined ? String(row[col]).substring(0, 50) : '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            }
        } catch (error) {
            console.error('Error rendering dataset head:', error);
        }
        return null;
    };

    const handleDownload = async () => {
        try {
            const response = await dataAPI.downloadCleanedData(reportId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `cleaned_${report.originalFilename}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download cleaned file');
        }
    };

    const handleDownloadPDF = async () => {
        try {
            toast.loading('Generating PDF...');
            const response = await dataAPI.downloadPDF(reportId);
            
            // Create blob with correct PDF MIME type
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `analysis_report_${report.originalFilename}.pdf`);
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            setTimeout(() => {
                link.remove();
                window.URL.revokeObjectURL(url);
            }, 100);
            
            toast.dismiss();
            toast.success('PDF downloaded successfully!');
        } catch (error) {
            console.error('PDF generation failed:', error);
            toast.dismiss();
            toast.error('Failed to generate PDF');
        }
    };

    const isStructuredSummary = report.summary && typeof report.summary === 'object';

    return (
        <div className="space-y-6 pb-12">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center text-gray-900">
                                <FileText className="mr-2 text-[#ff9900]" />
                                Analysis Report
                            </h1>
                            <p className="mt-1 text-gray-600 text-sm">
                                {report.originalFilename} • {formatDate(report.createdAt)}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                report.status === 'completed' ? 'bg-[#e6f4f1] text-[#067d62]' :
                                report.status === 'processing' ? 'bg-[#fff8e6] text-[#b76e00]' :
                                'bg-[#fef2f2] text-[#d13212]'
                            }`}>
                                {report.status === 'completed' && <CheckCircle size={16} className="mr-1" />}
                                {report.status === 'processing' && <Clock size={16} className="mr-1" />}
                                {report.status === 'failed' && <AlertTriangle size={16} className="mr-1" />}
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                            {report.status === 'completed' && (
                                <>
                                    <button 
                                        onClick={handleDownloadPDF}
                                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium shadow-md hover:shadow-lg"
                                    >
                                        <Download size={16} className="mr-2" />
                                        Download PDF
                                    </button>
                                    {report.cleaning && (
                                        <button 
                                            onClick={handleDownload}
                                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium shadow-md hover:shadow-lg"
                                        >
                                            <Download size={16} className="mr-2" />
                                            Download Cleaned Data
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Processing State */}
                {report.status === 'processing' && (
                    <div className="bg-[#fff8e6] border border-[#ff9900] rounded-lg p-6 flex items-center">
                        <div className="w-8 h-8 border-4 border-[#ff9900] border-t-transparent rounded-full animate-spin mr-4"></div>
                        <div>
                            <h3 className="text-lg font-medium text-[#b76e00]">Analysis in Progress</h3>
                            <p className="text-[#865c00] text-sm">Your data is being processed. This page will update automatically.</p>
                        </div>
                    </div>
                )}

                {/* Errors */}
                {report.errors && report.errors.length > 0 && (
                    <div className="bg-[#fef2f2] border border-[#d13212] rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-2 flex items-center text-[#d13212]">
                            <AlertTriangle className="mr-2" /> Analysis Errors
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-[#991b1b] text-sm">
                            {report.errors.map((error, index) => (
                                <li key={index}>{typeof error === 'string' ? error : JSON.stringify(error)}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="space-y-6">
                    
                    {/* AI Insights - Full Width */}
                    {report.insights && (
                        <div className="bg-[#e6f4f9] border border-[#007eb9] rounded-lg overflow-hidden">
                            <div className="border-b border-[#007eb9] px-6 py-4">
                                <h3 className="text-lg font-semibold text-[#007eb9]">✨ AI Insights</h3>
                            </div>
                            <div className="prose prose-sm max-w-none p-6">
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2 text-gray-900" {...props} />,
                                        h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2 text-gray-800" {...props} />,
                                        h3: ({node, ...props}) => <h3 className="text-base font-semibold mt-2 mb-1 text-gray-800" {...props} />,
                                        p: ({node, ...props}) => <p className="text-sm text-gray-700 mb-2 leading-relaxed" {...props} />,
                                        ul: ({node, ...props}) => <ul className="text-sm text-gray-700 list-disc list-inside space-y-1 mb-2" {...props} />,
                                        ol: ({node, ...props}) => <ol className="text-sm text-gray-700 list-decimal list-inside space-y-1 mb-2" {...props} />,
                                        li: ({node, ...props}) => <li className="text-sm text-gray-700" {...props} />,
                                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-sm text-gray-600 my-2" {...props} />,
                                        code: ({node, inline, ...props}) => 
                                            inline 
                                                ? <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-red-600" {...props} />
                                                : <code className="bg-gray-100 p-3 rounded block text-xs font-mono text-gray-800 overflow-x-auto" {...props} />,
                                        pre: ({node, ...props}) => <pre className="bg-gray-100 p-3 rounded mb-2 overflow-x-auto" {...props} />,
                                        table: ({node, ...props}) => <table className="w-full border-collapse border border-gray-300 text-xs mb-2" {...props} />,
                                        th: ({node, ...props}) => <th className="border border-gray-300 px-2 py-1 bg-gray-200 font-semibold" {...props} />,
                                        td: ({node, ...props}) => <td className="border border-gray-300 px-2 py-1" {...props} />,
                                        strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                                        em: ({node, ...props}) => <em className="italic text-gray-800" {...props} />,
                                    }}
                                >
                                    {typeof report.insights === 'string' ? report.insights : JSON.stringify(report.insights)}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                    
                    {/* Content Below AI Insights */}
                    <div className="space-y-6">

                        {/* Dataset Head Preview */}
                        {report.summary && isStructuredSummary && (report.summary.sampleData || report.summary.data_head) && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <h3 className="text-lg font-semibold flex items-center text-gray-900">
                                        <Database className="mr-2 text-[#ff9900]" /> Dataset Preview
                                    </h3>
                                    <p className="text-sm mt-1 text-gray-600">First few rows of your dataset</p>
                                </div>
                                <div className="p-6">
                                    {renderDatasetHead(report.summary.sampleData || report.summary.data_head)}
                                </div>
                            </div>
                        )}

                        {/* Visualizations */}
                        {(report.plots?.length > 0 || report.statistics?.visualizations) && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <h3 className="text-lg font-semibold flex items-center text-gray-900">
                                        <BarChart2 className="mr-2 text-[#ff9900]" /> Visualizations
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Legacy Plots (URLs) */}
                                        {report.plots?.map((plot, index) => (
                                            <div key={`legacy-${index}`} className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}${plot}`}
                                                    alt={`Plot ${index + 1}`}
                                                    className="w-full h-auto object-contain bg-gray-50"
                                                />
                                            </div>
                                        ))}
                                        
                                        {/* New Base64 Plots */}
                                        {report.statistics?.visualizations?.correlation_matrix && (
                                            <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 col-span-1 md:col-span-2">
                                                <img
                                                    src={report.statistics.visualizations.correlation_matrix}
                                                    alt="Correlation Matrix"
                                                    className="w-full h-auto object-contain bg-gray-50"
                                                />
                                                <div className="bg-gray-100 px-4 py-3 border-t border-gray-200">
                                                    <p className="text-xs text-center font-bold text-gray-600">Correlation Matrix</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {report.statistics?.visualizations?.distributions?.map((dist, index) => (
                                            <div key={`dist-${index}`} className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
                                                <img
                                                    src={dist.image}
                                                    alt={`Distribution of ${dist.name}`}
                                                    className="w-full h-auto object-contain bg-gray-50"
                                                />
                                                <div className="bg-gray-100 px-4 py-3 border-t border-gray-200">
                                                    <p className="text-xs text-center font-bold text-gray-600">Distribution: {dist.name}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {report.statistics?.visualizations?.categorical?.map((cat, index) => (
                                            <div key={`cat-${index}`} className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
                                                <img
                                                    src={cat.image}
                                                    alt={`Categories in ${cat.name}`}
                                                    className="w-full h-auto object-contain bg-gray-50"
                                                />
                                                <div className="bg-gray-100 px-4 py-3 border-t border-gray-200">
                                                    <p className="text-xs text-center font-bold text-gray-600">Top Categories: {cat.name}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Clustering Analysis (Detective Mode) */}
                                        {report.statistics?.visualizations?.clustering && (
                                            <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 col-span-1 md:col-span-2">
                                                <img
                                                    src={report.statistics.visualizations.clustering}
                                                    alt="Cluster Analysis"
                                                    className="w-full h-auto object-contain bg-gray-50"
                                                />
                                                <div className="bg-gray-100 px-4 py-3 border-t border-gray-200">
                                                    <p className="text-xs text-center font-bold text-gray-600">🔍 Detective Analysis: Data Clusters</p>
                                                    {report.statistics.clustering_insight && (
                                                        <p className="text-xs text-center mt-1 text-gray-500 italic">{report.statistics.clustering_insight}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                    {/* File Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-900">File Details</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-sm text-gray-600">Filename</p>
                                <p className="font-medium break-all text-gray-900">{report.originalFilename}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Report ID</p>
                                <p className="font-mono text-xs p-2 rounded mt-1 text-gray-600 bg-gray-100">{report.reportId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Created At</p>
                                <p className="font-medium text-gray-900">{formatDate(report.createdAt)}</p>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
        </div>
    );
};

export default AnalysisReport;
