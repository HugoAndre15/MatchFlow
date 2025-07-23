"use client";
import React, { useState } from "react";

const AuthSection = () => {
  const [activeTab, setActiveTab] = useState<'benefits' | 'demo'>('benefits');

  const benefits = [
    {
      icon: "🎯",
      title: "Setup en 2 minutes",
      description: "Créez votre équipe et commencez à gérer vos matchs instantanément"
    },
    {
      icon: "💡",
      title: "Interface intuitive",
      description: "Conçue par des coachs, pour des coachs. Aucune formation nécessaire"
    },
    {
      icon: "📈",
      title: "Résultats immédiats",
      description: "Gagnez 2h par match et améliorez vos performances de 25%"
    },
    {
      icon: "🛡️",
      title: "Données sécurisées",
      description: "Vos données sont chiffrées et sauvegardées automatiquement"
    }
  ];

  return (
    <section id="auth-section" className="py-32 bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-white/20 rounded-full"></div>
      </div>

      <div className="container mx-auto px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
          
          {/* Left Side - Content */}
          <div className="text-white">
            <div className="inline-flex items-center bg-green-600/20 text-green-400 rounded-full px-6 py-3 mb-10">
              <span className="text-sm font-semibold">🚀 REJOIGNEZ L'ÉLITE</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              Votre équipe mérite
              <br />
              <span className="text-green-400">le meilleur outil</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Rejoignez +500 équipes qui ont déjà révolutionné leur gestion de matchs 
              avec MatchFlow. <strong className="text-white">Résultats garantis en 14 jours.</strong>
            </p>

            {/* Tabs */}
            <div className="flex space-x-6 mb-10">
              <button
                onClick={() => setActiveTab('benefits')}
                className={`px-8 py-4 rounded-full font-semibold transition-all ${
                  activeTab === 'benefits'
                    ? 'bg-green-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Pourquoi MatchFlow ?
              </button>
              <button
                onClick={() => setActiveTab('demo')}
                className={`px-8 py-4 rounded-full font-semibold transition-all ${
                  activeTab === 'demo'
                    ? 'bg-green-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Voir en action
              </button>
            </div>

            {/* Content dynamique */}
            {activeTab === 'benefits' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-scale">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="text-2xl">{benefit.icon}</div>
                    <div>
                      <h4 className="font-bold text-white mb-2">{benefit.title}</h4>
                      <p className="text-gray-400 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'demo' && (
              <div className="animate-fade-scale">
                <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">▶</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Démo interactive</h4>
                      <p className="text-gray-400 text-sm">Découvrez MatchFlow en 3 minutes</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                  >
                    🎬 Demander une démo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Auth Card */}
          <div className="lg:pl-8">
            <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-lg mx-auto">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Commencez gratuitement
                </h3>
                <p className="text-gray-600">
                  Essai gratuit 14 jours • Aucune carte bancaire requise
                </p>
              </div>

              {/* Social Login */}
              <div className="space-y-4 mb-8">
                <button className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-700 transition-colors">
                  <span>📧</span>
                  <span>Continuer avec Google</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-3 bg-gray-900 text-white font-semibold py-4 rounded-xl hover:bg-gray-800 transition-colors">
                  <span>📱</span>
                  <span>Continuer avec Apple</span>
                </button>
              </div>

              <div className="flex items-center my-8">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-4 text-gray-500 text-sm">ou</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Form */}
              <form className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Nom de votre équipe"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Mot de passe (min. 8 caractères)"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105"
                >
                  🚀 Nous contacter
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                  Vous avez déjà un compte ?{" "}
                  <a href="/login" className="text-green-600 font-semibold hover:text-green-700">
                    Connectez-vous
                  </a>
                </p>
              </div>

              {/* Garantie */}
              <div className="mt-8 flex items-center justify-center space-x-2 text-green-600 bg-green-50 rounded-lg py-4">
                <span>✅</span>
                <span className="text-sm font-medium">Garantie 30 jours satisfait ou remboursé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthSection;
