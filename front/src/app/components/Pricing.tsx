import React from "react";

const Pricing = () => {
  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      description: "Pour découvrir",
      features: [
        "1 équipe",
        "10 joueurs max",
        "Feuilles de match de base",
        "Support par email"
      ],
      cta: "Commencer"
    },
    {
      name: "Pro",
      price: "9,99€",
      description: "Pour les équipes sérieuses",
      features: [
        "Équipes illimitées",
        "Joueurs illimités",
        "Statistiques avancées",
        "Export PDF",
        "Support prioritaire"
      ],
      popular: true,
      cta: "Essayer 14 jours"
    },
    {
      name: "Club",
      price: "19,99€",
      description: "Pour les clubs",
      features: [
        "Tout du plan Pro",
        "Multi-équipes",
        "Gestion des championnats",
        "Support téléphonique"
      ],
      cta: "Nous contacter"
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tarifs simples
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos besoins
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow ${
                plan.popular ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="text-center mb-4">
                  <span className="bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    Plus populaire
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {plan.description}
                </p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.price !== "0€" && (
                    <span className="text-gray-500">/mois</span>
                  )}
                </div>

                <button
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>

              <div className="space-y-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center">
                    <span className="text-green-600 mr-3">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
