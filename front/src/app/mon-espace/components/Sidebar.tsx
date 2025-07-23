"use client";
import React from "react";
import Link from "next/link";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: 'overview' | 'team' | 'matches' | 'profile') => void;
}

const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
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
      description: 'Gestion des joueurs'
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

  return (
    <>
      {/* Mobile menu overlay */}
      <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform lg:translate-x-0">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">⚽</span>
            <span className="text-xl font-bold text-gray-900">MatchFlow</span>
          </Link>
          <Link 
            href="/"
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            ✕
          </Link>
        </div>

        {/* User info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              JD
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">John Doe</h3>
              <p className="text-sm text-gray-500">Coach - FC Example</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
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

        {/* Quick actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-medium py-3 px-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all">
            + Nouveau match
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
