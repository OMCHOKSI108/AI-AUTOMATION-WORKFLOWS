import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const fileInput = document.getElementById('file-upload');
        if (fileInput.files.length > 0) {
            setIsLoading(true);
            // Simulate analysis time
            setTimeout(() => {
                setIsLoading(false);
                navigate('/analysis-report');
            }, 3000);
        }
    };

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="bg-gray-50 text-gray-900" style={{ fontFamily: 'Inter, sans-serif', width: '100%', margin: 0, padding: 0 }}>
            <div className="flex min-h-screen" style={{ width: '100%', margin: 0 }}>
                <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
                    <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
                        <svg className="h-8 w-8" style={{ color: 'var(--primary-color)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        <h1 className="ml-2 text-xl font-bold text-gray-900">SANS EDA</h1>
                    </div>
                    <nav className="flex-1 space-y-2 px-2 py-4">
                        <Link to="/dashboard" className="flex items-center rounded-md px-4 py-2" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)' }}>
                            <span className="material-symbols-outlined mr-3">upload_file</span>
                            Upload
                        </Link>
                        <Link to="/analysis-history" className="flex items-center rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100">
                            <span className="material-symbols-outlined mr-3">history</span>
                            History
                        </Link>
                        <Link to="/settings" className="flex items-center rounded-md px-4 py-2 text-gray-600 hover:bg-gray-100">
                            <span className="material-symbols-outlined mr-3">settings</span>
                            Settings
                        </Link>
                    </nav>
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center">
                            <img
                                alt="User avatar"
                                className="h-10 w-10 rounded-full"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAggPBsaFaDH6KDeBlavr-_Zr5mtgs-DIia5mBpQnRNiCJPmZReXULzpIPl0PkmfhckAaqE0r_sKoLJtjZ6RQzUAm9lpGYW8QDsxwdLagDUcBu6KJsM0tAS_V3KxxtHGxcddOCejJk6v8on4FhSRFmJul0n8aUrYSpDg7xZtzjB1I8ZYzIC6a4tDbYsUzsNAupLiRFaxgUkUVwLCCYjVGTpg8ka7Hntn1F4HMsS2DgX2To_CeUg0luncyfb_qHjKKvIVoZ9cPdYA"
                            />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Jane Doe</p>
                                <p className="text-xs text-gray-500">jane.doe@example.com</p>
                            </div>
                        </div>
                    </div>
                </aside>
                <div className="flex flex-1 flex-col">
                    <header className="flex h-16 items-center justify-end border-b border-gray-200 px-6">
                        <button
                            onClick={handleLogout}
                            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 border border-gray-300"
                            style={{ cursor: 'pointer' }}
                        >
                            Logout
                        </button>
                    </header>
                    <main className="flex-1 p-8" id="main-content">
                        <div className="mx-auto max-w-2xl">
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
                                                            <label className="relative cursor-pointer rounded-md bg-transparent font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2" htmlFor="file-upload">
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
                                                        backgroundColor: 'var(--primary-color)',
                                                        cursor: 'pointer'
                                                    }}
                                                    onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
                                                    onMouseOut={(e) => e.target.style.backgroundColor = 'var(--primary-color)'}
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
                                        <svg aria-hidden="true" className="h-8 w-8 animate-spin fill-blue-600 text-gray-200" fill="none" viewBox="0 0 100 101" xmlns="http://www.w3.org/2000/svg">
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