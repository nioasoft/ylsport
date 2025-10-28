"use client";

import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "שרה כהן",
    location: "תל אביב",
    rating: 5,
    text: "הטייץ הכי נוח שיש לי! משתמשת בו כמעט כל יום באימונים. הבד נושם מעולה ולא מתפזר אפילו אחרי המון כביסות.",
    date: "לפני שבועיים",
  },
  {
    id: 2,
    name: "מיכל לוי",
    location: "חיפה",
    rating: 5,
    text: "איכות מעולה במחיר הוגן! הגזרה High-Waist ממש מחמיאה ונותנת תחושת ביטחון. הזמנתי כבר עוד זוג לחברה שלי.",
    date: "לפני 3 שבועות",
  },
  {
    id: 3,
    name: "דנה אברהם",
    location: "באר שבע",
    rating: 5,
    text: "משלוח מהיר ושירות מעולה! הטייץ מתאים בדיוק למידות שבטבלה. ממליצה בחום!",
    date: "לפני חודש",
  },
  {
    id: 4,
    name: "רונית פרידמן",
    location: "ירושלים",
    rating: 5,
    text: "עשיתי יוגה, ריצה וחדר כושר - הטייץ מושלם לכל סוג של פעילות.",
    date: "לפני חודש",
  },
  {
    id: 5,
    name: "יעל מזרחי",
    location: "נתניה",
    rating: 5,
    text: "בהתחלה היה לי ספק אם לקנות אונליין, אבל אחרי שקיבלתי את המוצר הייתי בשמיים! איכות פרימיום.",
    date: "לפני חודשיים",
  },
  {
    id: 6,
    name: "נועה ישראלי",
    location: "רעננה",
    rating: 5,
    text: "אחרי שניסיתי הרבה טייצים שונים, זה בהחלט האהוב עליי. משקיעים באיכות ובפרטים הקטנים.",
    date: "לפני חודשיים",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className={`h-5 w-5 ${
            index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="reviews" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold md:text-4xl">
            מה <span className="text-primary">הלקוחות אומרות</span>
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            מאות נשים כבר נהנות מהטייץ שלנו
          </p>

          {/* Overall Rating */}
          <div className="mt-8 inline-block rounded-lg bg-primary-light px-8 py-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">5.0</div>
                <StarRating rating={5} />
              </div>
              <div className="border-r border-primary pr-4">
                <div className="text-2xl font-bold text-gray-900">100+</div>
                <div className="text-sm text-gray-600">ביקורות</div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Rating */}
                <StarRating rating={testimonial.rating} />

                {/* Review Text */}
                <p className="mt-4 text-gray-700 leading-relaxed">
                  &quot;{testimonial.text}&quot;
                </p>

                {/* Reviewer Info */}
                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.location}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {testimonial.date}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap justify-center gap-8 rounded-lg bg-gray-50 px-8 py-6">
            <div className="flex items-center gap-2">
              <svg
                className="h-6 w-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">100% ביקורות מאומתות</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-6 w-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              <span className="text-sm font-medium">98% שביעות רצון</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-6 w-6 text-green-500"
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
              <span className="text-sm font-medium">משלוח תוך 3-5 ימים</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
