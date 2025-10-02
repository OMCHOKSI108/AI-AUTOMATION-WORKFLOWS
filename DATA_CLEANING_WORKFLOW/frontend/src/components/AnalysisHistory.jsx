import { Link, useNavigate } from 'react-router-dom';

const AnalysisHistory = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-background-light text-slate-800" style={{ fontFamily: 'Inter, sans-serif', width: '100%', margin: 0, padding: 0 }}>
            <div className="flex flex-col min-h-screen" style={{ width: '100%', margin: 0 }}>
                <header className="sticky top-0 bg-background-light/80 backdrop-blur-sm z-10">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 border-b border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="text-primary size-8">
                                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_6_330)">
                                            <path clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor" fillRule="evenodd"></path>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_6_330">
                                                <rect fill="white" height="48" width="48"></rect>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <h1 className="text-lg font-bold text-slate-800">SANS EDA</h1>
                            </div>
                            <div className="flex items-center gap-6">
                                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                                    <Link to="/dashboard" className="text-slate-600 hover:text-primary">Upload</Link>
                                    <Link to="/analysis-history" className="text-primary font-semibold">History</Link>
                                    <Link to="/settings" className="text-slate-600 hover:text-primary">Settings</Link>
                                </nav>
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA0Jze7UrePEe9x8I0jrdk3eF97NCl8OyFVyHywb0sSuXkd8NGxtrYFVcVMMc_P4Nmw5bQAUEdPDEXx8t6T87iPj07dopEa8tpeq9N1NQ7pJodA90vlJXN7C3h1O9STYCN7M73ZW051Qh0NFbWuxT6e0UP2Y6m2rMZq_P-xUi0IKUuAvzIIg8cJeIFkvFbhFGySpIgqBCMheuheK1YF_PJMKGTzlwKCKYogkwqWOLTjDSO4dWnGmHI2JUX2KYUzrM4AK5AC_yuNwA")' }}></div>
                                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-background-light"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-800">Past Analyses</h2>
                            <p className="mt-2 text-slate-500">Review your previously generated analysis reports.</p>
                        </div>
                        <div className="mb-6">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="Search analyses..." type="text" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <ul className="divide-y divide-gray-200">
                                <li className="group">
                                    <a className="flex items-center justify-between p-4 hover:bg-gray-50" href="#">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                                <span className="material-symbols-outlined">analytics</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">Q3 2023 Sales Performance Analysis</p>
                                                <p className="text-sm text-gray-500">Generated on: 2023-10-15</p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1">chevron_right</span>
                                    </a>
                                </li>
                                <li className="group">
                                    <a className="flex items-center justify-between p-4 hover:bg-slate-50" href="#">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                                <span className="material-symbols-outlined">bar_chart</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">Website Traffic &amp; User Engagement Report</p>
                                                <p className="text-sm text-slate-500">Generated on: 2023-09-28</p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary group-hover:translate-x-1">chevron_right</span>
                                    </a>
                                </li>
                                <li className="group">
                                    <a className="flex items-center justify-between p-4 hover:bg-slate-50" href="#">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                                <span className="material-symbols-outlined">pie_chart</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">Marketing Campaign ROI Analysis</p>
                                                <p className="text-sm text-slate-500">Generated on: 2023-09-05</p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary group-hover:translate-x-1">chevron_right</span>
                                    </a>
                                </li>
                                <li className="group">
                                    <a className="flex items-center justify-between p-4 hover:bg-slate-50" href="#">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                                <span className="material-symbols-outlined">show_chart</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">Customer Churn Prediction Model</p>
                                                <p className="text-sm text-slate-500">Generated on: 2023-08-21</p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary group-hover:translate-x-1">chevron_right</span>
                                    </a>
                                </li>
                                <li className="group">
                                    <a className="flex items-center justify-between p-4 hover:bg-slate-50" href="#">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                                <span className="material-symbols-outlined">inventory</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">Inventory Optimization Analysis</p>
                                                <p className="text-sm text-slate-500">Generated on: 2023-07-30</p>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary group-hover:translate-x-1">chevron_right</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AnalysisHistory;