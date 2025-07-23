"use client";
import React from "react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-football-gradient football-field">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-bounce-custom"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white/10 rounded-full animate-bounce-custom" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white/15 rounded-full animate-bounce-custom" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-8 lg:px-12 text-center relative z-10">
        <div className="animate-slide-up max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-12">
            <span className="text-sm font-medium text-white/90">
              🏆 #1 App de gestion de matchs de football
            </span>
          </div>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            <span className="block">Gérez vos</span>
            <span className="block text-yellow-400">MATCHS</span>
            <span className="block">comme un PRO</span>
          </h1>

          {/* Sous-titre */}
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-16 leading-relaxed px-4">
            Créez vos feuilles de match, suivez les statistiques en temps réel et 
            gérez votre équipe depuis votre mobile. <strong>Tout-en-un, ultra-simple.</strong>
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary text-lg px-12 py-4 animate-fade-scale"
            >
              🚀 Nous contacter
            </button>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary text-lg px-12 py-4 animate-fade-scale" style={{animationDelay: '0.2s'}}
            >
              📱 Découvrir les fonctionnalités
            </button>
          </div>

          {/* Stats impressionnantes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
            <div className="animate-fade-scale" style={{animationDelay: '0.4s'}}>
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-3">10K+</div>
              <div className="text-white/80 text-sm md:text-base">Matchs gérés</div>
            </div>
            <div className="animate-fade-scale" style={{animationDelay: '0.6s'}}>
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-3">500+</div>
              <div className="text-white/80 text-sm md:text-base">Équipes actives</div>
            </div>
            <div className="animate-fade-scale" style={{animationDelay: '0.8s'}}>
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-3">98%</div>
              <div className="text-white/80 text-sm md:text-base">Satisfaction</div>
            </div>
            <div className="animate-fade-scale" style={{animationDelay: '1s'}}>
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-3">24/7</div>
              <div className="text-white/80 text-sm md:text-base">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Forme décorative */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-auto">
          <path d="M0,120 C400,60 800,180 1200,120 L1200,120 L0,120 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
