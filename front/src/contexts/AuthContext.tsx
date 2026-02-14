'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/authService';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/login', '/register', '/'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const token = localStorage.getItem('token');
    const storedUser = authService.getUser();

    if (token && storedUser) {
      setUser(storedUser);
      // Si connecté et sur une route publique, rediriger vers /
      if (isPublicRoute) {
        router.push('/');
      }
    } else {
      // Si pas connecté et sur une route protégée, rediriger vers /login
      if (!token && !isPublicRoute) {
        const returnUrl = encodeURIComponent(pathname);
        router.push(`/login?returnUrl=${returnUrl}`);
      }
    }

    setIsLoading(false);
  }, [pathname, router, isPublicRoute]);

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        setUser(response.user);
        
        const searchParams = new URLSearchParams(window.location.search);
        const returnUrl = searchParams.get('returnUrl') || '/';
        
        // Validation de sécurité
        if (returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
            router.push(decodeURIComponent(returnUrl));
        } else {
            router.push('/');
        }
    };

  const register = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    await authService.register(data);
    router.push('/login');
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
