const methodColors: Record<string, string> = {
  GET: "bg-blue-100 text-blue-800 border-blue-300",
  POST: "bg-green-100 text-green-800 border-green-300",
  PATCH: "bg-amber-100 text-amber-800 border-amber-300",
  DELETE: "bg-red-100 text-red-800 border-red-300",
};

const sectionColors: Record<string, string> = {
  Auth: "from-emerald-500 to-green-600",
  Users: "from-blue-500 to-indigo-600",
  Clubs: "from-purple-500 to-violet-600",
  Teams: "from-orange-500 to-amber-600",
  Players: "from-pink-500 to-rose-600",
  Matches: "from-cyan-500 to-teal-600",
};

const sectionIcons: Record<string, string> = {
  Auth: "🔐",
  Users: "👤",
  Clubs: "🏟️",
  Teams: "⚽",
  Players: "🧑‍🤝‍🧑",
  Matches: "📋",
};

interface Endpoint {
  method: string;
  route: string;
  auth: boolean;
  roles: string;
  description: string;
}

interface Section {
  name: string;
  description: string;
  endpoints: Endpoint[];
}

const apiSections: Section[] = [
  {
    name: "Auth",
    description:
      "Authentification des utilisateurs (inscription et connexion). Ces routes sont publiques.",
    endpoints: [
      {
        method: "POST",
        route: "/auth/register",
        auth: false,
        roles: "Aucun",
        description: "Inscription d'un nouvel utilisateur",
      },
      {
        method: "POST",
        route: "/auth/login",
        auth: false,
        roles: "Aucun",
        description: "Connexion et obtention du token JWT",
      },
    ],
  },
  {
    name: "Users",
    description:
      "Gestion des profils utilisateurs. Toutes les routes nécessitent un token JWT.",
    endpoints: [
      {
        method: "GET",
        route: "/users/me",
        auth: true,
        roles: "Tous",
        description: "Récupérer son propre profil",
      },
      {
        method: "PATCH",
        route: "/users/me",
        auth: true,
        roles: "Tous",
        description: "Modifier son propre profil",
      },
      {
        method: "PATCH",
        route: "/users/me/password",
        auth: true,
        roles: "Tous",
        description: "Changer son mot de passe",
      },
      {
        method: "GET",
        route: "/users",
        auth: true,
        roles: "Tous",
        description: "Lister tous les utilisateurs",
      },
      {
        method: "GET",
        route: "/users/:id",
        auth: true,
        roles: "Tous",
        description: "Récupérer un utilisateur par ID",
      },
      {
        method: "PATCH",
        route: "/users/:id",
        auth: true,
        roles: "Tous",
        description: "Modifier un utilisateur (soi-même uniquement)",
      },
      {
        method: "PATCH",
        route: "/users/:id/password",
        auth: true,
        roles: "Tous",
        description:
          "Changer le mot de passe d'un utilisateur (soi-même uniquement)",
      },
      {
        method: "DELETE",
        route: "/users/:id",
        auth: true,
        roles: "Tous",
        description: "Supprimer son compte (soi-même uniquement)",
      },
    ],
  },
  {
    name: "Clubs",
    description:
      "Gestion des clubs et de leurs membres. Rôles : PRESIDENT, RESPONSABLE, MEMBRE.",
    endpoints: [
      {
        method: "POST",
        route: "/clubs",
        auth: true,
        roles: "Tous",
        description:
          "Créer un club (le créateur devient automatiquement PRESIDENT)",
      },
      {
        method: "GET",
        route: "/clubs",
        auth: true,
        roles: "Tous",
        description: "Lister les clubs de l'utilisateur connecté",
      },
      {
        method: "GET",
        route: "/clubs/:id",
        auth: true,
        roles: "Tous",
        description: "Détails d'un club (membres uniquement)",
      },
      {
        method: "PATCH",
        route: "/clubs/:id",
        auth: true,
        roles: "PRESIDENT",
        description: "Modifier les informations du club",
      },
      {
        method: "DELETE",
        route: "/clubs/:id",
        auth: true,
        roles: "PRESIDENT",
        description: "Supprimer le club (suppression en cascade)",
      },
      {
        method: "GET",
        route: "/clubs/:id/members",
        auth: true,
        roles: "Tous",
        description: "Lister les membres du club",
      },
      {
        method: "POST",
        route: "/clubs/:id/members",
        auth: true,
        roles: "PRESIDENT, RESPONSABLE",
        description: "Ajouter un membre au club",
      },
      {
        method: "DELETE",
        route: "/clubs/:id/members/:userId",
        auth: true,
        roles: "PRESIDENT, RESPONSABLE",
        description: "Retirer un membre du club (pas le PRESIDENT)",
      },
      {
        method: "PATCH",
        route: "/clubs/:id/members/:userId",
        auth: true,
        roles: "PRESIDENT, RESPONSABLE",
        description: "Modifier le rôle d'un membre",
      },
      {
        method: "POST",
        route: "/clubs/:id/transfer-presidency",
        auth: true,
        roles: "PRESIDENT",
        description:
          "Transférer la présidence (l'ancien président devient RESPONSABLE)",
      },
      {
        method: "DELETE",
        route: "/clubs/:id/leave",
        auth: true,
        roles: "Non-PRESIDENT",
        description: "Quitter le club",
      },
    ],
  },
  {
    name: "Teams",
    description:
      "Gestion des équipes au sein d'un club. Rôles : COACH, ASSISTANT_COACH.",
    endpoints: [
      {
        method: "POST",
        route: "/teams",
        auth: true,
        roles: "Tous",
        description:
          "Créer une équipe (le créateur devient automatiquement COACH)",
      },
      {
        method: "GET",
        route: "/teams?clubId=xxx",
        auth: true,
        roles: "Tous",
        description: "Lister les équipes d'un club (query param requis)",
      },
      {
        method: "GET",
        route: "/teams/:id",
        auth: true,
        roles: "Tous",
        description: "Détails d'une équipe",
      },
      {
        method: "PATCH",
        route: "/teams/:id",
        auth: true,
        roles: "COACH, PRESIDENT",
        description: "Modifier l'équipe (nom, catégorie)",
      },
      {
        method: "DELETE",
        route: "/teams/:id",
        auth: true,
        roles: "COACH, PRESIDENT",
        description: "Supprimer l'équipe (suppression en cascade)",
      },
      {
        method: "GET",
        route: "/teams/:id/members",
        auth: true,
        roles: "Tous",
        description: "Lister les membres de l'équipe",
      },
      {
        method: "POST",
        route: "/teams/:id/members",
        auth: true,
        roles: "COACH, PRESIDENT",
        description: "Ajouter un membre à l'équipe",
      },
      {
        method: "DELETE",
        route: "/teams/:id/members/:userId",
        auth: true,
        roles: "COACH, PRESIDENT",
        description:
          "Retirer un membre (un ASSISTANT_COACH ne peut pas retirer un COACH)",
      },
      {
        method: "PATCH",
        route: "/teams/:id/members/:userId",
        auth: true,
        roles: "COACH, PRESIDENT",
        description: "Modifier le rôle d'un membre de l'équipe",
      },
      {
        method: "DELETE",
        route: "/teams/:id/leave",
        auth: true,
        roles: "Tous",
        description: "Quitter l'équipe (même les COACHs peuvent quitter)",
      },
    ],
  },
  {
    name: "Players",
    description:
      "Gestion des joueurs rattachés à une équipe. Accès réservé aux encadrants.",
    endpoints: [
      {
        method: "POST",
        route: "/players",
        auth: true,
        roles: "COACH, ASSISTANT_COACH, PRESIDENT",
        description:
          "Créer un joueur (nom, prénom, poste, numéro, pied fort, statut)",
      },
      {
        method: "GET",
        route: "/players?teamId=xxx",
        auth: true,
        roles: "COACH, ASSISTANT_COACH, PRESIDENT",
        description:
          "Lister les joueurs d'une équipe (query param requis)",
      },
      {
        method: "GET",
        route: "/players/:id",
        auth: true,
        roles: "COACH, ASSISTANT_COACH, PRESIDENT",
        description: "Détails d'un joueur",
      },
      {
        method: "PATCH",
        route: "/players/:id",
        auth: true,
        roles: "COACH, ASSISTANT_COACH, PRESIDENT",
        description: "Modifier un joueur (possibilité de changer d'équipe)",
      },
      {
        method: "DELETE",
        route: "/players/:id",
        auth: true,
        roles: "COACH, ASSISTANT_COACH, PRESIDENT",
        description: "Supprimer un joueur",
      },
    ],
  },
  {
    name: "Matches",
    description:
      "Gestion des matchs, convocations et événements. Statuts : UPCOMING → LIVE → FINISHED.",
    endpoints: [
      {
        method: "POST",
        route: "/matches",
        auth: true,
        roles: "COACH, ASSISTANT_COACH, PRESIDENT",
        description: "Créer un match (statut par défaut : UPCOMING)",
      },
      {
        method: "GET",
        route: "/matches?teamId=xxx",
        auth: true,
        roles: "Tous",
        description:
          "Lister les matchs d'une équipe (query param requis)",
      },
      {
        method: "GET",
        route: "/matches/:id",
        auth: true,
        roles: "Tous",
        description: "Détails d'un match (avec le score)",
      },
      {
        method: "PATCH",
        route: "/matches/:id",
        auth: true,
        roles: "COACH, ASSISTANT_COACH, PRESIDENT",
        description:
          "Modifier un match (adversaire, lieu, date)",
      },
      {
        method: "DELETE",
        route: "/matches/:id",
        auth: true,
        roles: "COACH, PRESIDENT",
        description: "Supprimer un match (suppression en cascade)",
      },
      {
        method: "PATCH",
        route: "/matches/:id/status",
        auth: true,
        roles: "COACH, PRESIDENT",
        description:
          "Changer le statut du match (UPCOMING → LIVE → FINISHED, pas de retour en arrière)",
      },
      {
        method: "POST",
        route: "/matches/:id/players",
        auth: true,
        roles: "COACH, ASSISTANT_COACH, PRESIDENT",
        description:
          "Convoquer des joueurs (statut : STARTER ou SUBSTITUTE)",
      },
      {
        method: "GET",
        route: "/matches/:id/players",
        auth: true,
        roles: "Tous",
        description: "Lister les joueurs convoqués",
      },
      {
        method: "PATCH",
        route: "/matches/:id/players/:playerId",
        auth: true,
        roles: "COACH, ASSISTANT_COACH, PRESIDENT",
        description: "Modifier le statut d'un joueur convoqué",
      },
      {
        method: "DELETE",
        route: "/matches/:id/players/:playerId",
        auth: true,
        roles: "COACH, ASSISTANT_COACH, PRESIDENT",
        description:
          "Retirer un joueur (bloqué si des événements existent)",
      },
      {
        method: "POST",
        route: "/matches/:id/events",
        auth: true,
        roles: "COACH, ASSISTANT_COACH, PRESIDENT",
        description:
          "Ajouter un événement (conversion auto YELLOW_CARD → RED_CARD)",
      },
      {
        method: "GET",
        route: "/matches/:id/events",
        auth: true,
        roles: "Tous",
        description: "Lister les événements du match",
      },
      {
        method: "PATCH",
        route: "/matches/:id/events/:eventId",
        auth: true,
        roles: "COACH, ASSISTANT_COACH, PRESIDENT",
        description: "Modifier un événement",
      },
      {
        method: "DELETE",
        route: "/matches/:id/events/:eventId",
        auth: true,
        roles: "COACH, ASSISTANT_COACH, PRESIDENT",
        description:
          "Supprimer un événement (supprime les ASSISTs liés si GOAL)",
      },
    ],
  },
];

