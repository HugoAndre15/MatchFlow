// front/src/app/components/MatchComposition.tsx
"use client";
import React, { useState, useEffect } from "react";
import { apiService } from "@/services/api";

interface MatchCompositionProps {
  matchId: string;
  onClose: () => void;
  onSave: () => void;
}

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  number: number;
  position: string;
  status: string;
}

interface CompositionPlayer {
  playerId: string;
  position: string;
  player: Player;
}

const positions = [
  { value: 'GOALKEEPER', label: 'Gardien', short: 'G' },
  { value: 'DEFENDER', label: 'Défenseur', short: 'D' },
  { value: 'MIDFIELDER', label: 'Milieu', short: 'M' },
  { value: 'FORWARD', label: 'Attaquant', short: 'A' },
];

const MatchComposition: React.FC<MatchCompositionProps> = ({ matchId, onClose, onSave }) => {
  const [match, setMatch] = useState<any>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [starters, setStarters] = useState<CompositionPlayer[]>([]);
  const [substitutes, setSubstitutes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [matchId]);

  const loadData = async () => {
    try {
      const [matchDataRaw, playersData] = await Promise.all([
        apiService.getMatch(matchId),
        apiService.getPlayers(matchId)
      ]);
      
      // Assert the type of matchData
      const matchData = matchDataRaw as {
        matchPlayers?: any[];
        team?: { name: string };
        opponent?: string;
        [key: string]: any;
      };
      setMatch(matchData);
      
      // Filtrer les joueurs actifs
      const activePlayers = (playersData as Player[]).filter((p: Player) => p.status === 'ACTIVE');
      setPlayers(activePlayers);

      // Charger la composition existante si elle existe
      if (matchData.matchPlayers && matchData.matchPlayers.length > 0) {
        const existingStarters = matchData.matchPlayers
          .filter((mp: any) => mp.isStarter)
          .map((mp: any) => ({
            playerId: mp.playerId,
            position: mp.position,
            player: mp.player
          }));
        
        const existingSubs = matchData.matchPlayers
          .filter((mp: any) => !mp.isStarter)
          .map((mp: any) => mp.playerId);

        setStarters(existingStarters);
        setSubstitutes(existingSubs);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const addStarter = (playerId: string, position: string) => {
    if (starters.length >= 11) return;
    
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    // Retirer des remplaçants si présent
    setSubstitutes(prev => prev.filter(id => id !== playerId));
    
    // Ajouter aux titulaires
    setStarters(prev => [...prev, { playerId, position, player }]);
  };

  const removeStarter = (playerId: string) => {
    setStarters(prev => prev.filter(s => s.playerId !== playerId));
  };

  const addSubstitute = (playerId: string) => {
    if (substitutes.length >= 7) return;
    if (starters.find(s => s.playerId === playerId)) return;
    
    setSubstitutes(prev => [...prev, playerId]);
  };

  const removeSubstitute = (playerId: string) => {
    setSubstitutes(prev => prev.filter(id => id !== playerId));
  };

  const updateStarterPosition = (playerId: string, newPosition: string) => {
    setStarters(prev => prev.map(s => 
      s.playerId === playerId ? { ...s, position: newPosition } : s
    ));
  };

  const saveComposition = async () => {
    if (starters.length !== 11) {
      alert('Vous devez sélectionner exactement 11 titulaires');
      return;
    }

    setSaving(true);
    try {
      await apiService.setMatchComposition(matchId, {
        starters: starters.map(s => ({ playerId: s.playerId, position: s.position })),
        substitutes: substitutes.map(id => ({ playerId: id }))
      });
      
      onSave();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde de la composition');
    } finally {
      setSaving(false);
    }
  };

  const getAvailablePlayers = () => {
    const usedPlayerIds = [...starters.map(s => s.playerId), ...substitutes];
    return players.filter(p => !usedPlayerIds.includes(p.id));
  };

  const getPlayerById = (id: string) => {
    return players.find(p => p.id === id);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-green-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Composition d'équipe</h1>
              <p className="text-green-100">
                {match?.team.name} vs {match?.opponent}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Joueurs disponibles */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Joueurs disponibles ({getAvailablePlayers().length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {getAvailablePlayers().map(player => (
                  <div key={player.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {player.number}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">
                            {player.firstName} {player.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{player.position}</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {positions.map(pos => (
                          <button
                            key={pos.value}
                            onClick={() => addStarter(player.id, pos.value)}
                            disabled={starters.length >= 11}
                            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={`Ajouter comme ${pos.label}`}
                          >
                            {pos.short}
                          </button>
                        ))}
                        <button
                          onClick={() => addSubstitute(player.id)}
                          disabled={substitutes.length >= 7}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Ajouter comme remplaçant"
                        >
                          R
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Titulaires */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Titulaires ({starters.length}/11)
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {starters.map(starter => (
                  <div key={starter.playerId} className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {starter.player.number}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">
                            {starter.player.firstName} {starter.player.lastName}
                          </p>
                          <select
                            value={starter.position}
                            onChange={(e) => updateStarterPosition(starter.playerId, e.target.value)}
                            className="text-sm text-green-700 bg-transparent border-none focus:ring-0 p-0"
                          >
                            {positions.map(pos => (
                              <option key={pos.value} value={pos.value}>
                                {pos.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={() => removeStarter(starter.playerId)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                
                {starters.length < 11 && (
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <p className="text-gray-500 text-sm">
                      Ajoutez {11 - starters.length} titulaire(s) supplémentaire(s)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Remplaçants */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Remplaçants ({substitutes.length}/7)
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {substitutes.map(subId => {
                  const player = getPlayerById(subId);
                  if (!player) return null;
                  
                  return (
                    <div key={subId} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {player.number}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">
                              {player.firstName} {player.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{player.position}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeSubstitute(subId)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                {substitutes.length < 7 && (
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <p className="text-gray-500 text-sm">
                      Vous pouvez ajouter {7 - substitutes.length} remplaçant(s) supplémentaire(s)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Terrain de football visuel */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Aperçu du terrain</h3>
            <div className="bg-green-100 rounded-lg p-6 relative overflow-hidden">
              {/* Terrain */}
              <div className="relative w-full h-96 bg-green-200 rounded border-2 border-white">
                {/* Ligne de milieu */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white transform -translate-x-0.5"></div>
                
                {/* Cercle central */}
                <div className="absolute left-1/2 top-1/2 w-20 h-20 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                
                {/* Surface de réparation gauche */}
                <div className="absolute left-0 top-1/2 w-16 h-32 border-2 border-r-white border-t-white border-b-white transform -translate-y-1/2"></div>
                
                {/* Surface de réparation droite */}
                <div className="absolute right-0 top-1/2 w-16 h-32 border-2 border-l-white border-t-white border-b-white transform -translate-y-1/2"></div>
                
                {/* Positionnement des joueurs */}
                {starters.map((starter, index) => {
                  // Positions par défaut selon le poste
                  let x = 50, y = 50;
                  
                  switch (starter.position) {
                    case 'GOALKEEPER':
                      x = 10; y = 50;
                      break;
                    case 'DEFENDER':
                      x = 25; y = 20 + (index * 15);
                      break;
                    case 'MIDFIELDER':
                      x = 50; y = 20 + (index * 15);
                      break;
                    case 'FORWARD':
                      x = 75; y = 30 + (index * 20);
                      break;
                  }
                  
                  return (
                    <div
                      key={starter.playerId}
                      className="absolute w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      title={`${starter.player.firstName} ${starter.player.lastName}`}
                    >
                      {starter.player.number}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p>
                ✅ Titulaires: {starters.length}/11 • 
                📋 Remplaçants: {substitutes.length}/7
              </p>
              {starters.length !== 11 && (
                <p className="text-red-600 mt-1">
                  ⚠️ Vous devez sélectionner exactement 11 titulaires
                </p>
              )}
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                disabled={saving}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={saveComposition}
                disabled={starters.length !== 11 || saving}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder la composition'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchComposition;