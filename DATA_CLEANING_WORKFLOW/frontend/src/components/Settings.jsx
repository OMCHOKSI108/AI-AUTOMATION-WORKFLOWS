import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Bell, Globe, Palette, Save } from 'lucide-react';
import Card from './common/Card';
import LoadingSpinner from './LoadingSpinner';

const Settings = () => {
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);
    
    // Profile Settings
    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Notification Settings
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        inApp: false
    });

    // Preferences
    const [preferences, setPreferences] = useState({
        language: 'English',
        theme: 'Light'
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Add API call here when ready
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleNotificationUpdate = async () => {
        setSaving(true);
        try {
            await userAPI.updatePreferences({ notifications });
            toast.success('Notification preferences updated');
        } catch (error) {
            toast.error('Failed to update notifications');
        } finally {
            setSaving(false);
        }
    };

    const handlePreferencesUpdate = async () => {
        setSaving(true);
        try {
            await userAPI.updatePreferences(preferences);
            toast.success('Preferences updated successfully');
        } catch (error) {
            toast.error('Failed to update preferences');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-[#232f3e]">Settings</h1>
                <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
            </div>
            <div className="max-w-5xl mx-auto space-y-6">
            {/* Profile Section */}
            <Card title="Profile Information" icon={User}>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User size={16} className="inline mr-2" />
                            Username
                        </label>
                        <input
                            type="text"
                            value={profileData.username}
                            onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail size={16} className="inline mr-2" />
                            Email
                        </label>
                        <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center px-6 py-3 bg-[#ff9900] text-white font-semibold rounded-lg shadow-md hover:bg-[#e68a00] hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {saving ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    <span className="ml-2">Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} className="mr-2" />
                                    Save Profile
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Card>

            {/* Password Section */}
            <Card title="Change Password" icon={Lock}>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            value={profileData.currentPassword}
                            onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={profileData.newPassword}
                            onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={profileData.confirmPassword}
                            onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="pt-4">
                        <button
                            type="button"
                            disabled={saving}
                            className="inline-flex items-center px-6 py-3 bg-[#ff9900] text-white font-semibold rounded-lg shadow-md hover:bg-[#e68a00] hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {saving ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    <span className="ml-2">Updating...</span>
                                </>
                            ) : (
                                <>
                                    <Lock size={18} className="mr-2" />
                                    Update Password
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Card>

            {/* Notifications Section */}
            <Card title="Notification Preferences" icon={Bell}>
                <div className="space-y-4">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                        <input
                            type="checkbox"
                            checked={notifications.email}
                            onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                        <input
                            type="checkbox"
                            checked={notifications.push}
                            onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-sm font-medium text-gray-700">In-App Notifications</span>
                        <input
                            type="checkbox"
                            checked={notifications.inApp}
                            onChange={(e) => setNotifications({...notifications, inApp: e.target.checked})}
                            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                    </label>
                    <div className="pt-4">
                        <button
                            onClick={handleNotificationUpdate}
                            type="button"
                            disabled={saving}
                            className="inline-flex items-center px-6 py-3 bg-[#ff9900] text-white font-semibold rounded-lg shadow-md hover:bg-[#e68a00] hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {saving ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    <span className="ml-2">Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} className="mr-2" />
                                    Save Notifications
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Card>

            {/* Preferences Section */}
            <Card title="App Preferences" icon={Palette}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Globe size={16} className="inline mr-2" />
                            Language
                        </label>
                        <select
                            value={preferences.language}
                            onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Palette size={16} className="inline mr-2" />
                            Theme
                        </label>
                        <select
                            value={preferences.theme}
                            onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option>Light</option>
                            <option>Dark</option>
                            <option>System</option>
                        </select>
                    </div>
                    <div className="pt-4">
                        <button
                            onClick={handlePreferencesUpdate}
                            type="button"
                            disabled={saving}
                            className="inline-flex items-center px-6 py-3 bg-[#ff9900] text-white font-semibold rounded-lg shadow-md hover:bg-[#e68a00] hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {saving ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    <span className="ml-2">Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} className="mr-2" />
                                    Save Preferences
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Card>
            </div>
        </div>
    );
};

export default Settings;