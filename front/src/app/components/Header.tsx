"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">⚽</span>
            </div>
            <span
              className={`text-2xl font-bold transition-colors ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              MatchFlow
            </span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className={`font-medium transition-colors hover:text-green-600 ${
                isScrolled ? "text-gray-700" : "text-white/90"
              }`}
            >
              Fonctionnalités
            </a>
            <a
              href="#pricing"
              className={`font-medium transition-colors hover:text-green-600 ${
                isScrolled ? "text-gray-700" : "text-white/90"
              }`}
            >
              Tarifs
            </a>
            <a
              href="#contact"
              className={`font-medium transition-colors hover:text-green-600 ${
                isScrolled ? "text-gray-700" : "text-white/90"
              }`}
            >
              Contact
            </a>
          </div>

          {/* Boutons d'action */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Connexion
            </button>
            <Link href="/mon-espace" className="btn-primary">
              Mon Espace
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 bg-white/95 backdrop-blur-md rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4 p-4">
              <a href="#features" className="text-gray-700 hover:text-green-600 font-medium">
                Fonctionnalités
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-green-600 font-medium">
                Tarifs
              </a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 font-medium">
                Contact
              </a>
              <hr className="border-gray-200" />
              <button className="text-left text-gray-700 hover:text-green-600 font-medium">
                Connexion
              </button>
              <button className="btn-primary text-center">
                Mon Espace
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
