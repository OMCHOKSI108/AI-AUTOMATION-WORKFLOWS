import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
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
    }, [formData]);

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
        <div style={{ backgroundColor: 'var(--background-color)', fontFamily: 'Inter, sans-serif', color: 'var(--text-color)', minHeight: '100vh', width: '100%', margin: 0, padding: '1rem' }}>
            <div style={{ display: 'flex', minHeight: '100vh', width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', margin: 0 }}>
                <div style={{ width: '100%', maxWidth: '28rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                        <svg
                            style={{ margin: '0 auto', height: '3rem', width: 'auto', color: 'var(--primary-color)', display: 'block' }}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 21a9.004 9.004 0 0 0 8.716-6.983c.205-.536.42-.997.42-1.442 0-3.328-5.373-6-12-6S.864 9.247.864 12.575c0 .445.215.906.42 1.442A9.004 9.004 0 0 0 12 21Z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 3v1m0 16v1m-7.07-7.071 1.414-1.414M17.657 6.343l-1.414 1.414m-12.728 0 1.414 1.414M19.071 17.657l-1.414-1.414M2.929 12h1m16.142 0h1M4.929 4.929l1.414 1.414M17.657 17.657l-1.414-1.414"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <h2 style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '1.875rem', fontWeight: '700', lineHeight: '2.25rem', letterSpacing: '-0.025em', color: '#111827' }}>
                            Sign in to your account
                        </h2>
                        <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                            Welcome back to SANS EDA
                        </p>
                    </div>
                    <div
                        style={{ borderRadius: '0.5rem', padding: '2rem', backgroundColor: 'var(--card-background-color)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    >
                        {error && (
                            <div style={{
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fecaca',
                                color: '#dc2626',
                                padding: '0.75rem',
                                borderRadius: '0.375rem',
                                marginBottom: '1.5rem',
                                fontSize: '0.875rem'
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label
                                    style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}
                                    htmlFor="emailOrUsername"
                                >
                                    Email or Username *
                                </label>
                                <input
                                    autoComplete="username"
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        appearance: 'none',
                                        borderRadius: '0.375rem',
                                        border: `1px solid ${formData.emailOrUsername ? '#10b981' : 'var(--input-border-color)'}`,
                                        padding: '0.75rem',
                                        fontSize: '0.875rem',
                                        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                                        outline: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--input-focus-border-color)';
                                        e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = formData.emailOrUsername ? '#10b981' : 'var(--input-border-color)';
                                        e.target.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
                                    }}
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
                                    style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}
                                    htmlFor="password"
                                >
                                    Password *
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        autoComplete="current-password"
                                        style={{
                                            display: 'block',
                                            width: '100%',
                                            appearance: 'none',
                                            borderRadius: '0.375rem',
                                            border: `1px solid ${formData.password ? '#10b981' : 'var(--input-border-color)'}`,
                                            padding: '0.75rem',
                                            paddingRight: '2.5rem',
                                            fontSize: '0.875rem',
                                            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                                            outline: 'none',
                                            transition: 'all 0.2s'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'var(--input-focus-border-color)';
                                            e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = formData.password ? '#10b981' : 'var(--input-border-color)';
                                            e.target.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
                                        }}
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
                                        style={{
                                            position: 'absolute',
                                            right: '0.75rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#6b7280',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleInputChange}
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                    <label htmlFor="rememberMe" style={{ fontSize: '0.875rem', color: '#374151' }}>Remember me</label>
                                </div>
                                <a href="#" style={{ fontSize: '0.875rem', color: 'var(--primary-color)', textDecoration: 'none' }}>Forgot your password?</a>
                            </div>
                            <div>
                                <button
                                    disabled={isSubmitting}
                                    style={{
                                        display: 'flex',
                                        width: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '0.375rem',
                                        border: 'none',
                                        backgroundColor: isSubmitting ? '#9ca3af' : 'var(--primary-color)',
                                        padding: '0.75rem 1rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: '#ffffff',
                                        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        transition: 'background-color 150ms',
                                        outline: 'none'
                                    }}
                                    onMouseOver={(e) => {
                                        if (!isSubmitting) e.target.style.backgroundColor = '#4338ca';
                                    }}
                                    onMouseOut={(e) => {
                                        if (!isSubmitting) e.target.style.backgroundColor = 'var(--primary-color)';
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.boxShadow = '0 0 0 2px #fff, 0 0 0 4px #6366f1';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
                                    }}
                                    type="submit"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <LoadingSpinner size="sm" text="" />
                                            <span style={{ marginLeft: '0.5rem' }}>Signing in...</span>
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                    Don't have an account?{' '}
                                    <Link to="/signup" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>
                                        Sign up for free
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;