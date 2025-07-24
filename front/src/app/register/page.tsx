// front/src/app/register/page.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const RegisterPage = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      router.push('/mon-espace');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
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
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/10 text-4xl animate-bounce"
            style={{
              left: `${5 + i * 10}%`,
              top: `${15 + (i % 4) * 25}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          >
            {['⚽', '🏆', '⭐'][i % 3]}
          </div>
        ))}
        
        {/* Multiple gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-3/4 left-1/3 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '6s'}}></div>
        
        {/* Stadium lights */}
        <div className="absolute top-0 left-1/6 w-1 h-full bg-gradient-to-b from-yellow-300/20 to-transparent"></div>
        <div className="absolute top-0 right-1/6 w-1 h-full bg-gradient-to-b from-yellow-300/20 to-transparent"></div>
        <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-white/10 to-transparent"></div>
        
        {/* Sparkle effects */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-white/40 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${1.5 + Math.random()}s`,
            }}
          />
        ))}
        
        {/* Shooting stars */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-ping"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: '0.8s',
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Enhanced Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <span className="text-green-600 font-bold text-2xl group-hover:animate-spin">⚽</span>
              </div>
              {/* Multiple glow effects */}
              <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity blur"></div>
              <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
              {/* Pulse rings */}
              <div className="absolute -inset-1 border-2 border-white/30 rounded-2xl opacity-0 group-hover:opacity-100 animate-ping"></div>
              <div className="absolute -inset-2 border border-white/20 rounded-2xl opacity-0 group-hover:opacity-50 animate-ping" style={{animationDelay: '0.5s'}}></div>
            </div>
            <div>
              <span className="text-3xl font-black text-white group-hover:text-yellow-300 transition-colors duration-300">MatchFlow</span>
              <div className="text-green-200 text-sm group-hover:text-yellow-200 transition-colors duration-300">Coach Edition</div>
            </div>
          </Link>
        </div>

        {/* Enhanced Register Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 relative overflow-hidden group">
          {/* Card glow effects */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity blur"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>
          
          {/* Floating particles inside card */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-bounce opacity-20"
                style={{
                  left: `${15 + i * 12}%`,
                  top: `${10 + (i % 3) * 30}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${4 + (i % 3)}s`,
                }}
              />
            ))}
          </div>
          
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Rejoignez MatchFlow ! 🚀
            </h1>
            <p className="text-gray-600">
              Créez votre compte MatchFlow en 2 minutes
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="John"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email professionnel
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Minimum 6 caractères"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Confirmez votre mot de passe"
              />
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                J'accepte les{' '}
                <Link href="/terms" className="text-green-600 hover:text-green-700 font-medium underline">
                  conditions d'utilisation
                </Link>{' '}
                et la{' '}
                <Link href="/privacy" className="text-green-600 hover:text-green-700 font-medium underline">
                  politique de confidentialité
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Création du compte...</span>
                </div>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Déjà un compte ?{' '}
              <Link
                href="/login"
                className="text-green-600 font-semibold hover:text-green-700 transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 flex items-center justify-center space-x-6 text-green-600 bg-green-50 rounded-xl py-3">
            <div className="flex items-center space-x-1">
              <span>🆓</span>
              <span className="text-xs font-medium">14j gratuits</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>🛡️</span>
              <span className="text-xs font-medium">Sécurisé</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>💯</span>
              <span className="text-xs font-medium">Satisfait/remboursé</span>
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

        {/* Simple testimonial */}
        <div className="mt-6 text-center">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white">
            <div className="flex items-center justify-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-sm">⭐</span>
              ))}
            </div>
            <p className="text-sm italic mb-2">
              "Interface parfaite, résultats immédiats !"
            </p>
            <div className="text-green-200 text-xs">
              - Thomas M., Coach FC Lyon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;