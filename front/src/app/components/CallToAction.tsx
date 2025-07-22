"use client";
import React from "react";

const CallToAction = () => {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-8 lg:px-12">
        
        {/* Final CTA */}
        <div className="relative bg-gradient-to-r from-green-600 via-green-700 to-green-800 rounded-3xl overflow-hidden max-w-6xl mx-auto">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
            <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-1/4 left-1/3 w-24 h-24 border border-white/20 rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-white/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="relative z-10 text-center py-20 px-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
              Votre prochain match commence
              <br />
              <span className="text-yellow-400">MAINTENANT</span>
            </h2>
            
            <p className="text-xl text-green-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Rejoignez l'élite des équipes qui utilisent MatchFlow. 
              <strong className="text-white"> Essai gratuit 14 jours, </strong>
              puis seulement 9,99€/mois.
            </p>

            {/* Urgence */}
            <div className="inline-flex items-center bg-yellow-400 text-yellow-900 rounded-full px-8 py-4 mb-12 font-bold">
              <span className="animate-pulse mr-3">🔥</span>
              <span>Offre limitée : -50% les 3 premiers mois</span>
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <button className="bg-white text-green-700 font-bold py-5 px-12 rounded-full text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
                🚀 Commencer maintenant
              </button>
              <button className="border-2 border-white text-white font-bold py-5 px-12 rounded-full text-lg hover:bg-white hover:text-green-700 transition-all">
                📞 Parler à un expert
              </button>
            </div>

            {/* Garanties */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-12 text-green-100">
              <div className="flex items-center space-x-3">
                <span>✅</span>
                <span className="text-sm">Essai gratuit 14 jours</span>
              </div>
              <div className="flex items-center space-x-3">
                <span>✅</span>
                <span className="text-sm">Aucune carte bancaire</span>
              </div>
              <div className="flex items-center space-x-3">
                <span>✅</span>
                <span className="text-sm">Annulation en 1 clic</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer simple */}
        <div className="mt-20 text-center text-gray-500">
          <p>&copy; 2025 MatchFlow. Fait avec ❤️ pour les passionnés de football.</p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
