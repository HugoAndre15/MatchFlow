// front/src/app/login/page.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      router.push('/mon-espace');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        {/* Floating footballs */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/10 text-4xl animate-bounce"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 2)}s`,
            }}
          >
            ⚽
          </div>
        ))}
        
        {/* Gradient orbs with enhanced effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Stadium lights effect */}
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-yellow-300/20 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-yellow-300/20 to-transparent"></div>
        
        {/* Sparkle effects */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + Math.random()}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo with enhanced effects */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <span className="text-green-600 font-bold text-2xl group-hover:animate-bounce">⚽</span>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity blur"></div>
              {/* Pulse ring */}
              <div className="absolute -inset-1 border-2 border-white/30 rounded-2xl opacity-0 group-hover:opacity-100 animate-ping"></div>
            </div>
            <div>
              <span className="text-3xl font-black text-white group-hover:text-yellow-300 transition-colors">MatchFlow</span>
              <div className="text-green-200 text-sm group-hover:text-yellow-200 transition-colors">Coach Edition</div>
            </div>
          </Link>
        </div>

        {/* Enhanced Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 relative overflow-hidden group">
          {/* Card glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity blur"></div>
          
          {/* Floating particles inside card */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-green-400/20 rounded-full animate-bounce"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + (i % 2) * 80}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${4 + (i % 2)}s`,
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 hover:text-green-600 transition-colors">
                Bon retour ! 👋
              </h1>
              <p className="text-gray-600">
                Connectez-vous à votre espace coach
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-green-600 transition-colors">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-300 hover:shadow-md"
                    placeholder="votre@email.com"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/0 to-blue-400/0 hover:from-green-400/5 hover:to-blue-400/5 transition-all pointer-events-none"></div>
                </div>
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-green-600 transition-colors">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-300 hover:shadow-md"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/0 to-blue-400/0 hover:from-green-400/5 hover:to-blue-400/5 transition-all pointer-events-none"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 group-hover:scale-110 transition-transform"
                  />
                  <span className="ml-2 text-sm text-gray-600 group-hover:text-green-600 transition-colors">Se souvenir de moi</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline transition-all"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg relative overflow-hidden group"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connexion...</span>
                  </div>
                ) : (
                  <span className="relative z-10">Se connecter</span>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Pas encore de compte ?{' '}
                <Link
                  href="/register"
                  className="text-green-600 font-semibold hover:text-green-700 transition-colors hover:underline"
                >
                  Créer un compte
                </Link>
              </p>
            </div>

            {/* Enhanced trust indicators */}
            <div className="mt-6 flex items-center justify-center space-x-6 text-green-600 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl py-3 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-1 hover:scale-110 transition-transform cursor-pointer">
                <span className="animate-pulse">🛡️</span>
                <span className="text-xs font-medium">Sécurisé</span>
              </div>
              <div className="flex items-center space-x-1 hover:scale-110 transition-transform cursor-pointer">
                <span className="animate-bounce">⚡</span>
                <span className="text-xs font-medium">Accès instantané</span>
              </div>
              <div className="flex items-center space-x-1 hover:scale-110 transition-transform cursor-pointer">
                <span className="animate-pulse">🏆</span>
                <span className="text-xs font-medium">Utilisé par les pros</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-green-100 hover:text-white transition-colors text-sm font-medium inline-flex items-center space-x-1"
          >
            <span>←</span>
            <span>Retour à l'accueil</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;