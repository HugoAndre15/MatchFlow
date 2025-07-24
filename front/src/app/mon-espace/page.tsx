// front/src/app/mon-espace/page.tsx
import React from "react";
import DashboardMain from "./components/DashboardMain";

export const metadata = {
  title: "Mon Espace - MatchFlow",
  description: "Gérez votre équipe, vos joueurs et vos matchs en temps réel avec MatchFlow",
};

const MonEspacePage = () => {
  return <DashboardMain />;
};

export default MonEspacePage;