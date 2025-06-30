"use client";
import React, { useState } from "react";

interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  goals: number;
  assists: number;
  matches: number;
  playingTime: number; // en minutes
  yellowCards: number;
  redCards: number;
  status: 'active' | 'injured' | 'suspended';
}

const TeamManagement = () => {
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showPlayerDetails, setShowPlayerDetails] = useState(false);
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      name: "Kylian Mbappé",
      position: "Attaquant",
      number: 10,
      goals: 12,
      assists: 8,
      matches: 15,
      playingTime: 1320, // 22h en minutes (15 matchs × 88 min moyenne)
      yellowCards: 2,
      redCards: 0,
      status: 'active'
    },
    {
      id: 2,
      name: "Antoine Griezmann",
      position: "Milieu offensif",
      number: 7,
      goals: 8,
      assists: 6,
      matches: 14,
      playingTime: 1210, // 20h10 en minutes
      yellowCards: 1,
      redCards: 0,
      status: 'active'
    },
    {
      id: 3,
      name: "Raphaël Varane",
      position: "Défenseur central",
      number: 4,
      goals: 2,
      assists: 1,
      matches: 12,
      playingTime: 1080, // 18h en minutes
      yellowCards: 3,
      redCards: 0,
      status: 'injured'
    },
    {
      id: 4,
      name: "Hugo Lloris",
      position: "Gardien",
      number: 1,
      goals: 0,
      assists: 0,
      matches: 15,
      playingTime: 1350, // 22h30 en minutes (gardien joue plus)
      yellowCards: 0,
      redCards: 0,
      status: 'active'
    }
  ]);

  const positions = [
    "Gardien",
    "Défenseur central",
    "Défenseur latéral",
    "Milieu défensif",
    "Milieu offensif",
    "Ailier",
    "Attaquant"
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'injured':
        return 'bg-red-100 text-red-700';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'injured':
        return 'Blessé';
      case 'suspended':
        return 'Suspendu';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion de l'équipe
          </h1>
          <p className="text-gray-600">
            Gérez vos joueurs, positions et compositions
          </p>
        </div>
        <button
          onClick={() => setShowAddPlayer(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          + Ajouter un joueur
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Effectif total</p>
              <p className="text-2xl font-bold text-gray-900">{players.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Joueurs actifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {players.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏥</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Blessés</p>
              <p className="text-2xl font-bold text-gray-900">
                {players.filter(p => p.status === 'injured').length}
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
                {players.reduce((sum, p) => sum + p.goals, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Players List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Liste des joueurs</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-700">Joueur</th>
                <th className="text-left p-4 font-medium text-gray-700">Position</th>
                <th className="text-left p-4 font-medium text-gray-700">N°</th>
                <th className="text-left p-4 font-medium text-gray-700">Temps de jeu</th>
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
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{player.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">{player.position}</td>
                  <td className="p-4 text-gray-700">{player.number}</td>
                  <td className="p-4 text-gray-700">
                    <div className="text-sm">
                      <span className="font-medium">{Math.floor(player.playingTime / 60)}h {player.playingTime % 60}min</span>
                      <div className="text-xs text-gray-500">
                        {player.matches > 0 ? Math.round(player.playingTime / player.matches) : 0} min/match
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">{player.matches}</td>
                  <td className="p-4 text-gray-700">{player.goals}</td>
                  <td className="p-4 text-gray-700">{player.assists}</td>
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
                      <button className="text-red-600 hover:text-red-700 text-sm">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Player Modal */}
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
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: Lionel Messi"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position *
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="">Sélectionner</option>
                    {positions.map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut initial
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="active">Actif</option>
                  <option value="injured">Blessé</option>
                  <option value="suspended">Suspendu</option>
                </select>
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

      {/* Player Details Modal */}
      {showPlayerDetails && selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-xl font-bold text-green-700">
                    {selectedPlayer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedPlayer.name}</h2>
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
                {/* Statistiques générales */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Statistiques de la saison</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedPlayer.matches}</div>
                      <div className="text-sm text-gray-600">Matchs joués</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedPlayer.goals}</div>
                      <div className="text-sm text-gray-600">Buts marqués</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{selectedPlayer.assists}</div>
                      <div className="text-sm text-gray-600">Passes décisives</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.floor(selectedPlayer.playingTime / 60)}h {selectedPlayer.playingTime % 60}min
                      </div>
                      <div className="text-sm text-gray-600">Temps de jeu total</div>
                    </div>
                  </div>

                  {/* Moyennes */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Moyennes par match</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Temps de jeu:</span>
                        <span className="font-medium">
                          {selectedPlayer.matches > 0 ? Math.round(selectedPlayer.playingTime / selectedPlayer.matches) : 0} min
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Buts:</span>
                        <span className="font-medium">
                          {selectedPlayer.matches > 0 ? (selectedPlayer.goals / selectedPlayer.matches).toFixed(2) : 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Passes décisives:</span>
                        <span className="font-medium">
                          {selectedPlayer.matches > 0 ? (selectedPlayer.assists / selectedPlayer.matches).toFixed(2) : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discipline et statut */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Discipline et statut</h3>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Cartons reçus</h4>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="w-4 h-4 bg-yellow-400 rounded"></span>
                        <span className="text-sm">Cartons jaunes: <strong>{selectedPlayer.yellowCards}</strong></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-4 h-4 bg-red-500 rounded"></span>
                        <span className="text-sm">Cartons rouges: <strong>{selectedPlayer.redCards}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Statut actuel</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPlayer.status)}`}>
                      {getStatusText(selectedPlayer.status)}
                    </span>
                  </div>

                  {/* Graphique simple de performance */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Performance offensive</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Buts</span>
                          <span>{selectedPlayer.goals}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{width: `${Math.min((selectedPlayer.goals / 20) * 100, 100)}%`}}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Passes décisives</span>
                          <span>{selectedPlayer.assists}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{width: `${Math.min((selectedPlayer.assists / 15) * 100, 100)}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
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

export default TeamManagement;
