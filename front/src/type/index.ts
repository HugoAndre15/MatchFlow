// src/types/index.ts

export interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  status: 'active' | 'injured' | 'suspended';
  stats: {
    goals: number;
    assists: number;
    matches: number;
    yellowCards: number;
    redCards: number;
    playingTime: number;
  };
}

export interface MatchEvent {
  id: number;
  type: 'goal' | 'assist' | 'substitution' | 'card';
  playerId: number;
  assistPlayerId?: number;
  minute: number;
  cardType?: 'yellow' | 'red';
  substitution?: {
    outPlayerId: number;
    inPlayerId: number;
  };
}

export interface Match {
  id: number;
  date: string;
  time: string;
  opponent: string;
  location: 'home' | 'away';
  venue: string;
  status: 'upcoming' | 'live' | 'completed';
  lineup?: {
    starting: number[];
    substitutes: number[];
    captain: number;
  };
  events: MatchEvent[];
  finalScore?: {
    home: number;
    away: number;
  };
}

export type ViewType = 'dashboard' | 'players' | 'matches' | 'match-preparation' | 'match-live';