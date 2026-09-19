import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const role = authContext?.role;

  const handleLogout = () => {
    const currentRole = authContext?.role;
    if (authContext?.logout) authContext.logout();
    navigate(currentRole === 'mentee' ? '/mentee/login' : '/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive(path)
        ? 'text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white shadow-lg flex flex-col z-40 transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div
          className="p-6 border-b border-gray-700"
          style={{ borderBottomColor: 'rgba(255,145,72,0.3)' }}
        >
          <Link to="/home" className="inline-block hover:opacity-80 transition-opacity" onClick={closeMobileMenu}>
            <div className="flex items-center gap-3 mb-1">
              <img src="/img/HORIZONTAL.png" alt="Guiding Stars" className="h-24" />
            </div>
          </Link>
          <p className="text-xs text-gray-400 ml-11">
            {role === 'admin' ? 'Admin Portal' : 'Mentee Portal'}
          </p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">

          {/* Dashboard */}
          <Link
            to={role === 'admin' ? '/dashboard' : '/mentee/dashboard'}
            className={navLinkClass(role === 'admin' ? '/dashboard' : '/mentee/dashboard')}
            style={isActive(role === 'admin' ? '/dashboard' : '/mentee/dashboard')
              ? { background: 'linear-gradient(135deg, #FF9148, #E8722E)' }
              : {}}
            onClick={closeMobileMenu}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-medium">Dashboard</span>
          </Link>

          {/* Admin Only */}
          {role === 'admin' && (
            <>
              <Link
                to="/mentors"
                className={navLinkClass('/mentors')}
                style={isActive('/mentors') ? { background: 'linear-gradient(135deg, #FF9148, #E8722E)' } : {}}
                onClick={closeMobileMenu}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">Mentors</span>
              </Link>

              <Link
                to="/mentees"
                className={navLinkClass('/mentees')}
                style={isActive('/mentees') ? { background: 'linear-gradient(135deg, #FF9148, #E8722E)' } : {}}
                onClick={closeMobileMenu}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="font-medium">Mentees List</span>
              </Link>

              <Link
                to="/matches"
                className={navLinkClass('/matches')}
                style={isActive('/matches') ? { background: 'linear-gradient(135deg, #FF9148, #E8722E)' } : {}}
                onClick={closeMobileMenu}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium">Matches</span>
              </Link>

              <Link
                to="/content"
                className={navLinkClass('/content')}
                style={isActive('/content') ? { background: 'linear-gradient(135deg, #FF9148, #E8722E)' } : {}}
                onClick={closeMobileMenu}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span className="font-medium">Content</span>
              </Link>

              <Link
                to="/submissions"
                className={navLinkClass('/submissions')}
                style={isActive('/submissions') ? { background: 'linear-gradient(135deg, #FF9148, #E8722E)' } : {}}
                onClick={closeMobileMenu}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Contact Submissions</span>
              </Link>

              <Link
                to="/mentor-applications"
                className={navLinkClass('/mentor-applications')}
                style={isActive('/mentor-applications') ? { background: 'linear-gradient(135deg, #FF9148, #E8722E)' } : {}}
                onClick={closeMobileMenu}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="font-medium">Mentor Applications</span>
              </Link>

              <Link
                to="/blog-management"
                className={navLinkClass('/blog-management')}
                style={isActive('/blog-management') ? { background: 'linear-gradient(135deg, #FF9148, #E8722E)' } : {}}
                onClick={closeMobileMenu}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="font-medium">Blog &amp; Newsletter</span>
              </Link>

              <Link
                to="/team-management"
                className={navLinkClass('/team-management')}
                style={isActive('/team-management') ? { background: 'linear-gradient(135deg, #FF9148, #E8722E)' } : {}}
                onClick={closeMobileMenu}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">Team Page</span>
              </Link>

              <Link
                to="/testimonial-management"
                className={navLinkClass('/testimonial-management')}
                style={isActive('/testimonial-management') ? { background: 'linear-gradient(135deg, #FF9148, #E8722E)' } : {}}
                onClick={closeMobileMenu}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-medium">Testimonials</span>
              </Link>

              <Link
                to="/graduation-management"
                className={navLinkClass('/graduation-management')}
                style={isActive('/graduation-management') ? { background: 'linear-gradient(135deg, #FF9148, #E8722E)' } : {}}
                onClick={closeMobileMenu}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                <span className="font-medium">Graduation &amp; Events</span>
              </Link>
            </>
          )}

          {/* Mentee Only */}
          {role === 'mentee' && (
            <Link
              to="/progress"
              className={navLinkClass('/progress')}
              style={isActive('/progress') ? { background: 'linear-gradient(135deg, #FF9148, #E8722E)' } : {}}
              onClick={closeMobileMenu}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium">My Progress</span>
            </Link>
          )}
        </nav>

        {/* User Info + Logout */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {role === 'admin' ? 'Admin User' : 'Mentee User'}
              </p>
              <p className="text-xs text-gray-400 capitalize">{role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;