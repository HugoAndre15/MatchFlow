export default function Home() {
  const sections = [
    {
      id: "clubs",
      title: "Clubs",
      description:
        "Structurez votre organisation : un club centralise les équipes, les membres et la gouvernance.",
      actions: [
        "Créer un club et devenir automatiquement PRESIDENT.",
        "Lister tous les clubs auxquels vous appartenez.",
        "Accéder aux détails du club (membres, équipes, rôles).",
        "Ajouter ou retirer des membres, modifier leur rôle.",
        "Transférer la présidence et mettre à jour le nom du club.",
      ],
      limits: [
        "Seuls les membres peuvent consulter le club.",
        "Le PRESIDENT est le seul à modifier ou supprimer le club.",
        "Le PRESIDENT ne peut pas quitter sans transférer la présidence.",
        "Responsable et président peuvent gérer les membres, sous conditions.",
      ],
    },
    {
      id: "users",
      title: "Utilisateurs",
      description:
        "Chaque utilisateur dispose d’un profil sécurisé et pilote ses informations personnelles.",
      actions: [
        "Créer un compte via l’inscription et se connecter.",
        "Consulter son profil via /users/me.",
        "Mettre à jour son identité et son mot de passe.",
        "Lister les utilisateurs (prévu pour admin).",
      ],
      limits: [
        "Modification et suppression limitées à son propre compte.",
        "JWT obligatoire pour accéder aux endpoints utilisateurs.",
      ],
    },
    {
      id: "teams",
      title: "Équipes",
      description:
        "Organisez les équipes par catégorie et gérez le staff technique avec précision.",
      actions: [
        "Créer une équipe dans un club avec catégorie et coach.",
        "Lister les équipes d’un club.",
        "Consulter les détails (staff, joueurs, rôles).",
        "Ajouter, retirer ou changer les rôles COACH / ASSISTANT_COACH.",
        "Mettre à jour ou supprimer l’équipe.",
      ],
      limits: [
        "Seuls les membres du club peuvent accéder aux équipes.",
        "COACH ou PRESIDENT requis pour modifier ou supprimer.",
        "ASSISTANT_COACH ne peut pas retirer un COACH.",
      ],
    },
    {
      id: "players",
      title: "Joueurs",
      description:
        "Suivez l’effectif, les positions, les numéros et l’état de forme de chaque joueur.",
      actions: [
        "Créer un joueur avec poste, pied fort et numéro.",
        "Lister les joueurs par équipe, triés par numéro.",
        "Consulter un joueur et ses rattachements équipe/club.",
        "Mettre à jour les informations ou transférer de team.",
        "Supprimer un joueur.",
      ],
      limits: [
        "Accès réservé aux COACH, ASSISTANT_COACH ou PRESIDENT.",
        "Changement d’équipe soumis aux permissions des deux équipes.",
      ],
    },
    {
      id: "matches",
      title: "Matchs & événements",
      description:
        "Planifiez les rencontres, convoquez les joueurs et tracez chaque événement du match.",
      actions: [
        "Créer un match avec équipe, adversaire, lieu et date.",
        "Changer le statut UPCOMING → LIVE → FINISHED.",
        "Convoquer les joueurs (titulaire ou remplaçant).",
        "Enregistrer les événements : buts, assists, cartons, récupérations.",
        "Gérer les zones, le corps utilisé et la minute (0-120).",
      ],
      limits: [
        "Création/modification réservées aux COACH, ASSISTANT_COACH ou PRESIDENT.",
        "Changement de statut limité au COACH ou PRESIDENT.",
        "Un joueur convoqué ne peut être retiré s’il a des événements.",
        "Deuxième jaune déclenche automatiquement un rouge.",
      ],
    },
  ];

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
                <a href="#clubs" className="btn-primary inline-flex justify-center text-center">
                  Explorer les modules
                </a>
                <a href="#matches" className="btn-secondary inline-flex justify-center text-center">
                  Focus matchs
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-slate-300">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:border-white/30 hover:text-white"
                  >
                    {section.title}
                  </a>
                ))}
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

      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={index % 2 === 0 ? "bg-white text-slate-900" : "bg-slate-50 text-slate-900"}
        >
          <div className="container mx-auto px-6 py-16 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
                  Module {index + 1}
                </p>
                <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">{section.title}</h2>
                <p className="mt-4 text-lg text-slate-600">{section.description}</p>
              </div>
              <div className="grid gap-6">
                <div className="card-modern">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Actions possibles
                  </p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    {section.actions.map((action) => (
                      <li key={action} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-modern border border-slate-200">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Limites & permissions
                  </p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    {section.limits.map((limit) => (
                      <li key={limit} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
                        <span>{limit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="bg-football-gradient py-16 text-white sm:py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Une application complète, section par section.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            Chaque module MatchFlow est pensé pour clarifier les responsabilités, sécuriser les
            actions et offrir une visibilité totale sur vos équipes et vos matchs.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a href="#clubs" className="btn-secondary inline-flex justify-center text-center">
              Démarrer par les clubs
            </a>
            <a href="#matches" className="btn-primary inline-flex justify-center text-center">
              Voir le suivi match
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
