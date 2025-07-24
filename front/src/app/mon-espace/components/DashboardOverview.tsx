// front/src/app/mon-espace/components/DashboardOverview.tsx
"use client";
import React, { useState, useEffect } from "react";
import { apiService } from "@/services/api";

interface DashboardStats {
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  totalGoals: number;
  totalPlayers: number;
  activePlayers: number;
  injuredPlayers: number;
  winRate: number;
  goalsPerMatch: number;
}

interface QuickMatch {
  id: string;
  opponent: string;
  date: string;
  score?: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
  location: 'HOME' | 'AWAY';
}

interface TopPlayer {
  id: string;
  name: string;
  position: string;
  goals: number;
  assists: number;
  matchesPlayed: number;
}

const DashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMatches, setRecentMatches] = useState<QuickMatch[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<QuickMatch[]>([]);
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      loadTeamData();
    }
  }, [selectedTeam]);

  const loadInitialData = async () => {
    try {
      const teamsData = await apiService.getTeams();
      setTeams(teamsData as any[]);
      if ((teamsData as any[]).length > 0) {
        setSelectedTeam((teamsData as any[])[0].id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeamData = async () => {
    if (!selectedTeam) return;

    try {
      // Charger les données en parallèle
      const [matchesData, playersData, teamStats] = await Promise.all([
        apiService.getMatches(selectedTeam),
        apiService.getPlayers(selectedTeam),
        apiService.getTeamStats(selectedTeam).catch(() => null)
      ]);

      const matches = matchesData as any[];
      const players = playersData as any[];

      // Traiter les matches
      const finished = matches.filter(m => m.status === 'FINISHED');
      const upcoming = matches.filter(m => m.status === 'SCHEDULED').slice(0, 3);
      const recent = finished.slice(0, 3);

      setRecentMatches(recent);
      setUpcomingMatches(upcoming);

      // Calculer les stats
      const wins = finished.filter(m => m.ourScore > m.opponentScore).length;
      const draws = finished.filter(m => m.ourScore === m.opponentScore).length;
      const losses = finished.filter(m => m.ourScore < m.opponentScore).length;
      const totalGoals = finished.reduce((sum, m) => sum + m.ourScore, 0);

      const dashboardStats: DashboardStats = {
        totalMatches: finished.length,
        wins,
        draws,
        losses,
        totalGoals,
        totalPlayers: players.length,
        activePlayers: players.filter(p => p.status === 'ACTIVE').length,
        injuredPlayers: players.filter(p => p.status === 'INJURED').length,
        winRate: finished.length > 0 ? Math.round((wins / finished.length) * 100) : 0,
        goalsPerMatch: finished.length > 0 ? +(totalGoals / finished.length).toFixed(1) : 0
      };

      setStats(dashboardStats);

      // Top players
      const playersWithStats = players.map(player => ({
        id: player.id,
        name: `${player.firstName} ${player.lastName}`,
        position: player.position,
        goals: player.goals?.length || 0,
        assists: player.assists?.length || 0,
        matchesPlayed: player.matchPlayers?.length || 0
      })).sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists)).slice(0, 5);

      setTopPlayers(playersWithStats);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const getMatchResultBadge = (match: QuickMatch) => {
    if (match.status !== 'FINISHED' || !match.score) return null;
    
    const [ourScore, opponentScore] = match.score.split('-').map(Number);
    if (ourScore > opponentScore) {
      return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">V</span>;
    } else if (ourScore < opponentScore) {
      return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">D</span>;
    } else {
      return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">N</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      SCHEDULED: { color: 'bg-blue-100 text-blue-700', text: 'Programmé' },
      LIVE: { color: 'bg-green-100 text-green-700 animate-pulse', text: 'En cours' },
      FINISHED: { color: 'bg-gray-100 text-gray-700', text: 'Terminé' }
    };
    const badge = badges[status as keyof typeof badges] || badges.SCHEDULED;
    return <span className={`${badge.color} px-2 py-1 rounded-full text-xs font-medium`}>{badge.text}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto animate-spin">
            <span className="text-white font-bold text-2xl">⚽</span>
          </div>
          <p className="text-gray-600">Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header avec sélecteur d'équipe */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Vue d'ensemble de vos performances et activités
          </p>
        </div>
        
        {teams.length > 1 && (
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">Équipe :</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            >
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            label: "Matchs joués",
            value: stats?.totalMatches || 0,
            change: `${stats?.wins || 0}V • ${stats?.draws || 0}N • ${stats?.losses || 0}D`,
            icon: "⚽",
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50"
          },
          {
            label: "Taux de victoire",
            value: `${stats?.winRate || 0}%`,
            change: stats?.wins ? `${stats.wins} victoires` : "Aucune victoire",
            icon: "🏆",
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50"
          },
          {
            label: "Buts marqués",
            value: stats?.totalGoals || 0,
            change: `${stats?.goalsPerMatch || 0} par match`,
            icon: "⚽",
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50"
          },
          {
            label: "Joueurs actifs",
            value: stats?.activePlayers || 0,
            change: `${stats?.totalPlayers || 0} total`,
            icon: "👥",
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50"
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <span className="text-lg md:text-2xl">{stat.icon}</span>
              </div>
              <div className={`px-2 py-1 bg-gradient-to-r ${stat.color} rounded-full`}>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs md:text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Matches */}
        <div className="lg:col-span-2 bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
              <span className="mr-2">⚽</span>
              Derniers matchs
            </h2>
            <button className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors">
              Voir tout →
            </button>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            {recentMatches.length > 0 ? recentMatches.map((match, index) => (
              <div key={index} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${match.location === 'HOME' ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm md:text-base">{match.opponent}</p>
                    <p className="text-xs md:text-sm text-gray-500">
                      {new Date(match.date).toLocaleDateString('fr-FR')} • 
                      {match.location === 'HOME' ? ' Domicile' : ' Extérieur'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {match.score && (
                    <span className="font-bold text-lg text-gray-900">{match.score}</span>
                  )}
                  {getMatchResultBadge(match)}
                  {getStatusBadge(match.status)}
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">⚽</div>
                <p className="text-gray-500">Aucun match joué</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Players */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
              <span className="mr-2">🏆</span>
              Top Joueurs
            </h2>
          </div>
          
          <div className="space-y-3">
            {topPlayers.length > 0 ? topPlayers.map((player, index) => (
              <div key={player.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{player.name}</p>
                  <p className="text-xs text-gray-500">{player.position}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{player.goals}B • {player.assists}P</p>
                  <p className="text-xs text-gray-500">{player.matchesPlayed} matchs</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">👥</div>
                <p className="text-gray-500 text-sm">Aucun joueur</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Matches */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center">
            <span className="mr-2">📅</span>
            Prochains matchs
          </h2>
          <button className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors">
            Planifier →
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingMatches.length > 0 ? upcomingMatches.map((match, index) => (
            <div key={index} className="border border-gray-200 rounded-lg md:rounded-xl p-4 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  match.location === 'HOME' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {match.location === 'HOME' ? '🏠 Domicile' : '✈️ Extérieur'}
                </span>
                {getStatusBadge(match.status)}
              </div>
              
              <h3 className="font-medium text-gray-900 mb-2">{match.opponent}</h3>
              
              <div className="text-sm text-gray-500 space-y-1">
                <p>📅 {new Date(match.date).toLocaleDateString('fr-FR')}</p>
                <p>🕐 {new Date(match.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              
              <button className="w-full mt-3 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors">
                Préparer le match
              </button>
            </div>
          )) : (
            <div className="col-span-full text-center py-8">
              <div className="text-4xl mb-4">📅</div>
              <p className="text-gray-500 mb-4">Aucun match programmé</p>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                + Programmer un match
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 rounded-xl md:rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '3s'
              }}
            >
              ⚽
            </div>
          ))}
        </div>
        
        <div className="relative z-10">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Actions rapides</h2>
          <p className="text-green-100 mb-6">Gérez votre équipe efficacement</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { icon: "📋", title: "Feuille de match", desc: "Composer l'équipe" },
              { icon: "👤", title: "Ajouter joueur", desc: "Gérer l'effectif" },
              { icon: "📊", title: "Statistiques", desc: "Analyser les performances" },
              { icon: "⚙️", title: "Paramètres", desc: "Configurer l'équipe" }
            ].map((action, i) => (
              <button
                key={i}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 text-left transition-all transform hover:scale-105 border border-white/20"
              >
                <div className="text-xl md:text-2xl mb-2">{action.icon}</div>
                <div className="font-medium text-sm md:text-base mb-1">{action.title}</div>
                <div className="text-xs text-green-100 opacity-80">{action.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;