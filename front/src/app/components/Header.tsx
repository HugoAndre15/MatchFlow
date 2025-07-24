"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo avec animation */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isScrolled ? "bg-green-600" : "bg-white"
              } shadow-lg group-hover:scale-110`}>
                <span className={`text-2xl font-bold transition-colors ${
                  isScrolled ? "text-white" : "text-green-600"
                }`}>⚽</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur"></div>
            </div>
            <div>
              <span
                className={`text-2xl font-black transition-colors ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
              >
                MatchFlow
              </span>
              <div className={`text-xs font-medium ${
                isScrolled ? "text-green-600" : "text-green-200"
              }`}>
                Coach Edition
              </div>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            {[
              { href: "#features", label: "Fonctionnalités", icon: "⚡" },
              { href: "#demo", label: "Démo Live", icon: "🎮" },
              { href: "#pricing", label: "Tarifs", icon: "💎" },
              { href: "#contact", label: "Contact", icon: "📞" }
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`group flex items-center space-x-2 font-semibold text-sm transition-all hover:scale-105 ${
                  isScrolled 
                    ? "text-gray-700 hover:text-green-600" 
                    : "text-white/90 hover:text-white"
                }`}
              >
                <span className="text-lg group-hover:animate-bounce">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          {/* Boutons d'action */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link 
              href="/login"
              className={`font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105 ${
                isScrolled
                  ? "text-gray-700 hover:text-green-600 hover:bg-green-50"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="mr-2">👤</span>
              Connexion
            </Link>
            <Link 
              href="/register" 
              className="bg-gradient-to-r from-green-600 to-green-700 text-white font-bold px-8 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="mr-2">🚀</span>
              Essai Gratuit
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={`lg:hidden p-3 rounded-xl transition-colors ${
              isScrolled 
                ? "text-gray-700 hover:bg-gray-100" 
                : "text-white hover:bg-white/10"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 space-y-4">
              {[
                { href: "#features", label: "Fonctionnalités", icon: "⚡" },
                { href: "#demo", label: "Démo Live", icon: "🎮" },
                { href: "#pricing", label: "Tarifs", icon: "💎" },
                { href: "#contact", label: "Contact", icon: "📞" }
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-3 text-gray-700 hover:text-green-600 font-semibold py-3 px-4 rounded-xl hover:bg-green-50 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              ))}
              <hr className="border-gray-200 my-4" />
              <Link
                href="/login"
                className="flex items-center space-x-3 text-gray-700 hover:text-green-600 font-semibold py-3 px-4 rounded-xl hover:bg-green-50 transition-all"
              >
                <span className="text-lg">👤</span>
                <span>Connexion</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all"
              >
                <span>🚀</span>
                <span>Essai Gratuit</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;