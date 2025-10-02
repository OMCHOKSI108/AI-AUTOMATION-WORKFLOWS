import { Link } from 'react-router-dom';

const Welcome = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Inter, sans-serif', color: '#111827' }}>
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
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Link to="/login" style={{ textDecoration: 'none' }}>
                                        <button
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
                                    </Link>
                                    <Link to="/signup" style={{ textDecoration: 'none' }}>
                                        <button
                                            style={{
                                                padding: '0.5rem 1rem',
                                                borderRadius: '0.5rem',
                                                backgroundColor: '#111827',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                color: '#ffffff',
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'background-color 150ms'
                                            }}
                                            onMouseOver={(e) => e.target.style.backgroundColor = '#1f2937'}
                                            onMouseOut={(e) => e.target.style.backgroundColor = '#111827'}
                                        >
                                            Signup
                                        </button>
                                    </Link>
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
                                margin: '0 auto'
                            }}>
                                Exploratory Data Analysis Made Simple
                            </p>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Welcome;