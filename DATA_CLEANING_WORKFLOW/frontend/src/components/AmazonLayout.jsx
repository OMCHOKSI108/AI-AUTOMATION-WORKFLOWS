import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Settings, 
  LogOut,
  Search,
  User,
  Menu,
  X,
  BarChart3,
  PlusCircle,
  Database,
  History
} from 'lucide-react';
import { useState } from 'react';

const AmazonLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'New Analysis', icon: PlusCircle },
    { path: '/analysis-history', label: 'Runs History', icon: History },
    { path: '/datasets', label: 'Datasets', icon: Database }, // Placeholder for now
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Header - Amazon style */}
      <header className="sticky top-0 z-50 bg-[#232f3e] text-white border-b border-[#3a4553]">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded hover:bg-[#3a4553] text-white"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link to="/dashboard" className="flex items-center gap-2 text-white hover:text-[#ff9900] transition-colors">
              <BarChart3 size={28} className="text-[#ff9900]" />
              <span className="font-bold text-xl tracking-tight">
                AutoEDA <span className="text-[#ff9900]">Studio</span>
              </span>
            </Link>
          </div>

          {/* Search Bar - Hidden on small screens */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search analyses, datasets, or reports..."
                className="w-full px-4 py-2 pr-10 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff9900]"
              />
              <button className="absolute right-0 top-0 h-full px-3 bg-[#ff9900] rounded-r-md hover:bg-[#e68a00] transition-colors flex items-center justify-center">
                <Search size={18} className="text-[#232f3e]" />
              </button>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative user-menu-container">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded hover:border hover:border-white transition-all border border-transparent"
            >
              <div className="text-right hidden md:block">
                <div className="text-xs text-gray-300">Hello, {user?.username || 'User'}</div>
                <div className="text-sm font-bold">Account & Lists</div>
              </div>
              <User size={24} className="text-white" />
            </button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-md shadow-lg py-2 bg-white text-gray-900 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium">Signed in as</p>
                  <p className="text-sm font-bold truncate">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-sm"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <User size={16} className="text-gray-500" />
                  Your Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-sm"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings size={16} className="text-gray-500" />
                  Settings
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-50 transition-colors text-sm text-red-600"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside 
          className={`
            fixed lg:relative inset-y-0 left-0 top-[57px] lg:top-0 z-40 w-64 bg-[#232f3e] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <nav className="p-4 space-y-1">
            <div className="mb-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Main Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium
                    ${active 
                      ? 'bg-[#ff9900] text-[#232f3e] font-bold' 
                      : 'text-gray-300 hover:bg-[#3a4553] hover:text-white'}
                  `}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#3a4553]">
            <div className="text-xs text-gray-400 text-center">
              &copy; 2025 AutoEDA Studio
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AmazonLayout;
