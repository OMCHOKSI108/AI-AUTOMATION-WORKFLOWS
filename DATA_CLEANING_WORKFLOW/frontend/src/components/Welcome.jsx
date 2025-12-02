import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, Zap, Shield, TrendingUp, Database, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

const Welcome = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const features = [
        { icon: Zap, title: 'Lightning Fast', description: 'Automated EDA in seconds with AI-powered insights' },
        { icon: Shield, title: 'Secure & Private', description: 'Your data stays encrypted and protected' },
        { icon: TrendingUp, title: 'Smart Analytics', description: 'Advanced statistical analysis and visualizations' },
        { icon: Database, title: 'Multi-Format', description: 'Supports CSV, Excel, JSON and more' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-8 w-8 text-[#ff9900]" strokeWidth={2.5} />
                            <span className="text-xl font-bold text-[#232f3e]">
                                AutoEDA <span className="text-[#ff9900]">Studio</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {isAuthenticated ? (
                                <>
                                    <span className="hidden md:block text-sm text-gray-600 mr-2">
                                        Welcome back, <span className="font-semibold">{user?.username}</span>!
                                    </span>
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="px-5 py-2 bg-[#ff9900] text-white rounded-lg font-semibold hover:bg-[#e68a00] transition-all shadow-md hover:shadow-lg"
                                    >
                                        Go to Dashboard
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="px-5 py-2 bg-[#ff9900] text-white rounded-lg font-semibold hover:bg-[#e68a00] transition-all shadow-md hover:shadow-lg"
                                    >
                                        Get Started
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
                            <Sparkles size={16} />
                            AI-Powered Data Analysis
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#232f3e] mb-6 leading-tight">
                            Transform Data into
                            <br />
                            <span className="text-[#ff9900]">Actionable Insights</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                            AutoEDA Studio automates exploratory data analysis with powerful visualizations, 
                            statistical summaries, and AI-generated insights. Upload your dataset and get professional 
                            analysis reports in minutes.
                        </p>
                        
                        {!isAuthenticated && (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="group px-8 py-4 bg-[#ff9900] text-white rounded-lg font-bold text-lg hover:bg-[#e68a00] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                                >
                                    Start Analyzing for Free
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-300 rounded-lg font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                                >
                                    Sign In
                                </button>
                            </div>
                        )}

                        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-600" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-600" />
                                <span>Free tier available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={18} className="text-green-600" />
                                <span>Setup in 60 seconds</span>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100"
                                >
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                        <Icon className="text-[#ff9900]" size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* How It Works */}
                    <div className="mt-24 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#232f3e] mb-12">
                            How It Works
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <div className="relative">
                                <div className="w-16 h-16 bg-[#ff9900] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    1
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Dataset</h3>
                                <p className="text-gray-600">
                                    Upload your CSV, Excel, or JSON file. Support for files up to 50MB.
                                </p>
                            </div>
                            <div className="relative">
                                <div className="w-16 h-16 bg-[#ff9900] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    2
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Analysis</h3>
                                <p className="text-gray-600">
                                    Our AI engine analyzes your data, generates visualizations, and detects patterns.
                                </p>
                            </div>
                            <div className="relative">
                                <div className="w-16 h-16 bg-[#ff9900] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    3
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Get Insights</h3>
                                <p className="text-gray-600">
                                    Receive comprehensive reports with charts, statistics, and actionable insights.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    {!isAuthenticated && (
                        <div className="mt-24 bg-gradient-to-r from-[#232f3e] to-[#37475a] rounded-2xl p-12 text-center text-white shadow-2xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to unlock your data's potential?
                            </h2>
                            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                                Join thousands of data professionals who trust AutoEDA Studio for their analysis needs.
                            </p>
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-8 py-4 bg-[#ff9900] text-white rounded-lg font-bold text-lg hover:bg-[#e68a00] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Start Your Free Trial
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-6 w-6 text-[#ff9900]" />
                            <span className="font-bold text-gray-900">AutoEDA Studio</span>
                        </div>
                        <p className="text-sm text-gray-600">
                            &copy; 2025 AutoEDA Studio. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Welcome;