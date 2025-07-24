// front/src/app/mon-espace/components/SidebarModern.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: 'overview' | 'team' | 'matches' | 'profile') => void;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

const Sidebar = ({ activeView, setActiveView, user }: SidebarProps) => {
  const { logout } = useAuth();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const menuItems = [
    {
      id: 'overview',
      label: 'Tableau de bord',
      icon: '📊',
      description: 'Vue d\'ensemble',
      badge: null
    },
    {
      id: 'team',
      label: 'Mon équipe',
      icon: '👥',
      description: 'Joueurs & matchs',
      badge: null
    },
    {
      id: 'matches',
      label: 'Matchs',
      icon: '⚽',
      description: 'Live & historique',
      badge: notifications > 0 ? notifications : null
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: '👤',
      description: 'Paramètres',
      badge: null
    }
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getUserInitials = () => {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  // Fermer le menu mobile quand on change de vue
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeView]);

  return (
    <>
      {/* Overlay pour mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚽</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MatchFlow</span>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5a11.95 11.95 0 01-5.5-5.5L15 17zM9 12H4l3.5 3.5a11.95 11.95 0 005.5 5.5L9 12z" />
              </svg>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {notifications}
                </span>
              )}
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {getUserInitials()}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:shadow-none lg:border-r lg:border-gray-200`}>
        
        {/* Header Desktop */}
        <div className="hidden lg:flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚽</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MatchFlow</span>
          </Link>
        </div>

        {/* Mobile Header dans sidebar */}
        <div className="lg:hidden flex items-center justify-between p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚽</span>
            </div>
            <span className="text-xl font-bold text-gray-900">MatchFlow</span>
          </Link>
          
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {getUserInitials()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all duration-200 group ${
                activeView === item.id
                  ? 'bg-gradient-to-r from-green-50 to-blue-50 text-green-600 border-l-4 border-green-600 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`text-2xl transition-transform duration-200 ${
                  activeView === item.id ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                  {item.icon}
                </span>
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </div>
              
              {item.badge && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-200 space-y-4">
          {/* Version info */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Version Gratuite</p>
                <p className="text-xs text-green-600">3 équipes • 25 joueurs max</p>
              </div>
              <button className="text-green-600 hover:text-green-700 text-xs font-medium bg-white px-3 py-1 rounded-full hover:shadow-sm transition-all">
                Upgrade →
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button className="flex flex-col items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-center">
              <span className="text-lg mb-1">💬</span>
              <span className="text-xs font-medium text-gray-700">Support</span>
            </button>
            <button className="flex flex-col items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-center">
              <span className="text-lg mb-1">📚</span>
              <span className="text-xs font-medium text-gray-700">Guide</span>
            </button>
          </div>

          {/* Logout button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group"
          >
            <span className="text-xl group-hover:animate-bounce">🚪</span>
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Espacer pour le contenu principal sur mobile */}
      <div className="lg:hidden h-16"></div>

      {/* Modal de confirmation de déconnexion */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-3xl">🚪</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Se déconnecter
              </h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir vous déconnecter de votre espace MatchFlow ?
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;