"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const productImages = [
  {
    id: 1,
    url: "/images/product1.webp",
    alt: "טייץ ספורט YL - תמונה ראשית",
  },
  {
    id: 2,
    url: "/images/product2.webp",
    alt: "טייץ ספורט YL - זווית צד",
  },
  {
    id: 3,
    url: "/images/product3.webp",
    alt: "טייץ ספורט YL - פרטי בד",
  },
  {
    id: 4,
    url: "/images/product4.webp",
    alt: "טייץ ספורט YL - תמונה באימון",
  },
];

const features = [
  {
    icon: "🏃‍♀️",
    title: "חומר נושם",
    description: "בד איכותי המאפשר אוורור מקסימלי",
  },
  {
    icon: "💪",
    title: "גמישות מלאה",
    description: "תומך בכל תנועה ופעילות",
  },
  {
    icon: "💧",
    title: "ייבוש מהיר",
    description: "טכנולוגיה מתקדמת של ספיגה ואידוי",
  },
  {
    icon: "✨",
    title: "עמידות גבוהה",
    description: "נשאר כמו חדש גם אחרי כביסות רבות",
  },
];

const specifications = [
  { label: "חומר", value: "75% פוליאסטר, 25% ספנדקס" },
  { label: "משקל", value: "220 גרם" },
  { label: "גזרה", value: "High-Waist" },
  { label: "תפרים", value: "Flatlock (ללא חיכוך)" },
  { label: "טיפול", value: "ניתן לכביסה במכונה 30°C" },
];

export function ProductShowcase() {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <section id="product" className="bg-white py-12 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold md:text-4xl">
            גלי את <span className="text-primary">YL Sport Tights</span>
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            טייץ ספורט שמשלב סטייל, נוחות ואיכות
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src={productImages[selectedImage].url}
                alt={productImages[selectedImage].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={selectedImage === 0}
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg transition-all ${
                    selectedImage === index
                      ? "ring-4 ring-primary"
                      : "ring-1 ring-gray-200 hover:ring-2 hover:ring-primary"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 10vw"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Features */}
            <div>
              <h3 className="text-2xl font-bold mb-6">תכונות ייחודיות</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {features.map((feature, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{feature.icon}</span>
                        <div>
                          <h4 className="font-semibold">{feature.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-2xl font-bold mb-6">מפרט טכני</h3>
              <Card>
                <CardContent className="p-6">
                  <dl className="space-y-3">
                    {specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="flex justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                      >
                        <dt className="font-medium text-gray-900">
                          {spec.label}
                        </dt>
                        <dd className="text-gray-600">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            </div>

            {/* One Size Info */}
            <div className="rounded-lg bg-primary-light p-6">
              <h4 className="font-semibold mb-2">מידה אחת - One Size</h4>
              <p className="text-sm text-gray-700 mb-4">
                הטייץ מתאים לכל המידות בזכות הגמישות הגבוהה והחומר האיכותי.
                <br />
                מתאים להיקפי מותניים 60-100 ס&quot;מ
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