function MethodBadge({ method }: { method: string }) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${methodColors[method] ?? "bg-gray-100 text-gray-800 border-gray-300"}`}
    >
      {method}
    </span>
  );
}

function EndpointRow({ endpoint }: { endpoint: Endpoint }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 py-4 px-4 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 md:w-[520px] shrink-0">
        <MethodBadge method={endpoint.method} />
        <code className="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-1 rounded-lg break-all">
          {endpoint.route}
        </code>
      </div>
      <div className="flex-1 text-sm text-gray-600">{endpoint.description}</div>
      <div className="flex items-center gap-2 shrink-0">
        {endpoint.auth ? (
          <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full font-medium">
            🔒 JWT
          </span>
        ) : (
          <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
            🌐 Public
          </span>
        )}
        <span className="text-xs bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full font-medium">
          {endpoint.roles}
        </span>
      </div>
    </div>
  );
}

function ApiSection({ section }: { section: Section }) {
  const gradient = sectionColors[section.name] ?? "from-gray-500 to-gray-600";
  const icon = sectionIcons[section.name] ?? "📌";

  return (
    <div className="card-modern mb-8">
      <div className="flex items-center gap-3 mb-2">
        <span
          className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} text-white text-lg`}
        >
          {icon}
        </span>
        <h2 className="text-2xl font-bold text-gray-900">{section.name}</h2>
        <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-3 py-1 font-medium">
          {section.endpoints.length} endpoint
          {section.endpoints.length > 1 ? "s" : ""}
        </span>
      </div>
      <p className="text-gray-500 text-sm mb-6 ml-13">{section.description}</p>
      <div className="divide-y divide-gray-100">
        {section.endpoints.map((ep) => (
          <EndpointRow key={`${ep.method}-${ep.route}`} endpoint={ep} />
        ))}
      </div>
    </div>
  );
}

