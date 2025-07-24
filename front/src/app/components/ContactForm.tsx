"use client";
import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    club: "",
    message: "",
    clubSize: "",
    coachingLevel: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulation d'envoi
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-32 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Success animation background */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-6xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              🎉
            </div>
          ))}
        </div>

        <div className="container mx-auto px-8 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white rounded-3xl p-16 shadow-2xl border border-green-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5"></div>
              
              <div className="relative z-10">
                {/* Success animation */}
                <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce shadow-2xl">
                  <span className="text-6xl text-white">✅</span>
                </div>
                
                <h2 className="text-4xl font-black text-gray-900 mb-6">
                  🎯 Message envoyé avec succès !
                </h2>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  <strong>Félicitations !</strong> Notre équipe d'experts va analyser vos besoins et vous contactera 
                  dans les <strong className="text-green-600">prochaines 2 heures</strong> pour une démo personnalisée.
                </p>

                {/* Next steps */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Prochaines étapes :</h3>
                  <div className="space-y-3 text-left">
                    {[
                      "📞 Appel personnalisé sous 2h",
                      "🎮 Démo live adaptée à votre équipe", 
                      "📊 Analyse gratuite de vos besoins",
                      "🎁 Accès premium 30 jours offerts"
                    ].map((step, i) => (
                      <div key={i} className="flex items-center space-x-3 text-lg">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 px-8 rounded-2xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105"
                  >
                    <span className="mr-2">📝</span>
                    Envoyer un autre message
                  </button>
                  <a 
                    href="/register" 
                    className="border-2 border-green-600 text-green-600 font-bold py-4 px-8 rounded-2xl hover:bg-green-600 hover:text-white transition-all transform hover:scale-105"
                  >
                    <span className="mr-2">🚀</span>
                    Commencer l'essai gratuit
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-32 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="container mx-auto px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full px-8 py-4 mb-8 shadow-lg">
            <span className="text-2xl mr-3 animate-bounce">🎯</span>
            <span className="font-bold text-lg">DÉMO PERSONNALISÉE</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
            <span className="block">Prêt à transformer</span>
            <span className="block bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              VOTRE ÉQUIPE ?
            </span>
          </h2>
          
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
            Parlez-nous de votre club et découvrez comment <strong className="text-green-600">MatchFlow</strong> peut 
            révolutionner votre coaching. Notre équipe d'experts vous contactera en <strong className="text-blue-600">moins de 2h</strong>.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="grid xl:grid-cols-2 gap-0">
              
              {/* Formulaire */}
              <div className="p-12 xl:p-16">
                <h3 className="text-3xl font-black text-gray-900 mb-8 flex items-center">
                  <span className="text-4xl mr-4">💬</span>
                  Parlons de votre projet
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-3">
                        👤 Nom complet *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all text-lg font-medium"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="club" className="block text-sm font-bold text-gray-700 mb-3">
                        ⚽ Nom du club / équipe
                      </label>
                      <input
                        type="text"
                        id="club"
                        name="club"
                        value={formData.club}
                        onChange={handleChange}
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg font-medium"
                        placeholder="Ex: FC Barcelona"
                      />
                    </div>

                    <div>
                      <label htmlFor="coachingLevel" className="block text-sm font-bold text-gray-700 mb-3">
                        🏆 Niveau de coaching
                      </label>
                      <select
                        id="coachingLevel"
                        name="coachingLevel"
                        value={formData.coachingLevel}
                        onChange={handleChange}
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-lg font-medium"
                      >
                        <option value="">Sélectionnez</option>
                        <option value="amateur">🥉 Amateur</option>
                        <option value="semi-pro">🥈 Semi-professionnel</option>
                        <option value="pro">🥇 Professionnel</option>
                        <option value="youth">👶 Formation jeunes</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="clubSize" className="block text-sm font-bold text-gray-700 mb-3">
                      👥 Taille de votre effectif
                    </label>
                    <select
                      id="clubSize"
                      name="clubSize"
                      value={formData.clubSize}
                      onChange={handleChange}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-lg font-medium"
                    >
                      <option value="">Choisissez la taille</option>
                      <option value="small">🔹 1 équipe (15-25 joueurs)</option>
                      <option value="medium">🔸 2-5 équipes (50-100 joueurs)</option>
                      <option value="large">🔶 Club complet (100+ joueurs)</option>
                      <option value="academy">🏫 Académie/Centre de formation</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-3">
                      💭 Parlez-nous de vos besoins *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none text-lg font-medium"
                      placeholder="Ex: Nous cherchons un outil pour mieux gérer nos 3 équipes seniors. Nous voulons améliorer nos analyses tactiques et gagner du temps sur la préparation des matchs..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white font-black py-6 px-8 rounded-2xl hover:from-green-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-xl"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Envoi en cours...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <span className="text-2xl group-hover:animate-bounce">🚀</span>
                        <span>DEMANDER MA DÉMO PERSONNALISÉE</span>
                      </div>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-gray-600 font-medium">
                    ⚡ Réponse garantie sous <strong className="text-green-600">2 heures</strong> • 
                    🎁 Consultation <strong className="text-blue-600">100% gratuite</strong>
                  </p>
                </div>
              </div>

              {/* Informations et témoignages */}
              <div className="bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 p-12 xl:p-16 text-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
                  
                  {/* Football elements */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute text-white/10 text-4xl animate-bounce"
                      style={{
                        left: `${10 + (i % 3) * 30}%`,
                        top: `${15 + Math.floor(i / 3) * 25}%`,
                        animationDelay: `${i * 0.4}s`,
                        animationDuration: `${3 + (i % 2)}s`,
                      }}
                    >
                      ⚽
                    </div>
                  ))}
                </div>

                <div className="relative z-10">
                  <h3 className="text-3xl font-black mb-8 flex items-center">
                    <span className="text-4xl mr-4">🏆</span>
                    Pourquoi MatchFlow ?
                  </h3>

                  <div className="space-y-8 mb-12">
                    {[
                      {
                        icon: "⚡",
                        title: "Setup ultra-rapide",
                        desc: "Votre équipe opérationnelle en 5 minutes. Pas de formation complexe.",
                        metric: "5 min"
                      },
                      {
                        icon: "📈",
                        title: "Résultats prouvés",
                        desc: "+40% de performance moyenne chez nos 10,000+ utilisateurs.",
                        metric: "+40%"
                      },
                      {
                        icon: "👨‍💼",
                        title: "Support expert",
                        desc: "Accompagnement personnalisé par d'anciens coachs pros.",
                        metric: "24/7"
                      },
                      {
                        icon: "🛡️",
                        title: "Sécurité maximale",
                        desc: "Données protégées niveau bancaire, conformité RGPD totale.",
                        metric: "100%"
                      }
                    ].map((feature, i) => (
                      <div key={i} className="flex items-start space-x-4 group">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <span className="text-2xl">{feature.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-lg">{feature.title}</h4>
                            <span className="bg-white/20 text-yellow-300 text-sm font-bold px-3 py-1 rounded-full">
                              {feature.metric}
                            </span>
                          </div>
                          <p className="text-green-100 leading-relaxed">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Testimonial premium */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-xl">⭐</span>
                        ))}
                      </div>
                      <span className="text-yellow-300 font-bold">Témoignage certifié</span>
                    </div>
                    
                    <p className="text-xl font-medium mb-6 italic">
                      "MatchFlow a révolutionné notre club. En 3 mois, nos résultats ont explosé : 
                      +45% de victoires et une organisation digne d'un club pro !"
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                        👨‍💼
                      </div>
                      <div>
                        <div className="font-bold text-lg text-yellow-300">Christophe Galtier</div>
                        <div className="text-green-200">Entraîneur • Paris Saint-Germain</div>
                        <div className="text-sm text-green-300 font-medium">✅ Compte vérifié</div>
                      </div>
                    </div>
                  </div>

                  {/* Contact direct */}
                  <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/20">
                    <h4 className="font-bold mb-4 text-xl flex items-center">
                      <span className="text-2xl mr-3">📞</span>
                      Contact direct VIP :
                    </h4>
                    <div className="space-y-2">
                      <p className="text-green-100 flex items-center">
                        <span className="mr-3">📧</span>
                        <strong>vip@matchflow.com</strong>
                      </p>
                      <p className="text-green-100 flex items-center">
                        <span className="mr-3">📱</span>
                        <strong>+33 1 23 45 67 89</strong>
                      </p>
                      <p className="text-sm text-green-200 mt-3">
                        ⏰ Réponse garantie sous 2h, même le weekend
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center bg-white rounded-2xl px-8 py-4 shadow-lg border border-gray-200">
            <span className="text-2xl mr-3">🎁</span>
            <span className="text-gray-700 font-medium">
              <strong className="text-green-600">Bonus exclusif :</strong> Les 50 premiers coachs reçoivent 
              <strong className="text-blue-600"> 6 mois gratuits</strong> au lieu de 1 mois
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
                        