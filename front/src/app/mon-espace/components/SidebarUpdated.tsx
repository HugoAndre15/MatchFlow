// front/src/app/mon-espace/components/SidebarUpdated.tsx
"use client";
import React, { useState } from "react";
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

const SidebarUpdated = ({ activeView, setActiveView, user }: SidebarProps) => {
  const { logout } = useAuth();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    {
      id: 'overview',
      label: 'Tableau de bord',
      icon: '📊',
      description: 'Vue d\'ensemble'
    },
    {
      id: 'team',
      label: 'Mon équipe',
      icon: '👥',
      description: 'Gestion des joueurs et matchs'
    },
    {
      id: 'matches',
      label: 'Mes matchs',
      icon: '⚽',
      description: 'Historique & stats'
    },
    {
      id: 'profile',
      label: 'Mon profil',
      icon: '👤',
      description: 'Paramètres compte'
    }
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getUserInitials = () => {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  return (
    <>
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform lg:translate-x-0">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">⚽</span>
            <span className="text-xl font-bold text-gray-900">MatchFlow</span>
          </Link>
        </div>

        {/* User info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {getUserInitials()}
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
        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all hover:bg-gray-50 ${
                activeView === item.id
                  ? 'bg-green-50 text-green-600 border-r-2 border-green-600'
                  : 'text-gray-700'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          {/* Version info */}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Version Gratuite</p>
                <p className="text-xs text-green-600">3 équipes max</p>
              </div>
              <button className="text-green-600 hover:text-green-700 text-xs font-medium">
                Upgrade →
              </button>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Modal de confirmation de déconnexion */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">🚪</span>
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
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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

export default SidebarUpdated;