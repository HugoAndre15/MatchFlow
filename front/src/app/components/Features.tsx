"use client";
import React, { useState } from "react";

const features = [
  {
    icon: "⚡",
    title: "Feuilles de match intelligentes",
    description: "Créez vos compositions en 30 secondes. Glissez-déposez vos joueurs, définissez la tactique et exportez en PDF professionnel.",
    highlight: "30 sec chrono",
    color: "from-blue-500 to-cyan-500",
    demo: "Drag & Drop révolutionnaire",
    benefits: ["Gain de temps 95%", "Export PDF pro", "Tactiques visuelles"]
  },
  {
    icon: "🔥",
    title: "Suivi match en temps réel",
    description: "Enregistrez buts, passes, cartons pendant le match. Vos stats se mettent à jour en live sur tous les écrans.",
    highlight: "100% Live",
    color: "from-red-500 to-orange-500",
    demo: "Dashboard temps réel",
    benefits: ["Sync instantanée", "Multi-appareils", "Stats automatiques"]
  },
  {
    icon: "📊",
    title: "Analytics de champion",
    description: "Analysez chaque joueur comme Guardiola. Heat maps, passes réussies, distance parcourue - tout y est.",
    highlight: "50+ métriques",
    color: "from-purple-500 to-pink-500",
    demo: "Intelligence artificielle",
    benefits: ["Heat maps", "Analyses prédictives", "Rapports detaillés"]
  },
  {
    icon: "📱",
    title: "Mobile-first coaching",
    description: "Conçu sur le terrain, pour le terrain. Interface tactile optimisée, mode hors-ligne et sync cloud automatique.",
    highlight: "Hors-ligne OK",
    color: "from-green-500 to-emerald-500",
    demo: "App native iOS/Android",
    benefits: ["Mode offline", "Sync cloud", "Interface tactile"]
  },
  {
    icon: "🏆",
    title: "Gestion d'équipe pro",
    description: "Base de données complète, historiques, licences, communications. Comme les grands clubs européens.",
    highlight: "All-in-one",
    color: "from-yellow-500 to-orange-500",
    demo: "Base de données complète",
    benefits: ["Historiques complets", "Gestion licences", "Communication"]
  },
  {
    icon: "🎯",
    title: "Championnats & Tournois",
    description: "Suivez vos compétitions, classements auto, calendrier smart. Votre club organisé comme jamais.",
    highlight: "Auto-magic",
    color: "from-indigo-500 to-purple-500",
    demo: "Classements automatiques",
    benefits: ["Calendrier smart", "Classements auto", "Multi-compétitions"]
  }
];

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section id="features" className="py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decoratif */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-8 lg:px-12 relative z-10">
        {/* Header section */}
        <div className="text-center mb-24 max-w-5xl mx-auto">
          <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full px-8 py-4 mb-8 shadow-lg">
            <span className="text-2xl mr-3 animate-bounce">⚡</span>
            <span className="text-lg font-bold">TECHNOLOGIE DE POINTE</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
            <span className="block">Coaching</span>
            <span className="block bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              NEXT LEVEL
            </span>
          </h2>
          
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
            Découvrez les outils que <strong className="text-green-600">Klopp, Guardiola</strong> et les meilleurs 
            coachs européens utilisent pour <strong className="text-blue-600">dominer le terrain</strong>.
          </p>
        </div>

        {/* Features Grid avec interaction */}
        <div className="grid lg:grid-cols-3 gap-10 mb-20 max-w-8xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-transparent hover:border-gray-200 ${
                hoveredCard === index ? 'transform scale-105' : ''
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setActiveFeature(index)}
            >
              {/* Gradient background au hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
              
              {/* Badge highlight animé */}
              <div className="absolute -top-4 -right-4">
                <div className={`bg-gradient-to-r ${feature.color} text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300`}>
                  {feature.highlight}
                </div>
              </div>

              {/* Icon avec effet 3D */}
              <div className="relative mb-8">
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                  {feature.icon}
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
              </div>

              {/* Contenu */}
              <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                {feature.description}
              </p>

              {/* Demo tag */}
              <div className="bg-gray-100 text-gray-700 text-sm font-semibold px-4 py-2 rounded-full inline-block mb-6">
                🎬 {feature.demo}
              </div>

              {/* Benefits list */}
              <div className="space-y-2 mb-6">
                {feature.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    {benefit}
                  </div>
                ))}
              </div>

              {/* CTA button */}
              <button className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold py-4 rounded-xl hover:from-black hover:to-gray-800 transition-all duration-300 transform group-hover:scale-105">
                <span className="mr-2">🚀</span>
                Tester maintenant
              </button>
            </div>
          ))}
        </div>

        {/* Section de démonstration interactive */}
        <div className="bg-gradient-to-r from-green-900 via-blue-900 to-purple-900 rounded-3xl p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0">
            {/* Balles animées */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute text-white/10 text-4xl animate-bounce"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + (i % 3) * 30}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${3 + (i % 2)}s`,
                }}
              >
                ⚽
              </div>
            ))}
          </div>

          <div className="relative z-10">
            <h3 className="text-4xl font-black mb-6">
              Prêt à rejoindre l'élite du coaching ?
            </h3>
            <p className="text-2xl text-green-100 mb-10 max-w-3xl mx-auto">
              Plus de <strong className="text-yellow-400">10,000 coachs</strong> utilisent déjà MatchFlow. 
              Certaines équipes ont amélioré leurs résultats de <strong className="text-green-300">+40%</strong> en 3 mois.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-gray-900 font-black py-4 px-8 rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl text-lg"
              >
                <span className="mr-2">🎯</span>
                DÉMO PERSONNALISÉE
              </button>
              
              <button 
                onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105 text-lg"
              >
                <span className="mr-2">⚡</span>
                ESSAI GRATUIT 14J
              </button>
            </div>

            {/* Testimonials rapides */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { name: "Thomas M.", role: "Coach U19", quote: "Révolutionnaire !", club: "FC Lyon" },
                { name: "Sarah L.", role: "Entraîneuse", quote: "+30% de victoires", club: "AS Monaco Fém" },
                { name: "Michel R.", role: "Coach Pro", quote: "Indispensable", club: "OGC Nice" }
              ].map((testimonial, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-yellow-400 text-xl mb-2">"⭐⭐⭐⭐⭐"</div>
                  <p className="font-semibold text-lg mb-3">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      👨‍💼
                    </div>
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-sm text-green-200">{testimonial.role} • {testimonial.club}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;