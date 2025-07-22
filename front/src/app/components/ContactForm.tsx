"use client";
import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    club: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'envoi
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-32 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl p-12 shadow-xl border border-green-100">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✅</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Message envoyé avec succès !
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Merci pour votre intérêt ! Notre équipe vous contactera dans les plus brefs délais pour discuter de vos besoins.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-all"
              >
                Envoyer un autre message
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-32 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-100 text-green-800 rounded-full px-6 py-2 mb-6">
            <span className="mr-2">⚽</span>
            <span className="font-semibold">Contactez-nous</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Prêt à transformer
            <br />
            <span className="text-green-600">votre équipe ?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Parlez-nous de votre club et découvrez comment MatchFlow peut révolutionner 
            la gestion de votre équipe. Notre équipe d'experts vous contactera rapidement.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Formulaire */}
              <div className="p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">
                  Parlons de votre projet
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email professionnel *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="club" className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom du club / équipe
                    </label>
                    <input
                      type="text"
                      id="club"
                      name="club"
                      value={formData.club}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Ex: FC Barcelona"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Votre message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                      placeholder="Décrivez vos besoins, le nombre de joueurs, vos objectifs..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 px-8 rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-[1.02] shadow-lg"
                  >
                    🚀 Envoyer le message
                  </button>
                </form>

                <p className="text-sm text-gray-500 mt-6 text-center">
                  Réponse garantie sous 24h • Consultation gratuite
                </p>
              </div>

              {/* Informations */}
              <div className="bg-gradient-to-br from-green-600 to-green-800 p-12 text-white">
                <h3 className="text-2xl font-bold mb-8">
                  Pourquoi choisir MatchFlow ?
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span>🏆</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Performance garantie</h4>
                      <p className="text-green-100 text-sm">
                        +40% d'amélioration des performances d'équipe en moyenne
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span>⚡</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Mise en place rapide</h4>
                      <p className="text-green-100 text-sm">
                        Votre équipe opérationnelle en moins de 48h
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span>👥</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Support expert</h4>
                      <p className="text-green-100 text-sm">
                        Accompagnement personnalisé par nos spécialistes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span>🔒</span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Sécurité maximale</h4>
                      <p className="text-green-100 text-sm">
                        Vos données protégées selon les standards RGPD
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-6 bg-white/10 rounded-xl">
                  <h4 className="font-bold mb-2">Contact direct :</h4>
                  <p className="text-green-100 text-sm mb-1">📧 contact@matchflow.com</p>
                  <p className="text-green-100 text-sm">📞 +33 1 23 45 67 89</p>
                </div>
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

export default ContactForm;
