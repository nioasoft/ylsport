"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Navigation - Desktop only */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            דף הבית
          </Link>
          <Link
            href="/#about"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            אודות
          </Link>
          <Link
            href="/#product"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            המוצר
          </Link>
          <Link
            href="/#reviews"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            חוות דעת
          </Link>
          <Link
            href="/#contact"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            יצירת קשר
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={isMenuOpen ? "סגור תפריט" : "פתח תפריט"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            // X icon when menu is open
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger icon when menu is closed
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Logo and Text */}
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-primary">Sport</h1>
          <Image
            src="/images/logo_vector 3.svg"
            alt="Sport"
            width={40}
            height={40}
            style={{ width: "auto", height: "40px" }}
          />
        </Link>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
          <Link
            href="/"
            onClick={closeMenu}
            className="text-base font-medium transition-colors hover:text-primary py-2 border-b"
          >
            דף הבית
          </Link>
          <Link
            href="/#about"
            onClick={closeMenu}
            className="text-base font-medium transition-colors hover:text-primary py-2 border-b"
          >
            אודות
          </Link>
          <Link
            href="/#product"
            onClick={closeMenu}
            className="text-base font-medium transition-colors hover:text-primary py-2 border-b"
          >
            המוצר
          </Link>
          <Link
            href="/#reviews"
            onClick={closeMenu}
            className="text-base font-medium transition-colors hover:text-primary py-2 border-b"
          >
            חוות דעת
          </Link>
          <Link
            href="/#contact"
            onClick={closeMenu}
            className="text-base font-medium transition-colors hover:text-primary py-2"
          >
            יצירת קשר
          </Link>
        </nav>
      </div>
    </header>
  );
}
