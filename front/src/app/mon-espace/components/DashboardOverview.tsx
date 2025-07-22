"use client";
import React from "react";

const DashboardOverview = () => {
  const stats = [
    {
      label: "Matchs joués",
      value: "12",
      change: "+2 ce mois",
      icon: "⚽",
      color: "green"
    },
    {
      label: "Victoires",
      value: "8",
      change: "66.7% de réussite",
      icon: "🏆",
      color: "blue"
    },
    {
      label: "Joueurs actifs",
      value: "23",
      change: "+3 ce mois",
      icon: "👥",
      color: "purple"
    },
    {
      label: "Buts marqués",
      value: "34",
      change: "2.8 par match",
      icon: "⚽",
      color: "orange"
    }
  ];

  const recentMatches = [
    {
      date: "2025-06-25",
      opponent: "FC Rival",
      score: "3-1",
      result: "Victoire",
      location: "Domicile"
    },
    {
      date: "2025-06-20",
      opponent: "AS Local",
      score: "1-2",
      result: "Défaite",
      location: "Extérieur"
    },
    {
      date: "2025-06-15",
      opponent: "FC United",
      score: "2-0",
      result: "Victoire",
      location: "Domicile"
    }
  ];

  const upcomingMatches = [
    {
      date: "2025-07-02",
      time: "15:00",
      opponent: "FC Champion",
      location: "Stade Municipal",
      type: "Championnat"
    },
    {
      date: "2025-07-08",
      time: "18:30",
      opponent: "AS Elite",
      location: "Extérieur",
      type: "Coupe"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Bienvenue dans votre espace de gestion d'équipe
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Matches */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Derniers matchs</h2>
            <button className="text-green-600 hover:text-green-700 font-medium text-sm">
              Voir tout →
            </button>
          </div>
          <div className="space-y-4">
            {recentMatches.map((match, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{match.opponent}</p>
                  <p className="text-sm text-gray-500">{match.date} • {match.location}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">{match.score}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    match.result === 'Victoire' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {match.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Matches */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Prochains matchs</h2>
            <button className="text-green-600 hover:text-green-700 font-medium text-sm">
              Planifier →
            </button>
          </div>
          <div className="space-y-4">
            {upcomingMatches.map((match, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{match.opponent}</p>
                  <p className="text-sm text-gray-500">{match.location}</p>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {match.type}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{match.date}</p>
                  <p className="text-sm text-gray-500">{match.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-left transition-colors">
            <div className="text-2xl mb-2">📋</div>
            <div className="font-medium">Nouvelle feuille de match</div>
            <div className="text-sm opacity-80">Préparer la composition</div>
          </button>
          <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-left transition-colors">
            <div className="text-2xl mb-2">👤</div>
            <div className="font-medium">Ajouter un joueur</div>
            <div className="text-sm opacity-80">Gérer l'effectif</div>
          </button>
          <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-left transition-colors">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium">Voir les statistiques</div>
            <div className="text-sm opacity-80">Analyser les performances</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
