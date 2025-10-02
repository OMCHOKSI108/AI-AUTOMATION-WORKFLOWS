import { Link, useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-50 text-black" style={{ fontFamily: 'Inter, sans-serif', width: '100%', margin: 0, padding: 0 }}>
            <div className="flex min-h-screen" style={{ width: '100%', margin: 0 }}>
                <aside className="w-80 bg-gray-50 border-r flex flex-col" style={{ borderColor: 'rgba(79, 70, 229, 0.2)' }}>
                    <div className="p-6 flex items-center gap-3">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAt1oYohWKzw3awMvPAxI8SQfU5NDpn_9MqbHy6EJgmjejMa84E1EAthYcipGWskk7jS_5Yo00lCGTk8QAi7m0thjeCQRxwh6FErwQBE-L3qL4N2RDaFWyz8XGpJgci5wU2teOGRfnbBZ4TmuWcAhtpDJZBjyLviHKtSAgyC4AlLA3I-OiDkaT4s_e25k00Rugz46oQgEDG9YFpx-njsFfFs9zZLfhHP9pOgaNnQZolOT_xRTXAYf8rhwkkA1LLNFUdSfNCnSn1hA")' }}></div>
                        <h1 className="text-lg font-bold">SANS EDA</h1>
                    </div>
                    <nav className="flex-1 px-4 py-2 space-y-2">
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-lg text-black" style={{ ':hover': { backgroundColor: 'rgba(79, 70, 229, 0.1)' } }}>
                            <span className="material-symbols-outlined">upload_file</span>
                            <span>Upload</span>
                        </Link>
                        <Link to="/analysis-history" className="flex items-center gap-3 px-4 py-2 rounded-lg text-black" style={{ ':hover': { backgroundColor: 'rgba(79, 70, 229, 0.1)' } }}>
                            <span className="material-symbols-outlined">history</span>
                            <span>History</span>
                        </Link>
                        <Link to="/analysis-report" className="flex items-center gap-3 px-4 py-2 rounded-lg text-black" style={{ ':hover': { backgroundColor: 'rgba(79, 70, 229, 0.1)' } }}>
                            <span className="material-symbols-outlined">assessment</span>
                            <span>Reports</span>
                        </Link>
                        <Link to="/settings" className="flex items-center gap-3 px-4 py-2 rounded-lg text-black" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)' }}>
                            <span className="material-symbols-outlined">settings</span>
                            <span>Settings</span>
                        </Link>
                    </nav>
                    <div className="p-4 mt-auto">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full text-white font-bold py-2 px-4 rounded-lg"
                            style={{ backgroundColor: 'var(--primary-color)', cursor: 'pointer' }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'var(--primary-color)'}
                        >
                            New Analysis
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-3 px-4 py-2 mt-4 rounded-lg text-black w-full text-left"
                            style={{ cursor: 'pointer' }}
                        >
                            <span className="material-symbols-outlined">logout</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>
                <main className="flex-1 p-8">
                    <h1 className="text-3xl font-bold mb-8">Settings</h1>
                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Profile</h2>
                            <div className="max-w-xl space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2" htmlFor="name">Name</label>
                                    <input className="w-full p-3 rounded-lg border border-blue-600/20 bg-gray-50 focus:ring-blue-600 focus:border-blue-600" id="name" type="text" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
                                    <input className="w-full p-3 rounded-lg border border-blue-600/20 bg-gray-50 focus:ring-blue-600 focus:border-blue-600" id="email" type="email" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
                                    <input className="w-full p-3 rounded-lg border border-blue-600/20 bg-gray-50 focus:ring-blue-600 focus:border-blue-600" id="password" type="password" />
                                </div>
                                <div>
                                    <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Update Profile</button>
                                </div>
                            </div>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                            <div className="max-w-xl space-y-4">
                                <label className="flex items-center">
                                    <input checked className="form-checkbox h-5 w-5 text-blue-600 rounded border-blue-600/40 bg-gray-50 focus:ring-blue-600" type="checkbox" />
                                    <span className="ml-3">Email notifications</span>
                                </label>
                                <label className="flex items-center">
                                    <input checked className="form-checkbox h-5 w-5 text-blue-600 rounded border-blue-600/40 bg-gray-50 focus:ring-blue-600" type="checkbox" />
                                    <span className="ml-3">Push notifications</span>
                                </label>
                                <label className="flex items-center">
                                    <input className="form-checkbox h-5 w-5 text-blue-600 rounded border-blue-600/40 bg-gray-50 focus:ring-blue-600" type="checkbox" />
                                    <span className="ml-3">In-app notifications</span>
                                </label>
                                <div>
                                    <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mt-2">Update Notifications</button>
                                </div>
                            </div>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Preferences</h2>
                            <div className="max-w-xl space-y-6">
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
                                    <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Update Preferences</button>
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