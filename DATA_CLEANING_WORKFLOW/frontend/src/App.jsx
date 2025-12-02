import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Signup from './components/Signup';
import DashboardNew from './components/DashboardNew';
import AnalysisHistory from './components/AnalysisHistory';
import AnalysisReport from './components/AnalysisReport';
import UserProfileNew from './components/UserProfileNew';
import Settings from './components/Settings';
import LoadingSpinner from './components/LoadingSpinner';
import AmazonLayout from './components/AmazonLayout';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <AmazonLayout>{children}</AmazonLayout> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardNew />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis-history"
          element={
            <ProtectedRoute>
              <AnalysisHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis-report/:reportId"
          element={
            <ProtectedRoute>
              <AnalysisReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfileNew />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#0f1111',
            border: '1px solid #d5dbdb',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08)',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#067d62',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#d13212',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
