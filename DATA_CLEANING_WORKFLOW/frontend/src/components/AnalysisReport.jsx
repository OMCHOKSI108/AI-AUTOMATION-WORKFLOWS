import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { dataAPI } from '../services/api';
import toast from 'react-hot-toast';

const AnalysisReport = () => {
    const location = useLocation();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const reportId = location.state?.reportId;
        if (reportId) {
            fetchReport(reportId);
        } else {
            toast.error('No report ID provided');
            setLoading(false);
        }
    }, [location.state]);

    const fetchReport = async (reportId) => {
        try {
            setLoading(true);
            const response = await dataAPI.getReport(reportId);
            setReport(response);
        } catch (error) {
            console.error('Failed to fetch report:', error);
            toast.error('Failed to load report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: '100%', margin: 0, padding: 0, fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
            <div className="flex min-h-screen w-full flex-col" style={{ margin: 0 }}>
                <header className="sticky top-0 z-10 flex h-16 items-center border-b border-gray-200 bg-white bg-opacity-80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-3">
                            <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                            <h1 className="text-xl font-bold">SANS EDA</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2" style={{ backgroundColor: '#1173d4', borderColor: '#1173d4' }} onMouseOver={(e) => e.target.style.backgroundColor = '#0e5bb5'} onMouseOut={(e) => e.target.style.backgroundColor = '#1173d4'}>
                                <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                                Get PDF Export
                            </button>
                        </div>
                    </div>
                </header>
                <main className="flex-1">
                    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold leading-tight text-gray-900">Dynamic Report: Customer Segmentation</h2>
                            <p className="mt-1 text-gray-600">Generated on: October 26, 2023</p>
                        </div>
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            <div className="lg:col-span-2">
                                <div className="space-y-8">
                                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                        <h3 className="text-xl font-semibold text-gray-900">Visualizations</h3>
                                        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                                <img alt="Sales distribution chart" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARAAKmF4XijdJgssB7ZvIiBaN1E9TvJPKkurccRydbpMBujZVYpNz9D6y02ctIhXUrH7GT4RaM5lmq6e339G-C9VAcsIMD8NTCxahrGD3GSSy_WK5bSLC8gRCIsLXy2rWqryqHPUvwmnU-MKb1vLuLFt0ZyLWnTG-C7GMnA7eKjcTfUxCwO_5gwCZoePGXElR4wy3MJ3n7hMKFGhqm2yFMqRG8PH4YySYg_3bngUH97JP33qhIkILWPd8NOlcRzsQDkXbSuTYkWQ" />
                                            </div>
                                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                                <img alt="Marketing spend vs revenue plot" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUNY9cy0geEX-vV_D38bnUhqkw2HsUOV9Gd2xw2KdlwEzU3z6KI2KB8-Kt_N1Jq6kQQ0OJ2FqO5VizwYwPG92coJh4tqHj_7q8tQ6DjgOO1rIcVOsQ_2iUZXMBx6BXH-WZy9tkSww84r4-xv2ukyyMQDMGuwA2j4Ac8qfXbngduAP2jtZE_-G27qY1MNhqgI-JFKF5UFyaaSOU9zNdQERn_2Hwdz-8G8LbyiYQj5zkGdIneaZWRCqC6zgLHq9eNEZkW1sWL5AutA" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                        <h3 className="text-xl font-semibold text-gray-900">AI-Generated Insights</h3>
                                        <div className="mt-4 space-y-4 text-gray-600">
                                            <p>The analysis identifies three distinct customer segments based on purchasing behavior. Segment A, characterized by high frequency and low monetary value, represents the largest group. Segment B shows high monetary value but infrequent purchases, suggesting a potential for targeted loyalty programs. Segment C is a mix of moderate frequency and value.</p>
                                            <p>A strong positive correlation exists between website engagement time and conversion rates across all segments. This suggests that enhancing user experience and providing valuable content could significantly boost sales.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-1">
                                <div className="sticky top-24">
                                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                        <h3 className="text-xl font-semibold text-gray-900">Data Summary</h3>
                                        <div className="mt-4 space-y-4">
                                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                                <p className="text-sm text-gray-600">Number of Rows</p>
                                                <p className="text-sm font-medium text-gray-900">15,782</p>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                                <p className="text-sm text-gray-600">Number of Columns</p>
                                                <p className="text-sm font-medium text-gray-900">12</p>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                                <p className="text-sm text-gray-600">Data Types</p>
                                                <div className="flex flex-wrap justify-end gap-1">
                                                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">Numerical</span>
                                                    <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-800">Categorical</span>
                                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Datetime</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                                <p className="text-sm text-gray-600">Missing Values</p>
                                                <p className="text-sm font-medium text-red-600">3.2%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AnalysisReport;