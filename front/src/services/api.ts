// front/src/services/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
      throw new Error(error.message || 'Une erreur est survenue');
    }
    return response.json();
  }

  // Authentication
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async login(data: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await this.handleResponse<any>(response);
    if (result.access_token) {
      localStorage.setItem('access_token', result.access_token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }
    return result;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Teams
  async getTeams() {
    const response = await fetch(`${API_BASE_URL}/teams`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getTeam(id: string) {
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createTeam(data: {
    name: string;
    category?: string;
    homeColors?: string;
    awayColors?: string;
    stadium?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/teams`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateTeam(id: string, data: Partial<{
    name: string;
    category: string;
    homeColors: string;
    awayColors: string;
    stadium: string;
  }>) {
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteTeam(id: string) {
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getTeamStats(id: string) {
    const response = await fetch(`${API_BASE_URL}/teams/${id}/stats`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Players
  async getPlayers(teamId: string) {
    const response = await fetch(`${API_BASE_URL}/players?teamId=${teamId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getPlayer(id: string) {
    const response = await fetch(`${API_BASE_URL}/players/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createPlayer(data: {
    firstName: string;
    lastName: string;
    position: string;
    number: number;
    status?: string;
    teamId: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/players`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updatePlayer(id: string, data: Partial<{
    firstName: string;
    lastName: string;
    position: string;
    number: number;
    status: string;
  }>) {
    const response = await fetch(`${API_BASE_URL}/players/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deletePlayer(id: string) {
    const response = await fetch(`${API_BASE_URL}/players/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getPlayerStats(id: string) {
    const response = await fetch(`${API_BASE_URL}/players/${id}/stats`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Matches
  async getMatches(teamId: string) {
    const response = await fetch(`${API_BASE_URL}/matches?teamId=${teamId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getMatch(id: string) {
    const response = await fetch(`${API_BASE_URL}/matches/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createMatch(data: {
    opponent: string;
    date: string;
    location: 'HOME' | 'AWAY';
    teamId: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/matches`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async updateMatch(id: string, data: Partial<{
    opponent: string;
    date: string;
    location: 'HOME' | 'AWAY';
    status: string;
    ourScore: number;
    opponentScore: number;
  }>) {
    const response = await fetch(`${API_BASE_URL}/matches/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async deleteMatch(id: string) {
    const response = await fetch(`${API_BASE_URL}/matches/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async setMatchComposition(matchId: string, composition: {
    starters: { playerId: string; position: string }[];
    substitutes: { playerId: string }[];
  }) {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}/composition`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(composition),
    });
    return this.handleResponse(response);
  }

  async startMatch(id: string) {
    const response = await fetch(`${API_BASE_URL}/matches/${id}/start`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async endMatch(id: string) {
    const response = await fetch(`${API_BASE_URL}/matches/${id}/end`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async addGoal(matchId: string, data: {
    playerId: string;
    minute: number;
    isOwnGoal?: boolean;
  }) {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}/goal`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async addAssist(matchId: string, data: {
    playerId: string;
    minute: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}/assist`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async addCard(matchId: string, data: {
    playerId: string;
    type: 'YELLOW' | 'RED';
    minute: number;
    reason?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}/card`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async addSubstitution(matchId: string, data: {
    playerInId: string;
    playerOutId: string;
    minute: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}/substitution`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getMatchStats(id: string) {
    const response = await fetch(`${API_BASE_URL}/matches/${id}/stats`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();