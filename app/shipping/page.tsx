import { Metadata } from "next";

export const metadata: Metadata = {
  title: "משלוחים והחזרות | YL Sport",
  description: "מידע על משלוחים, זמני אספקה ומדיניות החזרות של YL Sport",
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
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
                    <p className="text-3xl font-bold text-primary">₪20</p>
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
                      פנה אלינו באימייל ylsport1@gmail.com או בטלפון 050-889-7290
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

              <h3 className="text-xl font-semibold text-gray-800 mb-3">החלפת מוצרים - קל ומהיר!</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  רוצה להחליף מידה או צבע? אין בעיה!
                  <br />
                  אנו מציעים שירות החלפה מהיר עם שליח עד הבית בעלות של <strong>29 ₪ בלבד</strong>.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-200 text-green-800 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                    <p className="text-sm text-gray-700">לוחצים על הכפתור למטה ושולחים לנו הודעה בוואטסאפ.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-200 text-green-800 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                    <p className="text-sm text-gray-700">אנחנו נשלח לך קישור אישי ומאובטח לבחירת המידה החדשה ותשלום דמי המשלוח.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-200 text-green-800 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                    <p className="text-sm text-gray-700">זהו! שליח יגיע לאסוף את הפריט הישן ולמסור לך את החדש (עד 10 ימי עסקים).</p>
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <a
                    href="https://wa.me/972508897290?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%94%D7%99%D7%99%D7%AA%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%9C%D7%91%D7%A6%D7%A2%20%D7%91%D7%A7%D7%A9%D7%AA%20%D7%94%D7%97%D7%9C%D7%A4%D7%94%20%D7%9C%D7%9E%D7%95%D7%A6%D7%A8%20%D7%A9%D7%9C%D7%99."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-full transition-colors shadow-sm"
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="w-5 h-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    לחצי כאן לבקשת החלפה בוואטסאפ
                  </a>
                </div>
              </div>
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
                      href="tel:0508897290"
                      className="text-primary hover:underline text-lg"
                    >
                      050-889-7290
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
    </div>
  );
}