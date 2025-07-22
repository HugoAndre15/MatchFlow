"use client";
import React, { useState } from "react";

interface Match {
  id: number;
  date: string;
  time: string;
  opponent: string;
  location: 'home' | 'away';
  score?: string;
  status: 'upcoming' | 'completed' | 'live';
  goals: number;
  assists: number;
  cards: { yellow: number; red: number };
  possession: number;
  shots: number;
}

const MatchesView = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all');
  
  const matches: Match[] = [
    {
      id: 1,
      date: "2025-07-02",
      time: "15:00",
      opponent: "FC Champion",
      location: 'home',
      status: 'upcoming',
      goals: 0,
      assists: 0,
      cards: { yellow: 0, red: 0 },
      possession: 0,
      shots: 0
    },
    {
      id: 2,
      date: "2025-06-25",
      time: "18:00",
      opponent: "FC Rival",
      location: 'home',
      score: "3-1",
      status: 'completed',
      goals: 3,
      assists: 2,
      cards: { yellow: 2, red: 0 },
      possession: 65,
      shots: 12
    },
    {
      id: 3,
      date: "2025-06-20",
      time: "20:30",
      opponent: "AS Local",
      location: 'away',
      score: "1-2",
      status: 'completed',
      goals: 1,
      assists: 1,
      cards: { yellow: 3, red: 1 },
      possession: 48,
      shots: 8
    },
    {
      id: 4,
      date: "2025-06-15",
      time: "16:00",
      opponent: "FC United",
      location: 'home',
      score: "2-0",
      status: 'completed',
      goals: 2,
      assists: 3,
      cards: { yellow: 1, red: 0 },
      possession: 72,
      shots: 15
    }
  ];

  const filteredMatches = matches.filter(match => {
    if (activeTab === 'all') return true;
    return match.status === activeTab;
  });

  const completedMatches = matches.filter(m => m.status === 'completed');
  const totalGoals = completedMatches.reduce((sum, m) => sum + m.goals, 0);
  const totalShots = completedMatches.reduce((sum, m) => sum + m.shots, 0);
  const averagePossession = completedMatches.length > 0 
    ? Math.round(completedMatches.reduce((sum, m) => sum + m.possession, 0) / completedMatches.length)
    : 0;

  const wins = completedMatches.filter(m => {
    if (!m.score) return false;
    const [ourGoals, theirGoals] = m.score.split('-').map(Number);
    return ourGoals > theirGoals;
  }).length;

  const getMatchResult = (match: Match) => {
    if (!match.score) return null;
    const [ourGoals, theirGoals] = match.score.split('-').map(Number);
    if (ourGoals > theirGoals) return 'win';
    if (ourGoals < theirGoals) return 'loss';
    return 'draw';
  };

  const getResultColor = (result: string | null) => {
    switch (result) {
      case 'win':
        return 'bg-green-100 text-green-700';
      case 'loss':
        return 'bg-red-100 text-red-700';
      case 'draw':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getResultText = (result: string | null) => {
    switch (result) {
      case 'win':
        return 'Victoire';
      case 'loss':
        return 'Défaite';
      case 'draw':
        return 'Match nul';
      default:
        return 'À venir';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mes matchs
        </h1>
        <p className="text-gray-600">
          Historique des matchs et statistiques de performance
        </p>
      </div>

      {/* Season Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚽</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Matchs joués</p>
              <p className="text-2xl font-bold text-gray-900">{completedMatches.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Victoires</p>
              <p className="text-2xl font-bold text-gray-900">{wins}</p>
              <p className="text-xs text-gray-500">
                {completedMatches.length > 0 ? Math.round((wins / completedMatches.length) * 100) : 0}% de réussite
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚽</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Buts marqués</p>
              <p className="text-2xl font-bold text-gray-900">{totalGoals}</p>
              <p className="text-xs text-gray-500">
                {completedMatches.length > 0 ? (totalGoals / completedMatches.length).toFixed(1) : 0} par match
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Possession moy.</p>
              <p className="text-2xl font-bold text-gray-900">{averagePossession}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 p-6">
            {[
              { id: 'all', label: 'Tous les matchs', count: matches.length },
              { id: 'upcoming', label: 'À venir', count: matches.filter(m => m.status === 'upcoming').length },
              { id: 'completed', label: 'Terminés', count: completedMatches.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="font-medium">{tab.label}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Matches List */}
        <div className="p-6">
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <div key={match.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  {/* Match Info */}
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">{match.date}</p>
                      <p className="font-medium text-gray-900">{match.time}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium text-gray-900">Notre équipe</p>
                        <p className="text-sm text-gray-500">
                          {match.location === 'home' ? 'Domicile' : 'Extérieur'}
                        </p>
                      </div>
                      
                      <div className="text-center px-4">
                        {match.score ? (
                          <p className="text-2xl font-bold text-gray-900">{match.score}</p>
                        ) : (
                          <p className="text-lg text-gray-500">VS</p>
                        )}
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900">{match.opponent}</p>
                        <p className="text-sm text-gray-500">Adversaire</p>
                      </div>
                    </div>
                  </div>

                  {/* Match Status & Stats */}
                  <div className="flex items-center space-x-6">
                    {match.status === 'completed' && (
                      <div className="flex space-x-4 text-sm text-gray-600">
                        <div className="text-center">
                          <p className="font-medium">{match.goals}</p>
                          <p>Buts</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{match.assists}</p>
                          <p>Passes D.</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{match.possession}%</p>
                          <p>Possession</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{match.shots}</p>
                          <p>Tirs</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        getResultColor(getMatchResult(match))
                      }`}>
                        {getResultText(getMatchResult(match))}
                      </span>
                      
                      {match.status === 'upcoming' ? (
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                          Préparer →
                        </button>
                      ) : (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Détails →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Planifier un nouveau match</h2>
        <p className="text-green-100 mb-6">
          Organisez votre prochain match et préparez votre équipe
        </p>
        <button className="bg-white text-green-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors">
          + Nouveau match
        </button>
      </div>
    </div>
  );
};

export default MatchesView;
