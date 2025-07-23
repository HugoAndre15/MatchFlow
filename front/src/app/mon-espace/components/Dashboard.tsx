"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardOverview from "./DashboardOverview";
import TeamManagement from "./TeamManagement";
import MatchesView from "./MatchesView";
import ProfileView from "./ProfileView";

type ViewType = 'overview' | 'team' | 'matches' | 'profile';

const Dashboard = () => {
  const [activeView, setActiveView] = useState<ViewType>('overview');

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
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
