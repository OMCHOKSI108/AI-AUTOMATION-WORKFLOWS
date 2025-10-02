import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

const Signup = () => {
    return (
        <div style={{ backgroundColor: 'var(--background-light)', fontFamily: 'Inter, sans-serif', width: '100%', minHeight: '100vh', margin: 0, padding: 0 }}>
            <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '28rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                        <svg
                            style={{ margin: '0 auto', height: '3rem', width: 'auto', color: 'var(--primary-color)' }}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                            <path d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12v7a2 2 0 002 2h18a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        <h2 style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '1.875rem', fontWeight: '700', lineHeight: '2.25rem', letterSpacing: '-0.025em', color: '#111827' }}>
                            Create your account
                        </h2>
                        <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>
                            to start analyzing your data
                        </p>
                    </div>
                    <form action="#" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} method="POST">
                        <input name="remember" type="hidden" value="true" />
                        <div style={{ borderRadius: '0.375rem', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}>
                            <div>
                                <label className="sr-only" htmlFor="email-address">Email address</label>
                                <input
                                    autoComplete="email"
                                    style={{
                                        position: 'relative',
                                        display: 'block',
                                        width: '100%',
                                        appearance: 'none',
                                        borderRadius: '0.375rem 0.375rem 0 0',
                                        border: '1px solid #d1d5db',
                                        padding: '0.5rem 0.75rem',
                                        color: '#111827',
                                        fontSize: '0.875rem'
                                    }}
                                    id="email-address"
                                    name="email"
                                    placeholder="Email address"
                                    required
                                    type="email"
                                    onFocus={(e) => {
                                        e.target.style.zIndex = '10';
                                        e.target.style.borderColor = 'var(--primary-color)';
                                        e.target.style.outline = 'none';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#d1d5db';
                                    }}
                                />
                            </div>
                            <div>
                                <label className="sr-only" htmlFor="username">Username</label>
                                <input
                                    autoComplete="username"
                                    style={{
                                        position: 'relative',
                                        display: 'block',
                                        width: '100%',
                                        appearance: 'none',
                                        borderRadius: '0',
                                        border: '1px solid #d1d5db',
                                        borderTop: 'none',
                                        padding: '0.5rem 0.75rem',
                                        color: '#111827',
                                        fontSize: '0.875rem'
                                    }}
                                    id="username"
                                    name="username"
                                    placeholder="Username"
                                    required
                                    type="text"
                                    onFocus={(e) => {
                                        e.target.style.zIndex = '10';
                                        e.target.style.borderColor = 'var(--primary-color)';
                                        e.target.style.outline = 'none';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#d1d5db';
                                    }}
                                />
                            </div>
                            <div>
                                <label className="sr-only" htmlFor="password">Password</label>
                                <input
                                    autoComplete="current-password"
                                    style={{
                                        position: 'relative',
                                        display: 'block',
                                        width: '100%',
                                        appearance: 'none',
                                        borderRadius: '0 0 0.375rem 0.375rem',
                                        border: '1px solid #d1d5db',
                                        borderTop: 'none',
                                        padding: '0.5rem 0.75rem',
                                        color: '#111827',
                                        fontSize: '0.875rem'
                                    }}
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    required
                                    type="password"
                                    onFocus={(e) => {
                                        e.target.style.zIndex = '10';
                                        e.target.style.borderColor = 'var(--primary-color)';
                                        e.target.style.outline = 'none';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#d1d5db';
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    width: '100%',
                                    justifyContent: 'center',
                                    borderRadius: '0.375rem',
                                    border: 'none',
                                    backgroundColor: 'var(--primary-color)',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: '#ffffff',
                                    cursor: 'pointer',
                                    transition: 'background-color 150ms'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'var(--primary-color)'}
                                onFocus={(e) => {
                                    e.target.style.outline = 'none';
                                    e.target.style.boxShadow = '0 0 0 2px var(--primary-color)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.boxShadow = 'none';
                                }}
                                type="submit"
                            >
                                Sign Up
                            </button>
                        </div>
                        <div style={{ fontSize: '0.875rem', textAlign: 'center' }}>
                            <p style={{ color: '#6b7280' }}>
                                Already have an account?{' '}
                                <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '500', textDecoration: 'none' }}>
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;