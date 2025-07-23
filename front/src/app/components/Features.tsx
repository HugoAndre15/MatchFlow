"use client";
import React from "react";

const features = [
  {
    icon: "📋",
    title: "Feuilles de match intelligentes",
    description: "Créez vos compositions en quelques clics. Glissez-déposez vos joueurs, définissez les remplaçants et exportez tout en PDF.",
    highlight: "Gain de temps : 90%",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: "⚡",
    title: "Suivi en temps réel",
    description: "Enregistrez buts, passes, cartons et changements pendant le match. Vos stats se mettent à jour instantanément.",
    highlight: "Temps réel",
    color: "from-green-500 to-green-600"
  },
  {
    icon: "📊",
    title: "Analytics avancées",
    description: "Analysez les performances de chaque joueur, visualisez les tendances et identifiez vos points forts.",
    highlight: "20+ métriques",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: "📱",
    title: "Mobile-first",
    description: "Conçu pour le terrain. Interface optimisée mobile, mode hors-ligne et synchronisation automatique.",
    highlight: "100% mobile",
    color: "from-orange-500 to-orange-600"
  },
  {
    icon: "👥",
    title: "Gestion d'équipe",
    description: "Base de données joueurs, historique des performances, gestion des licences et communications d'équipe.",
    highlight: "Tout centralisé",
    color: "from-red-500 to-red-600"
  },
  {
    icon: "🏆",
    title: "Championnats & Tournois",
    description: "Suivez vos compétitions, classements automatiques, calendrier des matchs et statistiques de tournoi.",
    highlight: "Multi-compétitions",
    color: "from-yellow-500 to-yellow-600"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-32 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-green-100 text-green-800 rounded-full px-6 py-3 mb-8">
            <span className="text-sm font-semibold">⚡ FONCTIONNALITÉS PUISSANTES</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8">
            Tout ce dont vous avez besoin
            <br />
            <span className="text-gradient">en une seule app</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            MatchFlow révolutionne la gestion de vos matchs de football avec des outils 
            professionnels simples à utiliser. Découvrez pourquoi +500 équipes nous font confiance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-modern group cursor-pointer"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Icon avec gradient */}
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              {/* Badge highlight */}
              <div className="inline-flex items-center bg-gray-100 text-gray-700 rounded-full px-4 py-2 text-sm font-medium mb-6">
                {feature.highlight}
              </div>

              {/* Contenu */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {feature.description}
              </p>

              {/* Arrow indicator */}
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-green-600 font-medium text-sm">
                  En savoir plus →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-16 text-white relative overflow-hidden max-w-5xl mx-auto">
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-6">
              Prêt à transformer votre gestion d'équipe ?
            </h3>
            <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
              Rejoignez les +500 équipes qui utilisent déjà MatchFlow
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-green-600 font-bold py-4 px-8 rounded-full hover:bg-gray-100 transition-colors"
              >
                🚀 Nous contacter
              </button>
              <button 
                onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-green-600 transition-colors"
              >
                � Voir en détail
              </button>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
        </div>
      </div>
    </section>
  );
};

export default Features;
