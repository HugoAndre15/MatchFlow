"use client";
import React, { useState } from "react";

const AuthSection = () => {
  const [activeTab, setActiveTab] = useState<'benefits' | 'testimonials' | 'demo'>('benefits');

  const benefits = [
    {
      icon: "⚡",
      title: "Setup ultra-rapide",
      description: "Votre équipe opérationnelle en 2 minutes chrono",
      metric: "120 sec"
    },
    {
      icon: "🎯",
      title: "Interface intuitive",
      description: "Conçue avec 500+ coachs pros. Zéro formation nécessaire",
      metric: "0 formation"
    },
    {
      icon: "📈",
      title: "Résultats immédiats",
      description: "Nos clients gagnent 2h/match et +25% de performances",
      metric: "+25% perf"
    },
    {
      icon: "🛡️",
      title: "Sécurité maximale",
      description: "Données chiffrées niveau bancaire, backup automatique",
      metric: "100% sécurisé"
    }
  ];

  const testimonials = [
    {
      name: "Antoine Kombouaré",
      role: "Entraîneur professionnel",
      club: "FC Nantes",
      quote: "MatchFlow a révolutionné ma préparation. Je gagne 3h par semaine et mes analyses sont 10x plus précises.",
      rating: 5,
      image: "👨‍💼"
    },
    {
      name: "Sarah Bouhaddi",
      role: "Coach développement",
      club: "OL Féminin",
      quote: "L'app que j'aurais rêvé d'avoir quand j'étais joueuse. Mes jeunes progressent visiblement plus vite.",
      rating: 5,
      image: "👩‍💼"
    },
    {
      name: "Julien Stéphan",
      role: "Entraîneur Ligue 1",
      club: "RC Strasbourg",
      quote: "Interface parfaite, stats incroyables. Même mes adjoints de 50 ans l'utilisent sans problème !",
      rating: 5,
      image: "👨‍💼"
    }
  ];

  return (
    <section id="auth-section" className="py-32 bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Football pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-6xl text-white animate-bounce"
              style={{
                left: `${5 + (i % 4) * 25}%`,
                top: `${10 + Math.floor(i / 4) * 30}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${4 + (i % 3)}s`,
              }}
            >
              ⚽
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-8 lg:px-12 relative z-10">
        <div className="grid xl:grid-cols-2 gap-20 items-center max-w-8xl mx-auto">
          
          {/* Left Side - Content */}
          <div className="text-white space-y-12">
            {/* Badge premium */}
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-600/20 to-yellow-400/20 border border-yellow-400/30 text-yellow-400 rounded-full px-8 py-4 backdrop-blur-sm">
              <span className="text-2xl mr-3 animate-spin" style={{animationDuration: '3s'}}>🏆</span>
              <span className="text-lg font-bold">REJOIGNEZ L'ÉLITE DU COACHING</span>
            </div>
            
            {/* Titre accrocheur */}
            <h2 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="block">Votre équipe mérite</span>
              <span className="block bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                LE MEILLEUR OUTIL
              </span>
              <span className="block">de coaching</span>
            </h2>
            
            {/* Value proposition */}
            <p className="text-2xl text-gray-300 leading-relaxed font-medium">
              Rejoignez <strong className="text-green-400">+10,000 équipes</strong> qui ont déjà révolutionné 
              leur gestion avec MatchFlow. <strong className="text-yellow-400">Résultats garantis en 7 jours</strong> 
              ou remboursé intégralement.
            </p>

            {/* Tabs navigation */}
            <div className="flex flex-wrap gap-4">
              {[
                { id: 'benefits', label: 'Pourquoi MatchFlow ?', icon: '⚡' },
                { id: 'testimonials', label: 'Avis coachs pro', icon: '⭐' },
                { id: 'demo', label: 'Voir en action', icon: '🎮' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-2xl'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 backdrop-blur-sm border border-white/20'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Dynamic content */}
            <div className="min-h-[400px] flex items-center">
              {activeTab === 'benefits' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full animate-fadeIn">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl group-hover:animate-bounce">{benefit.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-white text-lg">{benefit.title}</h4>
                            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                              {benefit.metric}
                            </span>
                          </div>
                          <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'testimonials' && (
                <div className="space-y-6 w-full animate-fadeIn">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-start space-x-6">
                        <div className="text-4xl">{testimonial.image}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-3">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400 text-xl">⭐</span>
                            ))}
                          </div>
                          <p className="text-white text-lg font-medium mb-4 italic">
                            "{testimonial.quote}"
                          </p>
                          <div>
                            <div className="font-bold text-green-400 text-lg">{testimonial.name}</div>
                            <div className="text-gray-400">{testimonial.role} • {testimonial.club}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'demo' && (
                <div className="w-full animate-fadeIn">
                  <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm border border-blue-400/30 rounded-3xl p-10 text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                      <span className="text-white font-bold text-3xl">▶</span>
                    </div>
                    <h4 className="font-bold text-white text-2xl mb-4">
                      Démo interactive exclusive
                    </h4>
                    <p className="text-blue-200 text-lg mb-8 max-w-lg mx-auto">
                      Découvrez MatchFlow en action avec un vrai match simulé. 
                      Voyez comment les pros l'utilisent en situation réelle.
                    </p>
                    <button 
                      onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                      className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white font-bold text-xl px-12 py-4 rounded-2xl hover:from-blue-400 hover:to-pink-500 transition-all transform hover:scale-110 shadow-2xl"
                    >
                      <span className="mr-3">🎬</span>
                      VOIR LA DÉMO MAINTENANT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Premium Auth Card */}
          <div className="xl:pl-8">
            <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-lg mx-auto border border-gray-100 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <span className="text-white font-bold text-2xl">⚽</span>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-3">
                    Essai Gratuit Premium
                  </h3>
                  <p className="text-gray-600 text-lg">
                    <strong>14 jours complets</strong> • Toutes les fonctionnalités • Aucune carte requise
                  </p>
                </div>

                {/* Social proof */}
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-green-800 font-bold text-lg">+2,847 coachs</div>
                      <div className="text-green-600 text-sm">ont rejoint cette semaine</div>
                    </div>
                    <div className="flex -space-x-2">
                      {['👨‍💼', '👩‍💼', '👨‍💼', '👩‍💼', '👨‍💼'].map((emoji, i) => (
                        <div key={i} className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center border-2 border-white">
                          {emoji}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick signup options */}
                <div className="space-y-4 mb-8">
                  <button className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg">
                    <span className="text-xl">📧</span>
                    <span>Continuer avec Google</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-3 bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg">
                    <span className="text-xl">🍎</span>
                    <span>Continuer avec Apple</span>
                  </button>
                </div>

                <div className="flex items-center my-8">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="px-6 text-gray-500 font-medium">ou</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Form */}
                <form className="space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Nom de votre équipe"
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-lg font-medium"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Votre email professionnel"
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-lg font-medium"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Mot de passe sécurisé"
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-lg font-medium"
                    />
                  </div>
                  
                  <button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white font-black py-5 rounded-2xl hover:from-green-700 hover:to-green-900 transition-all transform hover:scale-105 shadow-xl text-lg"
                  >
                    <span className="mr-3">🚀</span>
                    DÉMARRER MON ESSAI GRATUIT
                  </button>
                </form>

                {/* Trust indicators */}
                <div className="mt-8 space-y-4">
                  <div className="text-center">
                    <p className="text-gray-600 text-sm">
                      Déjà un compte ?{" "}
                      <a href="/login" className="text-green-600 font-bold hover:text-green-700 transition-colors">
                        Se connecter →
                      </a>
                    </p>
                  </div>
                  
                  {/* Guarantees */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                      { icon: "✅", text: "14j gratuits" },
                      { icon: "🛡️", text: "Sécurisé" },
                      { icon: "💯", text: "Satisfait/remboursé" }
                    ].map((guarantee, i) => (
                      <div key={i} className="flex flex-col items-center space-y-1">
                        <span className="text-xl">{guarantee.icon}</span>
                        <span className="text-xs font-medium text-gray-600">{guarantee.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthSection;