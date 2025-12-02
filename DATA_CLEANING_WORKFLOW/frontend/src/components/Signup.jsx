import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { BarChart3 } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { signup, error, clearError, isAuthenticated } = useAuth();
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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.username.trim()) {
            toast.error('Username is required');
            return false;
        }
        if (formData.username.length < 3) {
            toast.error('Username must be at least 3 characters');
            return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            toast.error('Username can only contain letters, numbers, and underscores');
            return false;
        }
        if (!formData.email.trim()) {
            toast.error('Email is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error('Please enter a valid email address');
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
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await signup({
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password
            });

            toast.success('Account created successfully! You are now logged in.');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Signup failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50">
            <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    {/* Home Link */}
                    <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-[#ff9900] transition-colors mb-4">
                        ← Back to Home
                    </Link>
                    
                    <div className="flex flex-col gap-8">
                        <div className="text-center">
                            <BarChart3 className="mx-auto h-12 w-auto text-[#ff9900] mb-4" />
                            <h2 className="text-3xl font-bold text-[#232f3e]">
                                Create your account
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Start analyzing your data with powerful insights
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    htmlFor="email"
                                >
                                    Email Address *
                                </label>
                                <input
                                    autoComplete="email"
                                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#ff9900] focus:ring-[#ff9900] focus:outline-none transition-colors"
                                    id="email"
                                    name="email"
                                    placeholder="Email address"
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    htmlFor="username"
                                >
                                    Username *
                                </label>
                                <input
                                    autoComplete="username"
                                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#ff9900] focus:ring-[#ff9900] focus:outline-none transition-colors"
                                    id="username"
                                    name="username"
                                    placeholder="Username"
                                    required
                                    type="text"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    htmlFor="password"
                                >
                                    Password *
                                </label>
                                <input
                                    autoComplete="current-password"
                                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#ff9900] focus:ring-[#ff9900] focus:outline-none transition-colors"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    required
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    htmlFor="confirmPassword"
                                >
                                    Confirm Password *
                                </label>
                                <input
                                    autoComplete="current-password"
                                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#ff9900] focus:ring-[#ff9900] focus:outline-none transition-colors"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    required
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <button
                                    disabled={isSubmitting}
                                    className="w-full flex justify-center items-center bg-[#ff9900] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e68a00] hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md"
                                    type="submit"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <LoadingSpinner size="sm" text="" />
                                            <span className="ml-2">Creating Account...</span>
                                        </>
                                    ) : (
                                        'Sign Up'
                                    )}
                                </button>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-[#007185] font-semibold hover:text-[#005a6c] hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;