export default function InfosPage() {
  const totalEndpoints = apiSections.reduce(
    (sum, s) => sum + s.endpoints.length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-stadium-gradient text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-blue-300 mb-3 font-semibold">
            Documentation API
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-gradient-gold">
            MatchFlow API
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Vue d&apos;ensemble des routes du backend NestJS — fonctionnalités,
            restrictions et rôles utilisateurs.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              🚀 {totalEndpoints} endpoints
            </span>
            <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              🔐 JWT Authentication
            </span>
            <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              🛡️ Role-based access
            </span>
            <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              📦 REST API
            </span>
          </div>
        </div>
      </header>

      {/* Legend */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center gap-3 mb-8 justify-center">
          <span className="text-sm font-semibold text-gray-500 mr-2">
            Méthodes :
          </span>
          {Object.entries(methodColors).map(([method, cls]) => (
            <span
              key={method}
              className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${cls}`}
            >
              {method}
            </span>
          ))}
        </div>

        {/* Sections */}
        {apiSections.map((section) => (
          <ApiSection key={section.name} section={section} />
        ))}

        {/* Footer note */}
        <div className="text-center py-12 text-gray-400 text-sm">
          <p>
            ℹ️ Cette page est une vue d&apos;ensemble statique. Swagger sera
            intégré prochainement pour les tests interactifs.
          </p>
          <p className="mt-2">
            <a href="/" className="link-modern">
              ← Retour à l&apos;accueil
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
