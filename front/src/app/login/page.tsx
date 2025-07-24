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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects - Optimisé pour mobile */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/10 text-2xl md:text-4xl animate-bounce"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${3 + (i % 2)}s`,
            }}
          >
            ⚽
          </div>
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 md:w-48 md:h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300">
                <span className="text-green-600 font-bold text-2xl">⚽</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity blur"></div>
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-black text-white">MatchFlow</span>
              <div className="text-green-200 text-xs md:text-sm">Coach Edition</div>
            </div>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20">
          <div className="text-center mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Bon retour ! 👋
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Connectez-vous à votre espace coach
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-green-600 transition-colors">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900 placeholder-gray-400 hover:border-green-300"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-green-600 transition-colors">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all text-gray-900 placeholder-gray-400 hover:border-green-300"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 transition-all"
                />
                <span className="ml-2 text-gray-600 group-hover:text-green-600 transition-colors">Se souvenir de moi</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-green-600 hover:text-green-700 font-medium transition-colors underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 px-6 rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connexion...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>🚀</span>
                  <span>Se connecter</span>
                </div>
              )}
            </button>
          </form>

          {/* Séparateur */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 bg-white">ou</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Connexion sociale (facultatif) */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continuer avec Google</span>
            </button>
          </div>

          {/* Lien d'inscription */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Pas encore de compte ?{' '}
              <Link
                href="/register"
                className="text-green-600 font-semibold hover:text-green-700 transition-colors underline"
              >
                Créer un compte
              </Link>
            </p>
          </div>

          {/* Indicateurs de confiance */}
          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            {[
              { icon: "🛡️", text: "Sécurisé" },
              { icon: "⚡", text: "Accès instantané" },
              { icon: "🏆", text: "Utilisé par les pros" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center space-y-1 p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-medium text-green-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Retour à l'accueil */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-green-100 hover:text-white transition-colors text-sm font-medium inline-flex items-center space-x-1 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Retour à l'accueil</span>
          </Link>
        </div>

        {/* Stats rapides */}
        <div className="mt-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white text-center">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-bold text-lg">10k+</div>
                <div className="text-green-200">Coachs</div>
              </div>
              <div>
                <div className="font-bold text-lg">50k+</div>
                <div className="text-green-200">Matchs</div>
              </div>
              <div>
                <div className="font-bold text-lg">98%</div>
                <div className="text-green-200">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;