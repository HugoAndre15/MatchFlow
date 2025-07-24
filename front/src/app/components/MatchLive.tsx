// front/src/app/components/MatchLive.tsx
"use client";
import React, { useState, useEffect } from "react";
import { apiService } from "@/services/api";

interface MatchLiveProps {
  matchId: string;
  onClose: () => void;
}

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  number: number;
  position: string;
}

interface MatchEvent {
  id: string;
  type: 'goal' | 'assist' | 'card' | 'substitution';
  minute: number;
  player: Player;
  data?: any;
}

const MatchLive: React.FC<MatchLiveProps> = ({ matchId, onClose }) => {
  const [match, setMatch] = useState<any>(null);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventType, setEventType] = useState<'goal' | 'assist' | 'card' | 'substitution'>('goal');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [selectedPlayerOut, setSelectedPlayerOut] = useState<string>('');
  const [cardType, setCardType] = useState<'YELLOW' | 'RED'>('YELLOW');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatch();
  }, [matchId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentMinute(prev => prev + 1);
      }, 60000); // 1 minute = 60 secondes
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const loadMatch = async () => {
    try {
      const matchData = await apiService.getMatch(matchId);
      // Assert the type of matchData
      const typedMatchData = matchData as {
        status: string;
        startTime?: string;
        goals: any[];
        assists: any[];
        cards: any[];
        substitutions: any[];
        [key: string]: any;
      };
      setMatch(typedMatchData);
      
      if (typedMatchData.status === 'LIVE') {
        setIsRunning(true);
        // Calculer le temps écoulé depuis le début
        if (typedMatchData.startTime) {
          const elapsed = Math.floor((Date.now() - new Date(typedMatchData.startTime).getTime()) / 60000);
          setCurrentMinute(elapsed);
        }
      }
      
      // Charger les événements
      const allEvents = [
        ...typedMatchData.goals.map((g: any) => ({ ...g, type: 'goal' })),
        ...typedMatchData.assists.map((a: any) => ({ ...a, type: 'assist' })),
        ...typedMatchData.cards.map((c: any) => ({ ...c, type: 'card' })),
        ...typedMatchData.substitutions.map((s: any) => ({ ...s, type: 'substitution' })),
      ].sort((a, b) => a.minute - b.minute);
      
      setEvents(allEvents);
    } catch (error) {
      console.error('Erreur lors du chargement du match:', error);
    } finally {
      setLoading(false);
    }
  };

  const startMatch = async () => {
    try {
      await apiService.startMatch(matchId);
      setIsRunning(true);
      setCurrentMinute(0);
      await loadMatch();
    } catch (error) {
      console.error('Erreur lors du démarrage du match:', error);
    }
  };

  const pauseMatch = () => {
    setIsRunning(false);
  };

  const resumeMatch = () => {
    setIsRunning(true);
  };

  const endMatch = async () => {
    try {
      await apiService.endMatch(matchId);
      setIsRunning(false);
      await loadMatch();
    } catch (error) {
      console.error('Erreur lors de la fin du match:', error);
    }
  };

  const addEvent = async () => {
    try {
      const minute = currentMinute;
      
      switch (eventType) {
        case 'goal':
          await apiService.addGoal(matchId, {
            playerId: selectedPlayer,
            minute,
          });
          break;
        case 'assist':
          await apiService.addAssist(matchId, {
            playerId: selectedPlayer,
            minute,
          });
          break;
        case 'card':
          await apiService.addCard(matchId, {
            playerId: selectedPlayer,
            type: cardType,
            minute,
          });
          break;
        case 'substitution':
          await apiService.addSubstitution(matchId, {
            playerInId: selectedPlayer,
            playerOutId: selectedPlayerOut,
            minute,
          });
          break;
      }
      
      await loadMatch();
      setShowEventModal(false);
      setSelectedPlayer('');
      setSelectedPlayerOut('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'événement:', error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du match...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return null;
  }

  const starters = match.matchPlayers.filter((mp: any) => mp.isStarter);
  const substitutes = match.matchPlayers.filter((mp: any) => !mp.isStarter);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-green-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {match.team.name} vs {match.opponent}
              </h1>
              <p className="text-green-100">
                {new Date(match.date).toLocaleDateString('fr-FR')} - {match.location === 'HOME' ? 'Domicile' : 'Extérieur'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {match.ourScore} - {match.opponentScore}
              </div>
              <div className="text-green-100">
                {currentMinute}'
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-4">
            {match.status === 'SCHEDULED' && (
              <button
                onClick={startMatch}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
              >
                ⏯️ Démarrer le match
              </button>
            )}
            
            {match.status === 'LIVE' && (
              <>
                {isRunning ? (
                  <button
                    onClick={pauseMatch}
                    className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700"
                  >
                    ⏸️ Pause
                  </button>
                ) : (
                  <button
                    onClick={resumeMatch}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700"
                  >
                    ▶️ Reprendre
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setEventType('goal');
                    setShowEventModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700"
                >
                  ⚽ But
                </button>
                
                <button
                  onClick={() => {
                    setEventType('assist');
                    setShowEventModal(true);
                  }}
                  className="bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700"
                >
                  🎯 Passe D.
                </button>
                
                <button
                  onClick={() => {
                    setEventType('card');
                    setShowEventModal(true);
                  }}
                  className="bg-yellow-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-yellow-600"
                >
                  🟨 Carton
                </button>
                
                <button
                  onClick={() => {
                    setEventType('substitution');
                    setShowEventModal(true);
                  }}
                  className="bg-gray-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700"
                >
                  🔄 Changement
                </button>
                
                <button
                  onClick={endMatch}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700"
                >
                  🏁 Fin du match
                </button>
              </>
            )}
            
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600"
            >
              ✕ Fermer
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 p-6">
          {/* Terrain et composition */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Composition</h3>
            
            {/* Titulaires */}
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-green-800 mb-3">Titulaires ({starters.length}/11)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {starters.map((mp: any) => (
                  <div key={mp.id} className="flex items-center space-x-3 bg-white rounded-lg p-3">
                    <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {mp.player.number}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {mp.player.firstName} {mp.player.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{mp.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Remplaçants */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3">Remplaçants ({substitutes.length}/7)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {substitutes.map((mp: any) => (
                  <div key={mp.id} className="flex items-center space-x-3 bg-white rounded-lg p-3">
                    <span className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {mp.player.number}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {mp.player.firstName} {mp.player.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{mp.player.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Événements du match */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Événements</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {events.map((event, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">
                        {event.minute}'
                      </span>
                      <span className="text-xl">
                        {event.type === 'goal' && '⚽'}
                        {event.type === 'assist' && '🎯'}
                        {event.type === 'card' && (event.data?.type === 'RED' ? '🟥' : '🟨')}
                        {event.type === 'substitution' && '🔄'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {event.player.firstName} {event.player.lastName}
                  </p>
                  {event.type === 'substitution' && event.data?.playerOut && (
                    <p className="text-xs text-gray-500">
                      → {event.data.playerOut.firstName} {event.data.playerOut.lastName}
                    </p>
                  )}
                </div>
              ))}
              
              {events.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  Aucun événement pour le moment
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal d'ajout d'événement */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Ajouter un {eventType === 'goal' ? 'but' : eventType === 'assist' ? 'passe décisive' : eventType === 'card' ? 'carton' : 'changement'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minute: {currentMinute}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {eventType === 'substitution' ? 'Joueur qui entre' : 'Joueur'}
                  </label>
                  <select
                    value={selectedPlayer}
                    onChange={(e) => setSelectedPlayer(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Sélectionner un joueur</option>
                    {(eventType === 'substitution' ? substitutes : match.matchPlayers).map((mp: any) => (
                      <option key={mp.id} value={mp.playerId}>
                        #{mp.player.number} - {mp.player.firstName} {mp.player.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                {eventType === 'substitution' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Joueur qui sort
                    </label>
                    <select
                      value={selectedPlayerOut}
                      onChange={(e) => setSelectedPlayerOut(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Sélectionner un joueur</option>
                      {starters.map((mp: any) => (
                        <option key={mp.id} value={mp.playerId}>
                          #{mp.player.number} - {mp.player.firstName} {mp.player.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {eventType === 'card' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de carton
                    </label>
                    <select
                      value={cardType}
                      onChange={(e) => setCardType(e.target.value as 'YELLOW' | 'RED')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="YELLOW">🟨 Carton jaune</option>
                      <option value="RED">🟥 Carton rouge</option>
                    </select>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={addEvent}
                    disabled={!selectedPlayer || (eventType === 'substitution' && !selectedPlayerOut)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchLive;