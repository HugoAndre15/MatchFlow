// front/src/app/mon-espace/components/DashboardProtected.tsx
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import SidebarUpdated from "./SidebarUpdated";
import DashboardOverview from "./DashboardOverview";
import TeamManagementUpdated from "./TeamManagementUpdated";
import MatchesView from "./MatchesView";
import ProfileView from "./ProfileView";

type ViewType = 'overview' | 'team' | 'matches' | 'profile';

const DashboardProtected = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = React.useState<ViewType>('overview');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // Affichage du loader pendant la vérification d'authentification
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">⚽</span>
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  // Redirection si non authentifié (sécurité supplémentaire)
  if (!isAuthenticated || !user) {
    return null;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <DashboardOverview />;
      case 'team':
        return <TeamManagementUpdated />;
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
      <SidebarUpdated 
        activeView={activeView} 
        setActiveView={setActiveView}
        user={user}
      />
      <main className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default DashboardProtected;