import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { dataAPI } from '../services/api';
import toast from 'react-hot-toast';

const AnalysisHistory = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, [page]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await dataAPI.getHistory(page, 20);
            setReports(response.reports);
            setTotalPages(response.pagination.totalPages);
        } catch (error) {
            console.error('Failed to fetch history:', error);
            toast.error('Failed to load analysis history');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-black" style={{ fontFamily: 'Inter, sans-serif', width: '100%', margin: 0, padding: 0, backgroundColor: '#f6f7f8', overflowX: 'hidden', height: '100vh' }}>
            <div className="flex h-full" style={{ width: '100%', margin: 0 }}>
                <aside className={`flex w-64 md:w-80 bg-white border-r flex-col fixed md:relative z-50 h-full transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`} style={{ borderColor: '#e2e8f0' }}>
                    <div className="p-6 flex items-center gap-3">
                        <div className="bg-blue-600 text-white rounded-full size-10 flex items-center justify-center font-bold text-lg">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">SANS EDA</h1>
                            <p className="text-sm text-gray-600">{user?.username}</p>
                        </div>
                    </div>
                    <nav className="flex-1 px-4 py-2 space-y-2">
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-lg text-black hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <span className="material-symbols-outlined">upload_file</span>
                            <span>Upload</span>
                        </Link>
                        <Link to="/analysis-history" className="flex items-center gap-3 px-4 py-2 rounded-lg text-black bg-blue-50 text-blue-600 transition-colors">
                            <span className="material-symbols-outlined">history</span>
                            <span>History</span>
                        </Link>
                        <Link to="/analysis-report" className="flex items-center gap-3 px-4 py-2 rounded-lg text-black hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <span className="material-symbols-outlined">assessment</span>
                            <span>Reports</span>
                        </Link>
                        <Link to="/settings" className="flex items-center gap-3 px-4 py-2 rounded-lg text-black hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <span className="material-symbols-outlined">settings</span>
                            <span>Settings</span>
                        </Link>
                    </nav>
                    <div className="p-4 mt-auto">
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="w-full text-white font-bold py-2 px-4 rounded-lg"
                            style={{ backgroundColor: '#1173d4', cursor: 'pointer' }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#0e5bb5'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#1173d4'}
                        >
                            New Analysis
                        </button>
                    </div>
                </aside>
                {isMobileMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}
                <main className="flex-1 h-full p-4 md:p-8 overflow-y-auto">
                    <div className="md:hidden flex items-center justify-between mb-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h2 className="text-xl font-bold">Past Analyses</h2>
                    </div>
                    <div className="w-full">
                        <div className="hidden md:block mb-8">
                            <h2 className="text-3xl font-bold tracking-tight text-black">Past Analyses</h2>
                            <p className="mt-2 text-gray-600">Review your previously generated analysis reports.</p>
                        </div>
                        <div className="mb-6">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                <input className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600" placeholder="Search analyses..." type="text" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-2 text-gray-500">Loading analysis history...</p>
                                </div>
                            ) : reports.length === 0 ? (
                                <div className="p-8 text-center">
                                    <span className="material-symbols-outlined text-4xl text-gray-300">analytics</span>
                                    <p className="mt-2 text-gray-500">No analysis reports found.</p>
                                    <p className="text-sm text-gray-400">Upload a dataset to get started.</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {reports.map((report) => (
                                        <li key={report.report_id} className="group">
                                            <Link to={`/analysis-report`} state={{ reportId: report.report_id }} className="flex items-center justify-between p-4 hover:bg-gray-50">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                                        <span className="material-symbols-outlined">analytics</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{report.original_filename}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Status: <span className={`font-medium ${report.status === 'completed' ? 'text-green-600' : report.status === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}>
                                                                {report.status}
                                                            </span> | Generated on: {new Date(report.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="material-symbols-outlined text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1">chevron_right</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AnalysisHistory;