import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  totalEarnings?: number;
  followers?: number;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('belen_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    } else {
      // For demo purposes, auto-login as first user
      const demoUser = {
        id: 'b13e2829-9194-44ba-aeb9-4b76757aa5b1', // This should match the sample user ID
        username: 'CreativeExplorer'
      };
      setUser(demoUser);
      setIsAuthenticated(true);
      localStorage.setItem('belen_user', JSON.stringify(demoUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would make an API call
      const demoUser = {
        id: 'b13e2829-9194-44ba-aeb9-4b76757aa5b1',
        username: username
      };
      setUser(demoUser);
      setIsAuthenticated(true);
      localStorage.setItem('belen_user', JSON.stringify(demoUser));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('belen_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}