// front/src/app/mon-espace/components/DashboardMain.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import DashboardOverview from "./DashboardOverview";
import TeamManagement from "./TeamManagement";
import MatchesView from "./MatchesView";
import ProfileView from "./ProfileView";

type ViewType = 'overview' | 'team' | 'matches' | 'profile';

const DashboardMain = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirection si non authentifié
    if (!loading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Animation de chargement
    if (!loading && isAuthenticated) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticated, router]);

  // Écran de chargement avec animation
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute text-green-200 text-4xl animate-bounce opacity-30"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + (i % 2)}s`,
              }}
            >
              ⚽
            </div>
          ))}
        </div>

        {/* Loading Content */}
        <div className="text-center space-y-6 relative z-10">
          {/* Logo animé */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <span className="text-white font-bold text-3xl animate-bounce">⚽</span>
            </div>
            
            {/* Cercles de chargement */}
            <div className="absolute -inset-4 border-4 border-green-200 rounded-full animate-spin opacity-30"></div>
            <div className="absolute -inset-8 border-4 border-blue-200 rounded-full animate-spin opacity-20" style={{animationDirection: 'reverse', animationDuration: '3s'}}></div>
          </div>

          {/* Texte de chargement */}
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Chargement de votre espace
            </h2>
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>

          {/* Stats de chargement simulées */}
          <div className="grid grid-cols-3 gap-4 text-center max-w-md mx-auto">
            {[
              { icon: '👥', label: 'Joueurs', value: '24' },
              { icon: '⚽', label: 'Matchs', value: '12' },
              { icon: '🏆', label: 'Victoires', value: '8' }
            ].map((stat, i) => (
              <div 
                key={i} 
                className="bg-white/50 backdrop-blur-sm rounded-xl p-4 animate-fade-in"
                style={{animationDelay: `${i * 0.2}s`}}
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="font-bold text-gray-800">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Message d'accueil */}
          <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto border border-white/50">
            <p className="text-gray-700 font-medium">
              Bienvenue {user?.firstName} ! 👋
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Préparation de votre tableau de bord...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Redirection si pas d'utilisateur
  if (!isAuthenticated || !user) {
    return null;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <DashboardOverview />;
      case 'team':
        return <TeamManagement />;
      case 'matches':
        return <MatchesView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        user={user}
      />
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-64 relative">
        {/* Header Mobile avec breadcrumb */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 mt-16">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {activeView === 'overview' && 'Tableau de bord'}
                {activeView === 'team' && 'Mon équipe'}
                {activeView === 'matches' && 'Mes matchs'}
                {activeView === 'profile' && 'Mon profil'}
              </h1>
              <p className="text-sm text-gray-500">
                {activeView === 'overview' && 'Vue d\'ensemble de vos performances'}
                {activeView === 'team' && 'Gestion des joueurs et matchs'}
                {activeView === 'matches' && 'Historique et matchs en live'}
                {activeView === 'profile' && 'Paramètres de votre compte'}
              </p>
            </div>
            
            {/* Actions rapides sur mobile */}
            <div className="flex space-x-2">
              {activeView === 'team' && (
                <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              )}
              <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Animation d'entrée du contenu */}
            <div className="animate-fade-in">
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Footer pour mobile */}
        <div className="lg:hidden bg-white border-t border-gray-200 p-4 mt-8">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span>© 2024 MatchFlow</span>
            <span>•</span>
            <button className="hover:text-green-600 transition-colors">Support</button>
            <span>•</span>
            <button className="hover:text-green-600 transition-colors">Aide</button>
          </div>
        </div>

        {/* Bouton d'action flottant sur mobile */}
        <div className="lg:hidden fixed bottom-6 right-6 z-30">
          <div className="relative">
            {/* Bouton principal */}
            <button 
              className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center"
              onClick={() => {
                // Action selon la vue active
                if (activeView === 'team') {
                  // Ouvrir modal d'ajout de joueur
                } else if (activeView === 'matches') {
                  // Ouvrir modal d'ajout de match
                }
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>

            {/* Indicateur d'animation */}
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-500 rounded-full opacity-20 animate-ping"></div>
          </div>
        </div>

        {/* Indicateur de statut réseau */}
        <div className="hidden lg:block fixed bottom-4 right-4 z-20">
          <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-2 shadow-sm border border-gray-200">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600 font-medium">En ligne</span>
          </div>
        </div>
      </main>

      {/* Styles CSS supplémentaires */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        /* Scrollbar personnalisée */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #3b82f6);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #2563eb);
        }

        /* Animations pour les éléments interactifs */
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        /* Amélioration de la navigation mobile */
        @media (max-width: 1024px) {
          body {
            overflow-x: hidden;
          }
        }

        /* Animation des badges de notification */
        .notification-badge {
          animation: notification-pulse 2s infinite;
        }

        @keyframes notification-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        /* Effet de glassmorphism pour les modals */
        .modal-backdrop {
          backdrop-filter: blur(8px);
          background: rgba(0, 0, 0, 0.3);
        }

        /* Animation des cartes */
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default DashboardMain;