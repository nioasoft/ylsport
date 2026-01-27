import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[600px] bg-gradient-to-b from-primary-light to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Content */}
          <div className="flex flex-col justify-center space-y-6 text-center lg:text-right order-2 lg:order-1">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              טייץ ספורט
              <br />
              <span className="text-primary">איכותי לנשים</span>
            </h1>

            <p className="text-base text-gray-700 sm:text-lg md:text-xl">
              נוחות מקסימלית, עיצוב מושלם
              <br />
              לכל אימון ופעילות
            </p>

            <div className="flex flex-col items-center gap-4 lg:items-start">
              {/* Price */}
              <div className="text-center lg:text-right">
                <p className="text-sm text-gray-600">מחיר מבצע</p>
                <p className="text-4xl font-bold text-primary">₪229</p>
                <p className="text-sm text-gray-600 line-through">₪399</p>
              </div>

              {/* CTA Button */}
              <Link href="/checkout">
                <Button size="lg" className="text-lg px-10 py-7 w-full sm:w-auto sm:px-8 sm:py-6">
                  קנה עכשיו
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 pt-8 lg:justify-start">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-medium">משלוח מהיר</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-medium">החזרה חינם</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-medium">איכות מובטחת</span>
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="flex items-center justify-center order-1 lg:order-2">
            <div className="relative h-[500px] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
              <Image
                src="/images/product1.webp"
                alt="טייץ ספורט YL Sport"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 500px"
              />

              {/* Badge */}
              <div className="absolute left-4 top-4 rounded-full bg-accent px-4 py-2 text-sm font-bold text-white shadow-lg">
                מבצע מוגבל!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="h-6 w-6 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
