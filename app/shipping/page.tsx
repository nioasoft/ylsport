import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export const metadata = {
  title: "משלוחים והחזרות | YL Sport",
  description: "מידע על משלוחים, זמני אספקה ומדיניות החזרות של YL Sport",
};

export default function ShippingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <article className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              משלוחים והחזרות
            </h1>

            <p className="text-gray-600 mb-8">
              כל מה שצריך לדעת על משלוח המוצר אליך והחזרות
            </p>

            <div className="prose prose-lg max-w-none">
              {/* משלוחים */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">📦 משלוחים</h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">זמני אספקה</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  אנו מתחייבים לשלוח את ההזמנה שלך במהירות האפשרית:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-6">
                  <li><strong>זמן אספקה רגיל:</strong> 3-5 ימי עסקים מרגע אישור ההזמנה</li>
                  <li><strong>עיבוד הזמנה:</strong> הזמנות מעובדות תוך 24 שעות (בימי עסקים)</li>
                  <li><strong>אזורים מרוחקים:</strong> עלול להימשך יום נוסף</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">עלויות משלוח</h3>
                <div className="bg-primary-light border border-primary rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-900 mb-2">משלוח רגיל</p>
                      <p className="text-3xl font-bold text-primary">₪30</p>
                      <p className="text-sm text-gray-600 mt-1">לכל רחבי הארץ</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900 mb-2">משלוח חינם</p>
                      <p className="text-3xl font-bold text-primary">₪0</p>
                      <p className="text-sm text-gray-600 mt-1">בהזמנות מעל ₪500</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">איסוף עצמי</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  ניתן לאסוף את ההזמנה באופן עצמי מנקודת האיסוף שלנו באר שבע:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-6">
                  <li><strong>עלות:</strong> חינם</li>
                  <li><strong>זמינות:</strong> תוך 24-48 שעות מרגע אישור ההזמנה</li>
                  <li><strong>שעות פתיחה:</strong> ימים א׳-ה׳, 09:00-17:00 (בתיאום מראש)</li>
                  <li>תקבל הודעת SMS כאשר ההזמנה מוכנה לאיסוף</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">מעקב משלוח</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  לאחר שההזמנה שלך תצא למשלוח, תקבל:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-6">
                  <li>אימייל עם מספר מעקב</li>
                  <li>הודעת SMS עם קישור למעקב בזמן אמת</li>
                  <li>אפשרות למעקב דרך אתר חברת המשלוחים</li>
                </ul>
              </section>

              {/* החזרות */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">↩️ החזרות והחלפות</h2>

                <div className="bg-accent-light border border-accent rounded-lg p-6 mb-6">
                  <p className="text-lg font-semibold text-gray-900 mb-2">מדיניות החזרה</p>
                  <p className="text-gray-700 leading-relaxed">
                    ניתן להחזיר או להחליף מוצרים תוך <strong>14 יום</strong> מיום קבלת המשלוח,
                    בהתאם לחוק הגנת הצרכן התשמ&quot;א-1981.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">תנאים להחזרה</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  כדי להחזיר מוצר, על המוצר לעמוד בתנאים הבאים:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-6">
                  <li>המוצר לא נעשה בו שימוש</li>
                  <li>התוויות המקוריות מחוברות למוצר</li>
                  <li>האריזה המקורית שלמה</li>
                  <li>המוצר נמצא במצבו המקורי</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">תהליך ההחזרה</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">צור קשר</p>
                      <p className="text-gray-700 text-sm">
                        פנה אלינו באימייל ylsport1@gmail.com או בטלפון 053-9197848
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">קבל אישור</p>
                      <p className="text-gray-700 text-sm">
                        נאשר את ההחזרה ונשלח לך הוראות משלוח
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">שלח את המוצר</p>
                      <p className="text-gray-700 text-sm">
                        ארוז את המוצר היטב ושלח לכתובת שנמסרה
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">קבל החזר כספי</p>
                      <p className="text-gray-700 text-sm">
                        לאחר קבלת המוצר ובדיקתו, נבצע החזר תוך 7-14 ימי עסקים
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">עלות החזרה</h3>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-6">
                  <li><strong>מוצר פגום או שגוי:</strong> אנו נשא בעלות המשלוח</li>
                  <li><strong>החלטת לקוח:</strong> הלקוח ישא בעלות המשלוח חזרה</li>
                  <li><strong>החזר כספי:</strong> יבוצע לאמצעי תשלום המקורי</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">החלפת מוצרים</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  ניתן להחליף מוצר במידה אחרת או בצבע אחר:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-6">
                  <li>ההחלפה כפופה לזמינות במלאי</li>
                  <li>אין עלות נוספת להחלפה (בכפוף למדיניות המשלוח)</li>
                  <li>המוצר החדש יישלח לאחר קבלת המוצר המוחזר</li>
                </ul>
              </section>

              {/* מקרים מיוחדים */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ מקרים מיוחדים</h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">מוצר פגום או שגוי</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  אם קיבלת מוצר פגום או שגוי:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-6">
                  <li>פנה אלינו מיידית (תוך 48 שעות)</li>
                  <li>שלח תמונות של הפגם או השגיאה</li>
                  <li>נשלח מוצר חלופי או נבצע החזר מלא (לבחירתך)</li>
                  <li>נשא בכל עלויות המשלוח</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">משלוח שאבד</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  במקרה נדיר שהמשלוח אבד בדרך:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-6">
                  <li>נפתח חקירה עם חברת המשלוחים</li>
                  <li>אם המשלוח לא נמצא תוך 14 יום, נשלח מוצר חלופי או נבצע החזר מלא</li>
                </ul>
              </section>

              {/* יצירת קשר */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">📞 יש שאלות?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  צוות השירות שלנו כאן כדי לעזור! צור קשר בכל דרך שנוחה לך:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">אימייל</p>
                      <a
                        href="mailto:ylsport1@gmail.com"
                        className="text-primary hover:underline text-lg"
                      >
                        ylsport1@gmail.com
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">טלפון</p>
                      <a
                        href="tel:0539197848"
                        className="text-primary hover:underline text-lg"
                      >
                        053-9197848
                      </a>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    שעות פעילות: ימים א׳-ה׳, 09:00-17:00
                  </p>
                </div>
              </section>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
