import React, { useState, useEffect } from 'react';
import { userAPI, dataAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { User, Mail, Shield, Save, Loader, Calendar, FileText, TrendingUp, Settings as SettingsIcon } from 'lucide-react';
import Card from './common/Card';
import LoadingSpinner from './LoadingSpinner';
import Badge from './common/Badge';
import StatCard from './common/StatCard';

const UserProfileNew = () => {
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileData, prefsData, historyData] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getPreferences(),
        dataAPI.getHistory(1, 10)
      ]);
      setProfile(profileData);
      setPreferences(prefsData);
      setRecentActivity(historyData.reports || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      await userAPI.updatePreferences(preferences);
      toast.success('Preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const totalReports = recentActivity.length;
  const completedReports = recentActivity.filter(r => r.status === 'completed').length;
  const successRate = totalReports > 0 ? ((completedReports / totalReports) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="text-center">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                  {profile?.username?.[0]?.toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{profile?.username}</h2>
                <p className="text-sm text-gray-500 mt-1">{profile?.email}</p>
                <Badge variant="primary" className="mt-3">
                  <Shield size={12} className="mr-1" />
                  {profile?.role || 'User'}
                </Badge>

                <div className="w-full mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Member since</span>
                    <span className="font-medium text-gray-900">
                      {new Date(profile?.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Reports</span>
                    <span className="font-medium text-gray-900">{totalReports}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-medium text-green-600">{successRate}%</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stats Summary */}
            <div className="mt-6 space-y-4">
              <StatCard
                title="Completed"
                value={completedReports}
                icon={FileText}
                changeType="success"
              />
              <StatCard
                title="Total Uploads"
                value={totalReports}
                icon={TrendingUp}
                changeType="primary"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'profile'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <User className="inline-block mr-2 h-5 w-5" />
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'preferences'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <SettingsIcon className="inline-block mr-2 h-5 w-5" />
                    Preferences
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === 'activity'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Calendar className="inline-block mr-2 h-5 w-5" />
                    Activity
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                          <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-900">{profile?.username}</p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-900">{profile?.email}</p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                          <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-900 capitalize">{profile?.role || 'User'}</p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Account Created</label>
                          <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-900">
                              {new Date(profile?.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Preferences</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {['light', 'dark', 'system'].map((theme) => (
                              <button
                                key={theme}
                                onClick={() => handlePreferenceChange('theme', theme)}
                                className={`px-4 py-3 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                                  preferences?.theme === theme
                                    ? 'bg-orange-50 border-[#ff9900] text-[#ff9900] shadow-md'
                                    : 'bg-white border-gray-200 text-gray-700 hover:border-[#ff9900] hover:shadow-sm'
                                }`}
                              >
                                {theme}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Default Visualization</label>
                          <select
                            value={preferences?.default_visualization_type || 'bar'}
                            onChange={(e) => handlePreferenceChange('default_visualization_type', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="bar">Bar Chart</option>
                            <option value="line">Line Chart</option>
                            <option value="scatter">Scatter Plot</option>
                            <option value="histogram">Histogram</option>
                            <option value="pie">Pie Chart</option>
                            <option value="heatmap">Heatmap</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                            <p className="text-sm text-gray-500 mt-1">Receive emails about your analysis reports</p>
                          </div>
                          <button
                            onClick={() => handlePreferenceChange('notifications_enabled', !preferences?.notifications_enabled)}
                            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff9900] ${
                              preferences?.notifications_enabled ? 'bg-[#ff9900]' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                preferences?.notifications_enabled ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="pt-4">
                          <button
                            onClick={handleSavePreferences}
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
                    </div>
                  </div>
                )}

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    {recentActivity.length > 0 ? (
                      <div className="space-y-3">
                        {recentActivity.map((activity) => (
                          <div
                            key={activity.report_id}
                            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{activity.original_filename}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(activity.created_at).toLocaleString()}
                                </p>
                              </div>
                              <Badge variant={
                                activity.status === 'completed' ? 'success' :
                                activity.status === 'processing' ? 'warning' : 'danger'
                              }>
                                {activity.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No recent activity</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileNew;
