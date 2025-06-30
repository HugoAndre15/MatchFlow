import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import AuthSection from "./components/AuthSection";
import ContactForm from "./components/ContactForm";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <AuthSection />
        <ContactForm />
      </main>
    </div>
  );
};

export default Home;
