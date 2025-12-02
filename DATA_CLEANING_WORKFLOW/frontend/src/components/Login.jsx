import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { BarChart3, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const Login = () => {
    const [formData, setFormData] = useState({
        emailOrUsername: '',
        password: '',
        rememberMe: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login, error, clearError, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Clear errors when component mounts or form data changes
    useEffect(() => {
        if (error) {
            clearError();
        }
    }, [formData, error, clearError]);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        if (!formData.emailOrUsername.trim()) {
            toast.error('Email or username is required');
            return false;
        }
        if (!formData.password.trim()) {
            toast.error('Password is required');
            return false;
        }
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await login({
                emailOrUsername: formData.emailOrUsername.trim(),
                password: formData.password
            });

            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <BarChart3 className="h-10 w-10 text-[#ff9900]" strokeWidth={2.5} />
                        <span className="text-2xl font-bold text-[#232f3e]">
                            AutoEDA <span className="text-[#ff9900]">Studio</span>
                        </span>
                    </Link>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Welcome back! Please enter your credentials
                    </p>
                </div>
                <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-200">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    htmlFor="emailOrUsername"
                                >
                                    Email or Username *
                                </label>
                                <input
                                    autoComplete="username"
                                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#ff9900] focus:ring-[#ff9900] focus:outline-none transition-colors"
                                    id="emailOrUsername"
                                    name="emailOrUsername"
                                    required
                                    type="text"
                                    value={formData.emailOrUsername}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email or username"
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    htmlFor="password"
                                >
                                    Password *
                                </label>
                                <div className="relative">
                                    <input
                                        autoComplete="current-password"
                                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-[#ff9900] focus:ring-[#ff9900] focus:outline-none transition-colors"
                                        id="password"
                                        name="password"
                                        required
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-[#ff9900] focus:ring-[#ff9900] border-gray-300 rounded"
                                    />
                                    <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">Remember me</label>
                                </div>
                                <a href="#" className="text-sm text-[#007185] hover:text-[#005a6c] hover:underline">Forgot your password?</a>
                            </div>
                            <div className="pt-2">
                                <button
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center items-center gap-2 bg-[#ff9900] text-white px-6 py-3 rounded-lg font-bold text-base hover:bg-[#e68a00] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                                    type="submit"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Signing in...</span>
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </div>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {"Don't have an account? "}
                            <Link to="/signup" className="text-[#ff9900] font-bold hover:text-[#e68a00] hover:underline transition-colors">
                                Sign up for free
                            </Link>
                        </p>
                        <Link to="/" className="block mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;