import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Welcome = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Inter, sans-serif', color: '#111827', overflowX: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0,
                        opacity: 0.1
                    }}
                >
                    <source src="https://cdn.pixabay.com/video/2024/05/27/211592_large.mp4" type="video/mp4" />
                </video>
                <div style={{ position: 'relative', display: 'flex', height: '100%', width: '100%', flexDirection: 'column', zIndex: 1 }}>
                    <header style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, width: '100%' }}>
                        <div style={{ width: '100%', padding: '1rem 2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg
                                        style={{ height: '2rem', width: 'auto', color: '#3b82f6' }}
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
                                    </svg>
                                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>SANS EDA</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {isAuthenticated ? (
                                        <>
                                            <span style={{ fontSize: '0.875rem', color: '#6b7280', marginRight: '1rem' }}>
                                                Welcome back, {user?.username}!
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => navigate('/dashboard')}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '0.5rem',
                                                    backgroundColor: '#3b82f6',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#ffffff',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 150ms'
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                                            >
                                                Go to Dashboard
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => navigate('/login')}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '0.5rem',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#1f2937',
                                                    backgroundColor: '#e5e7eb',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 150ms'
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#d1d5db'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                                            >
                                                Login
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => navigate('/signup')}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '0.5rem',
                                                    backgroundColor: '#3b82f6',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#ffffff',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 150ms'
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                                            >
                                                Signup
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>
                    <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
                            <h1 style={{
                                fontSize: 'clamp(3rem, 10vw, 4.5rem)',
                                fontWeight: '900',
                                letterSpacing: '-0.05em',
                                color: '#111827',
                                marginBottom: '1rem'
                            }}>
                                SANS EDA
                            </h1>
                            <p style={{
                                fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                                color: '#6b7280',
                                fontWeight: '500',
                                maxWidth: '600px',
                                margin: '0 auto 2rem'
                            }}>
                                Exploratory Data Analysis Made Simple
                            </p>
                            {!isAuthenticated && (
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/signup')}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '0.5rem',
                                            backgroundColor: '#3b82f6',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            color: '#ffffff',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 150ms',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.backgroundColor = '#2563eb';
                                            e.target.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.backgroundColor = '#3b82f6';
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        Get Started Free
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/login')}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '0.5rem',
                                            backgroundColor: 'transparent',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            color: '#374151',
                                            border: '2px solid #d1d5db',
                                            cursor: 'pointer',
                                            transition: 'all 150ms'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.borderColor = '#9ca3af';
                                            e.target.style.backgroundColor = '#f9fafb';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.borderColor = '#d1d5db';
                                            e.target.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        Sign In
                                    </button>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Welcome;