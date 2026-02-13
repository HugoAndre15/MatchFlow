'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ first_name: string; last_name: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      setUser(authService.getUser());
    }
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">CoachFlow</h1>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600">
                {user.first_name} {user.last_name}
              </span>
            )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
          >
            Déconnexion
          </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Bienvenue sur CoachFlow 👋</h2>
          <p className="text-gray-600 mt-2">Gérez vos matchs, équipes et joueurs depuis votre tableau de bord.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="text-3xl mb-3">⚽</div>
            <h3 className="text-lg font-semibold text-gray-900">Matchs</h3>
            <p className="text-gray-500 text-sm mt-1">Planifiez et suivez vos matchs</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="text-lg font-semibold text-gray-900">Équipes</h3>
            <p className="text-gray-500 text-sm mt-1">Gérez la composition de vos équipes</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="text-3xl mb-3">🏟️</div>
            <h3 className="text-lg font-semibold text-gray-900">Clubs</h3>
            <p className="text-gray-500 text-sm mt-1">Administrez vos clubs</p>
          </div>
        </div>
      </main>
    </div>
  );
}
