import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dataAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Upload, FileText, Clock, CheckCircle, XCircle, History, Link2, Database, Play, Settings as SettingsIcon } from 'lucide-react';

import Card from './common/Card';
import StatCard from './common/StatCard';
import Badge from './common/Badge';
import { formatFileSize, getStatusVariant } from '../utils/helpers';

const DashboardNew = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [stats, setStats] = useState({ total: 0, processing: 0, completed: 0, failed: 0, recentReports: [] });
    const [activeTab, setActiveTab] = useState('upload');
    const [analysisOptions, setAnalysisOptions] = useState({
        summaryStats: true,
        correlationHeatmap: true,
        missingValues: true,
        targetAnalysis: false
    });
    const [workflow, setWorkflow] = useState('standard');
    
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchDashboardStats();
        const interval = setInterval(fetchDashboardStats, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const history = await dataAPI.getHistory(1, 5);
            const total = history.pagination?.total || 0;
            const reports = history.reports || [];
            const processing = reports.filter(r => r.status === 'processing').length;
            const completed = reports.filter(r => r.status === 'completed').length;
            const failed = reports.filter(r => r.status === 'failed').length;
            
            setStats({ total, processing, completed, failed, recentReports: reports });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            toast.error('Please select a file to upload');
            return;
        }

        setIsLoading(true);
        setUploadProgress(0);

        try {
            const response = await dataAPI.uploadFile(selectedFile, (progress) => {
                setUploadProgress(progress);
            });

            toast.success('Analysis started successfully!');
            navigate(`/analysis-report/${response.reportId}`, { state: { reportId: response.reportId } });
            await fetchDashboardStats();
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.error || 'Upload failed. Please try again.');
        } finally {
            setIsLoading(false);
            setUploadProgress(0);
        }
    };

    const validateFile = (file) => {
        const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json', 'text/plain'];
        const allowedExtensions = ['.csv', '.xlsx', '.xls', '.json', '.txt'];
        const maxSize = 50 * 1024 * 1024; // 50MB

        if (!allowedTypes.includes(file.type) && !allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
            toast.error('Invalid file type. Please upload CSV, Excel, JSON, or TXT files.');
            return false;
        }

        if (file.size > maxSize) {
            toast.error('File size too large. Maximum size is 50MB.');
            return false;
        }

        return true;
    };

    const handleFileSelect = useCallback((file) => {
        if (validateFile(file)) {
            setSelectedFile(file);
            toast.success(`Selected: ${file.name}`);
        }
    }, []);

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    }, [handleFileSelect]);

    const removeFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const getStatusBadge = (status) => {
        return <Badge variant={getStatusVariant(status)} size="sm">{status}</Badge>;
    };

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">New Analysis</h1>
                    <p className="text-sm text-gray-600">Configure and run your automated data analysis workflow</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white px-4 py-2 rounded-md border border-gray-200 shadow-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium text-gray-700">System Healthy</span>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Total Reports" value={stats.total} icon={FileText} changeType="primary" />
                <StatCard title="Processing" value={stats.processing} icon={Clock} changeType="warning" />
                <StatCard title="Completed" value={stats.completed} icon={CheckCircle} changeType="success" />
                <StatCard title="Failed" value={stats.failed} icon={XCircle} changeType="danger" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Configuration Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="overflow-hidden border-t-4 border-t-[#ff9900]">
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                <button
                                    onClick={() => setActiveTab('upload')}
                                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === 'upload'
                                            ? 'border-[#ff9900] text-[#ff9900]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Upload size={16} />
                                        File Upload
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('url')}
                                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === 'url'
                                            ? 'border-[#ff9900] text-[#ff9900]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Link2 size={16} />
                                        Import from URL
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('existing')}
                                    className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === 'existing'
                                            ? 'border-[#ff9900] text-[#ff9900]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Database size={16} />
                                        Existing Dataset
                                    </div>
                                </button>
                            </nav>
                        </div>

                        <div className="p-6">
                            {activeTab === 'upload' && (
                                <div 
                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                                        dragActive ? 'border-[#ff9900] bg-orange-50' : 
                                        selectedFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    {selectedFile ? (
                                        <div className="space-y-4">
                                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                                <CheckCircle size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">{selectedFile.name}</h3>
                                                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                                            </div>
                                            <button 
                                                onClick={removeFile}
                                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                                            >
                                                Remove file
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                                                <Upload size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">Drag and drop your dataset</h3>
                                                <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
                                            </div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="hidden"
                                                accept=".csv,.xlsx,.xls,.json,.txt"
                                                onChange={handleFileInputChange}
                                            />
                                            <button 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-md hover:border-[#ff9900] hover:text-[#ff9900] font-medium transition-all"
                                            >
                                                Browse Files
                                            </button>
                                            <p className="text-xs text-gray-400 mt-2">
                                                Supported: CSV, Excel, JSON (Max 50MB)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {activeTab === 'url' && (
                                <div className="py-8 text-center space-y-4">
                                    <div className="max-w-md mx-auto">
                                        <label className="block text-sm font-medium text-gray-700 text-left mb-1">Dataset URL</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="url" 
                                                placeholder="https://example.com/dataset.csv"
                                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-[#ff9900] focus:ring-[#ff9900] sm:text-sm p-2 border"
                                                disabled
                                            />
                                            <button 
                                                disabled
                                                className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md font-medium cursor-not-allowed"
                                            >
                                                Fetch
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 text-left mt-2">Import from URL is coming soon.</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'existing' && (
                                <div className="py-8 text-center">
                                    <p className="text-gray-500">Select from your previously uploaded datasets.</p>
                                    <div className="mt-4 max-w-md mx-auto">
                                        <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff9900] focus:ring-[#ff9900] sm:text-sm p-2 border" disabled>
                                            <option>Select a dataset...</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card title="Analysis Configuration">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Analysis Options</label>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3">
                                        <input 
                                            type="checkbox" 
                                            checked={analysisOptions.summaryStats}
                                            onChange={(e) => setAnalysisOptions({...analysisOptions, summaryStats: e.target.checked})}
                                            className="h-4 w-4 text-[#ff9900] focus:ring-[#ff9900] border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">Generate Summary Statistics</span>
                                    </label>
                                    <label className="flex items-center gap-3">
                                        <input 
                                            type="checkbox" 
                                            checked={analysisOptions.correlationHeatmap}
                                            onChange={(e) => setAnalysisOptions({...analysisOptions, correlationHeatmap: e.target.checked})}
                                            className="h-4 w-4 text-[#ff9900] focus:ring-[#ff9900] border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">Correlation Heatmap</span>
                                    </label>
                                    <label className="flex items-center gap-3">
                                        <input 
                                            type="checkbox" 
                                            checked={analysisOptions.missingValues}
                                            onChange={(e) => setAnalysisOptions({...analysisOptions, missingValues: e.target.checked})}
                                            className="h-4 w-4 text-[#ff9900] focus:ring-[#ff9900] border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">Missing Values Report</span>
                                    </label>
                                    <label className="flex items-center gap-3">
                                        <input 
                                            type="checkbox" 
                                            checked={analysisOptions.targetAnalysis}
                                            onChange={(e) => setAnalysisOptions({...analysisOptions, targetAnalysis: e.target.checked})}
                                            className="h-4 w-4 text-[#ff9900] focus:ring-[#ff9900] border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">Target Variable Analysis</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Workflow Engine</label>
                                <select 
                                    value={workflow}
                                    onChange={(e) => setWorkflow(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff9900] focus:ring-[#ff9900] sm:text-sm p-2 border mb-4"
                                >
                                    <option value="standard">Standard EDA Workflow (n8n)</option>
                                    <option value="deep">Deep Learning Analysis (Experimental)</option>
                                    <option value="quick">Quick Profile (Fast)</option>
                                </select>
                                
                                <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                                    <div className="flex gap-2">
                                        <SettingsIcon size={16} className="text-blue-600 mt-0.5" />
                                        <p className="text-xs text-blue-700">
                                            The Standard EDA workflow includes data cleaning, profiling, and AI-powered insights generation using Gemini Pro.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setAnalysisOptions({
                                        summaryStats: true,
                                        correlationHeatmap: true,
                                        missingValues: true,
                                        targetAnalysis: false
                                    });
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-all"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedFile || isLoading}
                                className={`
                                    flex items-center gap-2 px-6 py-2.5 rounded-md font-bold text-white shadow-sm transition-all
                                    ${!selectedFile || isLoading 
                                        ? 'bg-gray-300 cursor-not-allowed' 
                                        : 'bg-[#ff9900] hover:bg-[#e68a00] hover:shadow-md transform hover:-translate-y-0.5'}
                                `}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Running Analysis...
                                    </>
                                ) : (
                                    <>
                                        <Play size={18} fill="currentColor" />
                                        Run AutoEDA
                                    </>
                                )}
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Sidebar / History */}
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Recent Runs" className="h-full">
                        {stats.recentReports.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recentReports.map((report) => (
                                    <div 
                                        key={report.report_id}
                                        onClick={() => navigate(`/analysis-report/${report.report_id}`)}
                                        className="group p-3 rounded-md border border-gray-100 hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-medium text-gray-900 truncate max-w-[150px]" title={report.original_filename}>
                                                {report.original_filename}
                                            </h4>
                                            {getStatusBadge(report.status)}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Clock size={12} />
                                            <span>{new Date(report.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                                <button 
                                    onClick={() => navigate('/analysis-history')}
                                    className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium border border-dashed border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                                >
                                    View All History
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <History size={32} className="mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No recent runs found.</p>
                            </div>
                        )}
                    </Card>
                    
                    <div className="bg-gradient-to-br from-[#232f3e] to-[#37475a] rounded-lg p-6 text-white shadow-lg">
                        <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                        <p className="text-sm text-gray-300 mb-4">
                            Ensure your CSV files have clean headers and consistent data types for the best AI insights.
                        </p>
                        <a href="#" className="text-[#ff9900] text-sm font-bold hover:underline">Read Documentation &rarr;</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardNew;
