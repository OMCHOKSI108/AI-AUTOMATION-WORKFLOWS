import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { dataAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Search, FileText, Calendar, ArrowRight } from 'lucide-react';
import Card from './common/Card';
import Badge from './common/Badge';
import { getStatusVariant } from '../utils/helpers';

const AnalysisHistory = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await dataAPI.getHistory();
            setReports(response.reports || []);
        } catch (error) {
            console.error('Failed to fetch history:', error);
            toast.error('Failed to load analysis history');
        } finally {
            setLoading(false);
        }
    };

    const filteredReports = reports.filter(report => 
        report.original_filename?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
                    <p className="text-sm text-gray-600">Review and manage your previously generated analysis reports</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search analyses..." 
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#ff9900] focus:border-[#ff9900] shadow-sm"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ff9900]"></div>
                </div>
            ) : filteredReports.length === 0 ? (
                <Card className="py-16 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No reports found</h3>
                    <p className="text-gray-500 mt-1 mb-6">
                        {searchTerm ? 'Try adjusting your search terms' : 'Get started by running your first analysis'}
                    </p>
                    {!searchTerm && (
                        <Link 
                            to="/dashboard"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#ff9900] hover:bg-[#e68a00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff9900]"
                        >
                            Start New Analysis
                        </Link>
                    )}
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredReports.map((report) => (
                        <Link 
                            key={report.report_id} 
                            to={`/analysis-report/${report.report_id}`}
                            className="block group"
                        >
                            <Card className="hover:border-[#ff9900] transition-colors duration-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                                            <FileText className="text-blue-600 group-hover:text-[#ff9900] transition-colors" size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#ff9900] transition-colors">
                                                {report.original_filename}
                                            </h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <Calendar size={12} className="mr-1" />
                                                    {new Date(report.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                                <span className="text-gray-300">|</span>
                                                <span className="text-xs text-gray-500">ID: {report.report_id.substring(0, 8)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant={getStatusVariant(report.status)}>
                                            {report.status}
                                        </Badge>
                                        <ArrowRight size={16} className="text-gray-300 group-hover:text-[#ff9900] transition-colors" />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnalysisHistory;
