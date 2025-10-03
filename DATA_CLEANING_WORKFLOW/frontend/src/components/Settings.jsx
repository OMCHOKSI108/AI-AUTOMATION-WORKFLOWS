import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const Settings = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [inAppNotifications, setInAppNotifications] = useState(false);

    return (
        <div className="text-black" style={{ fontFamily: 'Inter, sans-serif', width: '100%', margin: 0, padding: 0, backgroundColor: '#f6f7f8', overflowX: 'hidden', height: '100vh' }}>
            <div className="flex h-full" style={{ width: '100%', margin: 0 }}>
                <aside className={`flex w-64 md:w-80 bg-white border-r flex-col fixed md:relative z-50 h-full transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`} style={{ borderColor: '#e2e8f0' }}>
                    <div className="p-6 flex items-center gap-3">
                        <div className="bg-blue-600 text-white rounded-full size-10 flex items-center justify-center font-bold text-lg">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">SANS EDA</h1>
                            <p className="text-sm text-gray-600">{user?.username}</p>
                        </div>
                    </div>
                    <nav className="flex-1 px-4 py-2 space-y-2">
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-lg text-black hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <span className="material-symbols-outlined">upload_file</span>
                            <span>Upload</span>
                        </Link>
                        <Link to="/analysis-history" className="flex items-center gap-3 px-4 py-2 rounded-lg text-black hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <span className="material-symbols-outlined">history</span>
                            <span>History</span>
                        </Link>
                        <Link to="/analysis-report" className="flex items-center gap-3 px-4 py-2 rounded-lg text-black hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <span className="material-symbols-outlined">assessment</span>
                            <span>Reports</span>
                        </Link>
                        <Link to="/settings" className="flex items-center gap-3 px-4 py-2 rounded-lg text-black bg-blue-50 text-blue-600 transition-colors">
                            <span className="material-symbols-outlined">settings</span>
                            <span>Settings</span>
                        </Link>
                    </nav>
                    <div className="p-4 mt-auto">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full text-white font-bold py-2 px-4 rounded-lg"
                            style={{ backgroundColor: '#1173d4', cursor: 'pointer' }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#0e5bb5'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#1173d4'}
                        >
                            New Analysis
                        </button>
                        <button
                            onClick={() => logout()}
                            className="flex items-center gap-3 px-4 py-2 mt-4 rounded-lg text-black w-full text-left"
                            style={{ cursor: 'pointer' }}
                        >
                            <span className="material-symbols-outlined">logout</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>
                {isMobileMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}
                <main className="flex-1 h-full p-4 md:p-8 overflow-y-auto">
                    <div className="md:hidden flex items-center justify-between mb-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h1 className="text-xl font-bold">Settings</h1>
                    </div>
                    <div className="hidden md:block">
                        <h1 className="text-3xl font-bold mb-8">Settings</h1>
                    </div>
                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Profile</h2>
                            <div className="max-w-full md:max-w-xl space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2" htmlFor="name">Name</label>
                                    <input className="w-full p-3 rounded-lg border border-blue-600/20 bg-gray-50 focus:ring-blue-600 focus:border-blue-600" id="name" type="text" defaultValue={user?.username} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
                                    <input className="w-full p-3 rounded-lg border border-blue-600/20 bg-gray-50 focus:ring-blue-600 focus:border-blue-600" id="email" type="email" defaultValue={user?.email} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
                                    <input className="w-full p-3 rounded-lg border border-blue-600/20 bg-gray-50 focus:ring-blue-600 focus:border-blue-600" id="password" type="password" />
                                </div>
                                <div>
                                    <button className="text-white font-bold py-2 px-4 rounded-lg" style={{ backgroundColor: '#1173d4' }}>Update Profile</button>
                                </div>
                            </div>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                            <div className="max-w-full md:max-w-xl space-y-4">
                                <label className="flex items-center">
                                    <input checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} className="form-checkbox h-5 w-5 text-blue-600 rounded border-blue-600/40 bg-gray-50 focus:ring-blue-600" type="checkbox" />
                                    <span className="ml-3">Email notifications</span>
                                </label>
                                <label className="flex items-center">
                                    <input checked={pushNotifications} onChange={(e) => setPushNotifications(e.target.checked)} className="form-checkbox h-5 w-5 text-blue-600 rounded border-blue-600/40 bg-gray-50 focus:ring-blue-600" type="checkbox" />
                                    <span className="ml-3">Push notifications</span>
                                </label>
                                <label className="flex items-center">
                                    <input checked={inAppNotifications} onChange={(e) => setInAppNotifications(e.target.checked)} className="form-checkbox h-5 w-5 text-blue-600 rounded border-blue-600/40 bg-gray-50 focus:ring-blue-600" type="checkbox" />
                                    <span className="ml-3">In-app notifications</span>
                                </label>
                                <div>
                                    <button className="text-white font-bold py-2 px-4 rounded-lg mt-2" style={{ backgroundColor: '#1173d4' }}>Update Notifications</button>
                                </div>
                            </div>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Preferences</h2>
                            <div className="max-w-full md:max-w-xl space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2" htmlFor="language">Language</label>
                                    <select className="w-full p-3 rounded-lg border border-blue-600/20 bg-gray-50 focus:ring-blue-600 focus:border-blue-600" id="language">
                                        <option>English</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" htmlFor="theme">Theme</label>
                                    <select className="w-full p-3 rounded-lg border border-blue-600/20 bg-gray-50 focus:ring-blue-600 focus:border-blue-600" id="theme">
                                        <option>Light</option>
                                        <option>Dark</option>
                                        <option>System</option>
                                    </select>
                                </div>
                                <div>
                                    <button className="text-white font-bold py-2 px-4 rounded-lg" style={{ backgroundColor: '#1173d4' }}>Update Preferences</button>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;