import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dataAPI } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const fileInput = document.getElementById('file-upload');
        if (fileInput.files.length === 0) {
            toast.error('Please select a file to upload');
            return;
        }

        const file = fileInput.files[0];
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('dataset', file);

            const response = await dataAPI.upload(formData);
            toast.success('File uploaded successfully! Processing...');

            // Navigate to analysis report with the report ID
            navigate('/analysis-report', { state: { reportId: response.reportId } });
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.error || 'Upload failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const { user, logout } = useAuth();

    const handleLogout = () => {
        // call auth logout which clears localStorage and state
        logout();
        navigate('/login');
    };

    return (
        <div className="text-gray-900" style={{ fontFamily: 'Inter, sans-serif', width: '100%', margin: 0, padding: 0, backgroundColor: '#f6f7f8', overflowX: 'hidden', height: '100vh' }}>
            <div className="flex h-full" style={{ width: '100%', margin: 0 }}>
                <aside className={`flex w-64 md:w-80 bg-white border-r border-gray-200 flex-col fixed md:relative z-50 h-full transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                    <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
                        <svg className="h-8 w-8" style={{ color: '#1173d4' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        <h1 className="ml-2 text-xl font-bold text-gray-900">SANS EDA</h1>
                    </div>
                    <nav className="flex-1 space-y-2 px-2 py-4">
                        <Link to="/dashboard" className="flex items-center rounded-md px-4 py-2" style={{ backgroundColor: 'rgba(17, 115, 212, 0.1)', color: '#1173d4' }}>
                            <span className="material-symbols-outlined mr-3">upload_file</span>
                            Upload
                        </Link>
                        <Link to="/analysis-history" className="flex items-center rounded-md px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <span className="material-symbols-outlined mr-3">history</span>
                            History
                        </Link>
                        <Link to="/analysis-report" className="flex items-center rounded-md px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <span className="material-symbols-outlined mr-3">assessment</span>
                            Reports
                        </Link>
                        <Link to="/settings" className="flex items-center rounded-md px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <span className="material-symbols-outlined mr-3">settings</span>
                            Settings
                        </Link>
                    </nav>
                    <div className="border-t border-gray-200 p-4 mt-auto">
                        <div className="flex items-center">
                            {/* Simple avatar using initials when no image available */}
                            <div className="h-10 w-10 flex items-center justify-center rounded-full text-white font-semibold" style={{ backgroundColor: '#1173d4' }}>
                                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{user?.username || 'User'}</p>
                                <p className="text-xs text-gray-500">{user?.email || 'Not signed in'}</p>
                            </div>
                        </div>
                    </div>
                </aside>
                {isMobileMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}
                <div className="flex flex-1 flex-col md:ml-0">
                    <header className="flex h-16 items-center justify-between border-b border-gray-200 px-6 bg-white">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="flex-1"></div>
                        <button
                            onClick={handleLogout}
                            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 border border-gray-300"
                            style={{ cursor: 'pointer' }}
                        >
                            Logout
                        </button>
                    </header>
                    <main className="flex-1 p-8" id="main-content">
                        <div className="w-full">
                            {!isLoading ? (
                                <div id="upload-form">
                                    <h2 className="mb-6 text-3xl font-bold text-gray-900">Upload Dataset</h2>
                                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                                        <form className="space-y-4" onSubmit={handleSubmit}>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700" htmlFor="file-upload">Select a file</label>
                                                <div className="mt-2 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                                                    <div className="space-y-1 text-center">
                                                        <span className="material-symbols-outlined text-5xl text-gray-400">cloud_upload</span>
                                                        <div className="flex text-sm text-gray-600">
                                                            <label className="relative cursor-pointer rounded-md bg-transparent font-medium hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2" style={{ color: '#1173d4' }} htmlFor="file-upload">
                                                                <span>Upload a file</span>
                                                                <input accept=".csv, .xlsx, .txt" className="sr-only" id="file-upload" name="file-upload" required type="file" />
                                                            </label>
                                                            <p className="pl-1">or drag and drop</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500">CSV, XLSX, TXT up to 10MB</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <button
                                                    className="flex w-full justify-center rounded-md border border-transparent px-4 py-3 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                                                    style={{
                                                        backgroundColor: '#1173d4',
                                                        cursor: 'pointer'
                                                    }}
                                                    onMouseOver={(e) => e.target.style.backgroundColor = '#0e5bb5'}
                                                    onMouseOut={(e) => e.target.style.backgroundColor = '#1173d4'}
                                                    type="submit"
                                                >
                                                    Analyze Dataset
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6" id="loading-indicator">
                                    <div className="flex items-center">
                                        <svg aria-hidden="true" className="h-8 w-8 animate-spin text-gray-200" fill="none" viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg" style={{ color: '#1173d4' }}>
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
                                        </svg>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Your file is being analyzed...</h3>
                                            <p className="text-sm text-gray-500">Please wait while we process your data.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;