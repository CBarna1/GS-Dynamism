// src/context/AuthContext.tsx
import { createContext, useState, useEffect, type ReactNode } from 'react';
import { TOKEN_KEYS, clearStoredTokens, getStoredSession, tokenRole } from '../utils/authToken';

interface AuthContextType {
  token: string | null;
  role: string | null;
  isLoading: boolean;
  login: (token: string, expectedRole: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Session timeout duration in milliseconds (15 minutes)
const SESSION_TIMEOUT = 15 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inactivityTimer, setInactivityTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Track user activity to reset inactivity timer
  const resetInactivityTimer = () => {
    // Clear existing timer
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    // Only set timer if user is logged in
    if (token) {
      const newTimer = setTimeout(() => {
        console.log('[AuthContext] Session timeout due to inactivity');
        logout();
      }, SESSION_TIMEOUT);
      setInactivityTimer(newTimer);
    }
  };

  useEffect(() => {
    /**
     * PERSISTENCE CHECK
     * The role always comes from the server-signed token payload, never from
     * which storage key or login page was used.
     */
    const session = getStoredSession();
    if (session) {
      setToken(session.token);
      setRole(session.role);
    }

    setIsLoading(false);
  }, []);

  // Reset inactivity timer on token change
  useEffect(() => {
    if (token) {
      resetInactivityTimer();
    }
    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, [token]);

  // Track user activity (mouse, keyboard, scroll)
  useEffect(() => {
    const handleUserActivity = () => {
      if (token) {
        resetInactivityTimer();
      }
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
    };
  }, [token, inactivityTimer]);

  /**
   * Start a session. Returns false (and stores nothing) if the token was not
   * issued for the expected role, e.g. a mentor account on the admin login page.
   */
  const login = (newToken: string, expectedRole: string) => {
    const actualRole = tokenRole(newToken);
    if (!actualRole || actualRole !== expectedRole) {
      console.warn('[AuthContext] Refusing login: token role does not match portal', { expectedRole, actualRole });
      return false;
    }

    // Only one session at a time
    clearStoredTokens();
    localStorage.setItem(TOKEN_KEYS[actualRole], newToken);

    setToken(newToken);
    setRole(actualRole);
    return true;
  };

  const logout = () => {
    console.log('[AuthContext] Logout called');
    clearStoredTokens();
    localStorage.removeItem('mentee_user');
    setToken(null);
    setRole(null);
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      setInactivityTimer(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}