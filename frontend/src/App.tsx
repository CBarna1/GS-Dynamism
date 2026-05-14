// src/App.tsx
import { type JSX, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Pages & Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import About from './pages/About';
import ApplyPage from './pages/ApplyPage';
import Contact from './pages/Contact';
import Graduation from './pages/Graduation';
import Matches from './pages/Matches';
import MenteeDashboard from './pages/MenteeDashboard';
import MenteeLogin from './pages/MenteeLogin';
import Mentees from './pages/Mentees';
import Mentors from './pages/Mentors';
import Progress from './pages/Progress';
import ContentManagement from './pages/ContentManagement';
import ResendVerification from './pages/ResendVerification';
import Team from './pages/Team';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import Testimonials from './pages/Testimonials';
import ContactSubmissions from './pages/ContactSubmissions';
import MentorApply from './pages/MentorApply';
import MentorApplications from './pages/MentorApplications';
import MentorLogin from './pages/MentorLogin';
import MentorPortal from './pages/MentorPortal';
import SetPasswordPage from './pages/SetPasswordPage';

// --- HELPER COMPONENTS ---

/**
 * Prevents loops by ensuring we don't redirect if we are already 
 * where we need to be.
 */
function ProtectedRoute({ children, requiredRole }: { children: JSX.Element; requiredRole: string }) {
  const context = useContext(AuthContext);
  
  if (!context) {
    return <Navigate to="/login" replace />;
  }

  const { token, role, isLoading } = context;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Not logged in
  if (!token) {
    if (requiredRole === 'admin') {
      return <Navigate to="/login" replace />;
    } else if (requiredRole === 'mentor') {
      return <Navigate to="/mentor/login" replace />;
    } else {
      return <Navigate to="/mentee/login" replace />;
    }
  }

  // Logged in but wrong role
  if (role && role.toLowerCase() !== requiredRole.toLowerCase()) {
    if (role.toLowerCase() === 'admin') {
      return <Navigate to="/dashboard" replace />;
    } else if (role.toLowerCase() === 'mentor') {
      return <Navigate to="/mentor/portal" replace />;
    } else {
      return <Navigate to="/mentee/dashboard" replace />;
    }
  }

  // All checks passed
  return children;
}

/**
 * GuestRoute: Redirects logged-in users away from login pages
 */
function GuestRoute({ children }: { children: JSX.Element }) {
  const context = useContext(AuthContext);
  if (!context || context.isLoading) return null;

  if (context.token) {
    const dash = context.role?.toLowerCase() === 'admin' ? "/dashboard" : "/mentee/dashboard";
    return <Navigate to={dash} replace />;
  }

  return children;
}

/**
 * Admin Layout with Sidebar
 */
function AdminLayout({ children }: { children: JSX.Element }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        <div className="mt-16 lg:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
}

/**
 * Mentee Layout WITHOUT Sidebar (already has its own header)
 */
function MenteeLayout({ children }: { children: JSX.Element }) {
  return <>{children}</>;
}

/**
 * PublicLayout: Adds top padding so the fixed Navbar doesn't overlap page content
 */
function PublicLayout({ children }: { children: JSX.Element }) {
  return <div className="pt-20">{children}</div>;
}

/**
 * Root Traffic Controller
 * Always redirect to /home (public landing page)
 */
function RootRedirect() {
  return <Navigate to="/home" replace />;
}

// --- MAIN APP ---

function App() {
  const location = window.location.pathname;
  
  // Don't show navbar in admin routes (they have their own layout) or on login pages
  const isAdminRoute = location.startsWith('/dashboard') || 
                       location.startsWith('/mentees') || 
                       location.startsWith('/mentors') || 
                       location.startsWith('/matches') || 
                       location.startsWith('/progress') || 
                       location.startsWith('/content') ||
                       location.startsWith('/submissions') ||
                       location.startsWith('/mentor-applications');
  const isLoginPage = location === '/login' || location === '/mentee/login';
  const isActivationPage = location.startsWith('/activate') || location === '/verify-email';
  const showNavbar = !isAdminRoute && !isLoginPage && !isActivationPage;

  return (
    <Router>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public routes */}
  <Route path="/home" element={<PublicLayout><Home /></PublicLayout>} />
  <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
  <Route path="/activate/:token" element={<VerifyEmail />} />
  <Route path="/apply" element={<PublicLayout><ApplyPage /></PublicLayout>} />
  <Route path="/mentor-apply" element={<PublicLayout><MentorApply /></PublicLayout>} />
  <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
  <Route path="/graduation" element={<PublicLayout><Graduation /></PublicLayout>} />
  <Route path="/team" element={<PublicLayout><Team /></PublicLayout>} />
  <Route path="/testimonials" element={<PublicLayout><Testimonials /></PublicLayout>} />
  <Route path="/verify-email" element={<VerifyEmail />} />
  <Route path="/resend-verification" element={<PublicLayout><ResendVerification /></PublicLayout>} />
  <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />

        {/* Guest routes */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/admin-login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/mentee/login" element={<GuestRoute><MenteeLogin /></GuestRoute>} />
        <Route path="/mentee/set-password/:token" element={<SetPasswordPage />} />
        <Route path="/mentor/login" element={<GuestRoute><MentorLogin /></GuestRoute>} />

        {/* Admin Routes - WITH Sidebar */}
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout><Dashboard /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/mentees" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout><Mentees /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/mentors" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout><Mentors /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/matches" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout><Matches /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/progress" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout><Progress /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/content" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout><ContentManagement /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/submissions" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout><ContactSubmissions /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/mentor-applications" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout><MentorApplications /></AdminLayout>
          </ProtectedRoute>
        } />

        {/* Mentee Routes - WITHOUT Sidebar (has its own header) */}
        <Route path="/mentee/dashboard" element={
          <ProtectedRoute requiredRole="mentee">
            <MenteeLayout><MenteeDashboard /></MenteeLayout>
          </ProtectedRoute>
        } />

        {/* Mentor Routes - WITHOUT Sidebar (has its own header) */}
        <Route path="/mentor/portal" element={
          <ProtectedRoute requiredRole="mentor">
            <MenteeLayout><MentorPortal /></MenteeLayout>
          </ProtectedRoute>
        } />

        {/* Fallbacks */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;