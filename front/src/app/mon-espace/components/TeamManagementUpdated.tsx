// front/src/app/mon-espace/components/TeamManagementUpdated.tsx
"use client";
import React, { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import MatchComposition from "@/app/components/MatchComposition";
import MatchLive from "@/app/components/MatchLive";

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  number: number;
  status: 'ACTIVE' | 'INJURED' | 'SUSPENDED' | 'INACTIVE';
  goals: any[];
  assists: any[];
  cards: any[];
  matchPlayers: any[];
}

interface Match {
  id: string;
  opponent: string;
  date: string;
  location: 'HOME' | 'AWAY';
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'CANCELLED';
  ourScore: number;
  opponentScore: number;
  goals: any[];
  assists: any[];
  cards: any[];
  matchPlayers: any[];
}

interface Team {
  id: string;
  name: string;
  category?: string;
  homeColors?: string;
  awayColors?: string;
  stadium?: string;
}

const TeamManagementUpdated = () => {
  const [activeTab, setActiveTab] = useState<'players' | 'matches'>('players');
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [showPlayerDetails, setShowPlayerDetails] = useState(false);
  const [showComposition, setShowComposition] = useState(false);
  const [showMatchLive, setShowMatchLive] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<string>('');

  // Forms
  const [playerForm, setPlayerForm] = useState({
    firstName: '',
    lastName: '',
    position: '',
    number: 1,
    status: 'ACTIVE' as const,
  });

  const [matchForm, setMatchForm] = useState({
    opponent: '',
    date: '',
    time: '',
    location: 'HOME' as const,
  });

  const positions = [
    "Gardien",
    "Défenseur central",
    "Défenseur latéral",
    "Milieu défensif",
    "Milieu offensif",
    "Ailier",
    "Attaquant"
  ];

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      loadTeamData();
    }
  }, [selectedTeam, activeTab]);

  const loadTeams = async () => {
    try {
      const teamsData = await apiService.getTeams();
      setTeams(teamsData as Team[]);
      if ((teamsData as Team[]).length > 0 && !selectedTeam) {
        setSelectedTeam((teamsData as Team[])[0].id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des équipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeamData = async () => {
    if (!selectedTeam) return;

    try {
      if (activeTab === 'players') {
        const playersData = await apiService.getPlayers(selectedTeam);
        setPlayers(playersData as Player[]);
      } else {
        const matchesData = await apiService.getMatches(selectedTeam);
        setMatches(matchesData as Match[]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createPlayer({
        ...playerForm,
        teamId: selectedTeam,
      });
      setShowAddPlayer(false);
      setPlayerForm({
        firstName: '',
        lastName: '',
        position: '',
        number: 1,
        status: 'ACTIVE',
      });
      loadTeamData();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du joueur:', error);
      alert('Erreur lors de l\'ajout du joueur');
    }
  };

  const handleAddMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dateTime = new Date(`${matchForm.date}T${matchForm.time}`);
      await apiService.createMatch({
        opponent: matchForm.opponent,
        date: dateTime.toISOString(),
        location: matchForm.location,
        teamId: selectedTeam,
      });
      setShowAddMatch(false);
      setMatchForm({
        opponent: '',
        date: '',
        time: '',
        location: 'HOME',
      });
      loadTeamData();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du match:', error);
      alert('Erreur lors de l\'ajout du match');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700';
      case 'INJURED':
        return 'bg-red-100 text-red-700';
      case 'SUSPENDED':
        return 'bg-yellow-100 text-yellow-700';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Actif';
      case 'INJURED':
        return 'Blessé';
      case 'SUSPENDED':
        return 'Suspendu';
      case 'INACTIVE':
        return 'Inactif';
      default:
        return 'Inconnu';
    }
  };

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-700';
      case 'LIVE':
        return 'bg-green-100 text-green-700';
      case 'FINISHED':
        return 'bg-gray-100 text-gray-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getMatchStatusText = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'Programmé';
      case 'LIVE':
        return 'En cours';
      case 'FINISHED':
        return 'Terminé';
      case 'CANCELLED':
        return 'Annulé';
      default:
        return 'Inconnu';
    }
  };

  const getMatchResult = (match: Match) => {
    if (match.status !== 'FINISHED') return null;
    if (match.ourScore > match.opponentScore) return 'Victoire';
    if (match.ourScore < match.opponentScore) return 'Défaite';
    return 'Match nul';
  };

  const getNextAvailableNumber = () => {
    const usedNumbers = players.map(p => p.number);
    for (let i = 1; i <= 99; i++) {
      if (!usedNumbers.includes(i)) {
        return i;
      }
    }
    return 1;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion de l'équipe
          </h1>
          <p className="text-gray-600">
            Gérez vos joueurs, matchs et compositions
          </p>
        </div>
        
        {/* Sélecteur d'équipe */}
        <div className="flex items-center space-x-4">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedTeam && (
        <>
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('players')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'players'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👥 Joueurs ({players.length})
              </button>
              <button
                onClick={() => setActiveTab('matches')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'matches'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ⚽ Matchs ({matches.length})
              </button>
            </nav>
          </div>

          {/* Contenu des onglets */}
          {activeTab === 'players' && (
            <div className="space-y-6">
              {/* Stats des joueurs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Effectif total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {players.filter(p => p.status === 'INJURED').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">⚽</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Buts totaux</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {players.reduce((sum, p) => sum + p.goals.length, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions joueurs */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Liste des joueurs</h2>
                <button
                  onClick={() => {
                    setPlayerForm({ ...playerForm, number: getNextAvailableNumber() });
                    setShowAddPlayer(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                >
                  + Ajouter un joueur
                </button>
              </div>

              {/* Liste des joueurs */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left p-4 font-medium text-gray-700">Joueur</th>
                        <th className="text-left p-4 font-medium text-gray-700">Position</th>
                        <th className="text-left p-4 font-medium text-gray-700">N°</th>
                        <th className="text-left p-4 font-medium text-gray-700">Matchs</th>
                        <th className="text-left p-4 font-medium text-gray-700">Buts</th>
                        <th className="text-left p-4 font-medium text-gray-700">Passes D.</th>
                        <th className="text-left p-4 font-medium text-gray-700">Statut</th>
                        <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((player) => (
                        <tr key={player.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700">
                                {player.firstName[0]}{player.lastName[0]}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {player.firstName} {player.lastName}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-700">{player.position}</td>
                          <td className="p-4 text-gray-700">{player.number}</td>
                          <td className="p-4 text-gray-700">{player.matchPlayers.length}</td>
                          <td className="p-4 text-gray-700">{player.goals.length}</td>
                          <td className="p-4 text-gray-700">{player.assists.length}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(player.status)}`}>
                              {getStatusText(player.status)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => {
                                  setSelectedPlayer(player);
                                  setShowPlayerDetails(true);
                                }}
                                className="text-green-600 hover:text-green-700 text-sm"
                              >
                                Détails
                              </button>
                              <button className="text-blue-600 hover:text-blue-700 text-sm">
                                Modifier
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="space-y-6">
              {/* Stats des matchs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">⚽</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total matchs</p>
                      <p className="text-2xl font-bold text-gray-900">{matches.length}</p>
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
                      <p className="text-2xl font-bold text-gray-900">
                        {matches.filter(m => getMatchResult(m) === 'Victoire').length}
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
                      <p className="text-2xl font-bold text-gray-900">
                        {matches.reduce((sum, m) => sum + m.ourScore, 0)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🥅</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Buts encaissés</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {matches.reduce((sum, m) => sum + m.opponentScore, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions matchs */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Liste des matchs</h2>
                <button
                  onClick={() => setShowAddMatch(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                >
                  + Programmer un match
                </button>
              </div>

              {/* Liste des matchs */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="space-y-4 p-6">
                  {matches.map((match) => (
                    <div key={match.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        {/* Info du match */}
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">
                              {new Date(match.date).toLocaleDateString('fr-FR')}
                            </p>
                            <p className="font-medium text-gray-900">
                              {new Date(match.date).toLocaleTimeString('fr-FR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium text-gray-900">Notre équipe</p>
                              <p className="text-sm text-gray-500">
                                {match.location === 'HOME' ? 'Domicile' : 'Extérieur'}
                              </p>
                            </div>
                            
                            <div className="text-center px-4">
                              {match.status === 'FINISHED' ? (
                                <p className="text-2xl font-bold text-gray-900">
                                  {match.ourScore} - {match.opponentScore}
                                </p>
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

                        {/* Statut et actions */}
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMatchStatusColor(match.status)}`}>
                            {getMatchStatusText(match.status)}
                          </span>
                          
                          <div className="flex space-x-2">
                            {match.status === 'SCHEDULED' && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedMatch(match.id);
                                    setShowComposition(true);
                                  }}
                                  className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700"
                                >
                                  📋 Composition
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedMatch(match.id);
                                    setShowMatchLive(true);
                                  }}
                                  className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700"
                                >
                                  ▶️ Démarrer
                                </button>
                              </>
                            )}
                            
                            {match.status === 'LIVE' && (
                              <button
                                onClick={() => {
                                  setSelectedMatch(match.id);
                                  setShowMatchLive(true);
                                }}
                                className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 animate-pulse"
                              >
                                🔴 LIVE
                              </button>
                            )}
                            
                            {match.status === 'FINISHED' && (
                              <button
                                onClick={() => {
                                  setSelectedMatch(match.id);
                                  setShowMatchLive(true);
                                }}
                                className="bg-gray-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700"
                              >
                                📊 Détails
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {matches.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-6xl mb-4">⚽</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun match programmé</h3>
                      <p className="text-gray-500 mb-6">Commencez par programmer votre premier match</p>
                      <button
                        onClick={() => setShowAddMatch(true)}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                      >
                        + Programmer un match
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal Ajouter Joueur */}
      {showAddPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Ajouter un joueur</h3>
              <button
                onClick={() => setShowAddPlayer(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddPlayer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={playerForm.firstName}
                    onChange={(e) => setPlayerForm({ ...playerForm, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Lionel"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={playerForm.lastName}
                    onChange={(e) => setPlayerForm({ ...playerForm, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Messi"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <select
                  required
                  value={playerForm.position}
                  onChange={(e) => setPlayerForm({ ...playerForm, position: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une position</option>
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    required
                    value={playerForm.number}
                    onChange={(e) => setPlayerForm({ ...playerForm, number: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={playerForm.status}
                    onChange={(e) => setPlayerForm({ ...playerForm, status: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="ACTIVE">Actif</option>
                    <option value="INJURED">Blessé</option>
                    <option value="SUSPENDED">Suspendu</option>
                    <option value="INACTIVE">Inactif</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPlayer(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajouter Match */}
      {showAddMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Programmer un match</h3>
              <button
                onClick={() => setShowAddMatch(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddMatch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adversaire *
                </label>
                <input
                  type="text"
                  required
                  value={matchForm.opponent}
                  onChange={(e) => setMatchForm({ ...matchForm, opponent: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: FC Barcelona"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={matchForm.date}
                    onChange={(e) => setMatchForm({ ...matchForm, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure *
                  </label>
                  <input
                    type="time"
                    required
                    value={matchForm.time}
                    onChange={(e) => setMatchForm({ ...matchForm, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lieu
                </label>
                <select
                  value={matchForm.location}
                  onChange={(e) => setMatchForm({ ...matchForm, location: e.target.value as typeof matchForm.location })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="HOME">🏠 Domicile</option>
                  <option value="AWAY">✈️ Extérieur</option>
                </select>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMatch(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Programmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals pour les matchs */}
      {showComposition && selectedMatch && (
        <MatchComposition
          matchId={selectedMatch}
          onClose={() => {
            setShowComposition(false);
            setSelectedMatch('');
          }}
          onSave={() => {
            loadTeamData();
          }}
        />
      )}

      {showMatchLive && selectedMatch && (
        <MatchLive
          matchId={selectedMatch}
          onClose={() => {
            setShowMatchLive(false);
            setSelectedMatch('');
            loadTeamData();
          }}
        />
      )}

      {/* Modal détails joueur */}
      {showPlayerDetails && selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-xl font-bold text-green-700">
                    {selectedPlayer.firstName[0]}{selectedPlayer.lastName[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedPlayer.firstName} {selectedPlayer.lastName}
                    </h2>
                    <p className="text-gray-600">{selectedPlayer.position} - N°{selectedPlayer.number}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPlayerDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Statistiques */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Statistiques de la saison</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedPlayer.matchPlayers.length}</div>
                      <div className="text-sm text-gray-600">Matchs joués</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedPlayer.goals.length}</div>
                      <div className="text-sm text-gray-600">Buts marqués</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{selectedPlayer.assists.length}</div>
                      <div className="text-sm text-gray-600">Passes décisives</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{selectedPlayer.cards.length}</div>
                      <div className="text-sm text-gray-600">Cartons reçus</div>
                    </div>
                  </div>

                  {/* Moyennes */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Moyennes par match</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Buts:</span>
                        <span className="font-medium">
                          {selectedPlayer.matchPlayers.length > 0 
                            ? (selectedPlayer.goals.length / selectedPlayer.matchPlayers.length).toFixed(2) 
                            : '0.00'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Passes décisives:</span>
                        <span className="font-medium">
                          {selectedPlayer.matchPlayers.length > 0 
                            ? (selectedPlayer.assists.length / selectedPlayer.matchPlayers.length).toFixed(2) 
                            : '0.00'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statut et actions */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Informations</h3>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Statut actuel</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPlayer.status)}`}>
                      {getStatusText(selectedPlayer.status)}
                    </span>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Cartons reçus</h4>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="w-4 h-4 bg-yellow-400 rounded"></span>
                        <span className="text-sm">
                          Jaunes: <strong>{selectedPlayer.cards.filter(c => c.type === 'YELLOW').length}</strong>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-4 h-4 bg-red-500 rounded"></span>
                        <span className="text-sm">
                          Rouges: <strong>{selectedPlayer.cards.filter(c => c.type === 'RED').length}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => setShowPlayerDetails(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Fermer
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Modifier le joueur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagementUpdated;