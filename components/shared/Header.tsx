import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Navigation - Now on LEFT for RTL */}
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

        {/* Mobile Menu Button - LEFT on mobile */}
        <button
          className="md:hidden"
          aria-label="תפריט"
        >
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
        </button>

        {/* Logo and Text - Logo on RIGHT, Text on LEFT for RTL */}
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
    </header>
  );
}
