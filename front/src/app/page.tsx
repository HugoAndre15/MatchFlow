export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden bg-stadium-gradient">
        <div aria-hidden="true" className="absolute inset-0 football-field opacity-30" />
        <div className="relative container mx-auto px-6 py-16 sm:py-20 lg:py-24">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                Plateforme football
              </span>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                MatchFlow, la gestion fluide des clubs et des matchs.
              </h1>
              <p className="mt-6 text-lg text-slate-200">
                Centralisez clubs, équipes, joueurs et matchs dans un espace pensé pour les staffs.
                MatchFlow orchestre les convocations, le suivi live et les événements clés pour
                garder votre saison sous contrôle.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a href="#features" className="btn-primary inline-flex justify-center text-center">
                  Découvrir MatchFlow
                </a>
                <a href="#workflow" className="btn-secondary inline-flex justify-center text-center">
                  Voir le workflow
                </a>
              </div>
              <div className="mt-10 grid gap-4 text-sm text-slate-200 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">Rôles sécurisés</p>
                  <p className="mt-1 text-slate-300">Président, responsable, coach, assistant.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">Planning match</p>
                  <p className="mt-1 text-slate-300">Statuts UPCOMING, LIVE, FINISHED.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">Suivi terrain</p>
                  <p className="mt-1 text-slate-300">Buts, assists, cartons, zones.</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:w-[45%]">
              <div className="card-modern text-slate-900 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  Club & équipes
                </p>
                <h2 className="mt-3 text-2xl font-semibold">
                  Un tableau de bord pour structurer votre club.
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Créez vos clubs, rattachez les équipes par catégorie et pilotez les membres du staff
                  en un clin d&apos;œil.
                </p>
              </div>
              <div className="card-modern text-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Convocations
                </p>
                <p className="mt-3 text-lg font-semibold">Titulaire ou remplaçant</p>
                <p className="mt-2 text-sm text-slate-600">
                  Préparez les feuilles de match en quelques secondes.
                </p>
              </div>
              <div className="card-modern text-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">
                  Live match
                </p>
                <p className="mt-3 text-lg font-semibold">Événements détaillés</p>
                <p className="mt-2 text-sm text-slate-600">
                  Enregistrez buts, assists, récupérations et cartons.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-slate-50 py-16 text-slate-900 sm:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Tout ce qu&apos;il faut pour piloter votre saison.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              MatchFlow accompagne chaque étape : création de clubs, gestion des équipes et des
              joueurs, préparation des matchs et suivi des performances en temps réel.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="card-modern">
              <h3 className="text-xl font-semibold">Gestion des clubs</h3>
              <p className="mt-3 text-sm text-slate-600">
                Créez vos clubs, invitez les membres et définissez les rôles PRESIDENT,
                RESPONSABLE ou COACH.
              </p>
            </div>
            <div className="card-modern">
              <h3 className="text-xl font-semibold">Équipes & staffs</h3>
              <p className="mt-3 text-sm text-slate-600">
                Classez vos équipes par catégorie, assignez coachs et assistants, et gardez la
                visibilité sur chaque groupe.
              </p>
            </div>
            <div className="card-modern">
              <h3 className="text-xl font-semibold">Effectif complet</h3>
              <p className="mt-3 text-sm text-slate-600">
                Suivez les joueurs, leurs positions, numéros, statuts (blessé, suspendu, actif) et
                l&apos;évolution de l&apos;effectif.
              </p>
            </div>
            <div className="card-modern">
              <h3 className="text-xl font-semibold">Matchs & événements</h3>
              <p className="mt-3 text-sm text-slate-600">
                Planifiez les rencontres, gérez les convocations et consignez buts, assists, cartons et
                zones de jeu.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-white py-16 text-slate-900 sm:py-20">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold sm:text-4xl">
                Un workflow clair, du club au coup d&apos;envoi.
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                MatchFlow structure vos opérations : préparez vos matchs, convoquez vos joueurs et
                suivez l&apos;événement en direct sans perdre de temps.
              </p>
              <ol className="mt-8 space-y-6">
                {[
                  {
                    title: "Créer le club",
                    description: "Enregistrez votre club, ajoutez les membres et attribuez les rôles.",
                  },
                  {
                    title: "Structurer les équipes",
                    description: "Ajoutez les équipes, les staffs et les joueurs avec leurs informations clés.",
                  },
                  {
                    title: "Planifier & convoquer",
                    description:
                      "Créez vos matchs, choisissez les titulaires et remplaçants, puis passez en mode LIVE.",
                  },
                  {
                    title: "Tracer les événements",
                    description:
                      "Notez les actions de jeu, les zones et le corps utilisé pour analyser vos performances.",
                  },
                ].map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg font-semibold text-emerald-700">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{step.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Focus match
              </p>
              <h3 className="mt-4 text-2xl font-semibold">
                Suivi live, précis et connecté au terrain.
              </h3>
              <p className="mt-4 text-sm text-slate-300">
                Passez d&apos;un statut UPCOMING à LIVE puis FINISHED, et gardez l&apos;historique complet
                des événements, des joueurs convoqués et des actions clés.
              </p>
              <div className="mt-6 space-y-4 text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">Convocation détaillée</p>
                  <p className="mt-1 text-slate-300">
                    Titulaires, remplaçants, statut joueur et disponibilité en un clic.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="font-semibold text-white">Timeline événementielle</p>
                  <p className="mt-1 text-slate-300">
                    Buteurs, assists, cartons et récupérations chronologiques.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-football-gradient py-16 text-white sm:py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Prêt à piloter vos matchs avec précision ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            MatchFlow réunit l&apos;organisation du club, la gestion d&apos;équipe et le suivi match dans
            une interface moderne, conçue pour aller à l&apos;essentiel.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a href="#features" className="btn-secondary inline-flex justify-center text-center">
              Explorer les fonctionnalités
            </a>
            <a href="#workflow" className="btn-primary inline-flex justify-center text-center">
              Découvrir le parcours
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-8 text-center text-sm text-slate-500">
        MatchFlow • Gestion de clubs, équipes et matchs de football
      </footer>
    </main>
  );
}
