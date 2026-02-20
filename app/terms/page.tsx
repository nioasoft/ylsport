import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export const metadata = {
  title: "תנאי שימוש | YL Sport",
  description: "תנאי השימוש והרכישה באתר YL Sport",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <article className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              תנאי שימוש
            </h1>

            <p className="text-gray-600 mb-8">
              עודכן לאחרונה: {new Date().toLocaleDateString("he-IL")}
            </p>

            <div className="prose prose-lg max-w-none">
              {/* הקדמה */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">הקדמה</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ברוכים הבאים ל-YL Sport. תנאי שימוש אלה מסדירים את השימוש שלך באתר
                  www.yl-sport.co.il ואת רכישת מוצרים דרך האתר.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  השימוש באתר ו/או רכישת מוצרים מהווים הסכמה מלאה לתנאים אלה.
                  אם אינך מסכים לתנאים, אנא הימנע משימוש באתר.
                </p>
              </section>

              {/* הגדרות */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. הגדרות</h2>
                <ul className="list-disc pr-6 space-y-2 text-gray-700">
                  <li><strong>&quot;האתר&quot;</strong> - www.yl-sport.co.il</li>
                  <li><strong>&quot;החברה&quot;</strong> או <strong>&quot;אנו&quot;</strong> - YL Sport</li>
                  <li><strong>&quot;לקוח&quot;</strong> או <strong>&quot;אתה&quot;</strong> - כל מי שגולש באתר או מבצע רכישה</li>
                  <li><strong>&quot;מוצר&quot;</strong> - טייץ ספורט YL ומוצרים נוספים המוצעים לרכישה באתר</li>
                </ul>
              </section>

              {/* שימוש באתר */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. שימוש באתר</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 תנאי שימוש כלליים</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  השימוש באתר מותר לכל אדם, בכפוף לתנאים הבאים:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-4">
                  <li>הינך בן 18 לפחות או קטין בהשגחת הורה/אפוטרופוס</li>
                  <li>המידע שתספק יהיה מדויק, נכון ועדכני</li>
                  <li>לא תעשה שימוש לרעה באתר או במוצרים</li>
                  <li>לא תפר זכויות יוצרים או קניין רוחני</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 שימוש אסור</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  אסור לבצע את הפעולות הבאות:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700">
                  <li>ניסיון לפרוץ או להפר את אבטחת האתר</li>
                  <li>שימוש בבוטים או תוכנות אוטומטיות</li>
                  <li>העתקה, שכפול או הפצה של תוכן האתר ללא אישור</li>
                  <li>הטרדה, הונאה או פגיעה במשתמשים אחרים</li>
                </ul>
              </section>

              {/* רכישה ותשלום */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. רכישה ותשלום</h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 תהליך הרכישה</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  תהליך רכישת מוצר כולל:
                </p>
                <ol className="list-decimal pr-6 space-y-2 text-gray-700 mb-4">
                  <li>בחירת מוצר ומידה</li>
                  <li>הזנת פרטי משלוח ויצירת קשר</li>
                  <li>ביצוע תשלום דרך מעבד תשלומים מאובטח (Cardcom)</li>
                  <li>קבלת אישור הזמנה באימייל</li>
                </ol>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 מחירים</h3>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-4">
                  <li>כל המחירים באתר מוצגים בשקלים חדשים (₪) וכוללים מע&quot;מ</li>
                  <li>המחירים נכונים למועד פרסומם ועשויים להשתנות ללא הודעה מוקדמת</li>
                  <li>המחיר הסופי יכלול עלות משלוח (אלא אם זכאי למשלוח חינם)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 תשלום</h3>
                <ul className="list-disc pr-6 space-y-2 text-gray-700">
                  <li>התשלום מתבצע דרך מעבד תשלומים חיצוני (Cardcom)</li>
                  <li>אנו לא שומרים פרטי כרטיס אשראי</li>
                  <li>התשלום מאובטח בתקן PCI-DSS</li>
                  <li>ההזמנה תאושר רק לאחר קבלת אישור מחברת האשראי</li>
                </ul>
              </section>

              {/* ביטול עסקה */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. ביטול עסקה</h2>

                <div className="bg-primary-light border border-primary rounded-lg p-6 mb-4">
                  <p className="text-gray-900 font-semibold mb-2">
                    זכות ביטול עסקה על פי חוק הגנת הצרכן
                  </p>
                  <p className="text-gray-700">
                    הלקוח רשאי לבטל את העסקה תוך <strong>14 יום</strong> מיום קבלת המוצר,
                    בהתאם לחוק הגנת הצרכן, התשמ&quot;א-1981.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 תנאי ביטול</h3>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-4">
                  <li>המוצר לא נעשה בו שימוש והוא במצבו המקורי</li>
                  <li>התוויות והאריזה המקורית שלמות</li>
                  <li>פנייה בכתב (אימייל או מכתב) תוך 14 יום</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 החזר כספי</h3>
                <p className="text-gray-700 leading-relaxed">
                  לאחר קבלת המוצר החוזר ואישורו, יבוצע החזר כספי מלא תוך 7-14 ימי עסקים
                  לאמצעי התשלום המקורי. עלות המשלוח המקורית לא תוחזר אלא אם היה פגם במוצר.
                </p>
              </section>

              {/* אחריות ואחריות מוגבלת */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. אחריות</h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 אחריות על מוצרים</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  אנו מתחייבים שהמוצרים שלנו:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-4">
                  <li>עומדים בתיאור המוצר באתר</li>
                  <li>עשויים מחומרים איכותיים</li>
                  <li>נבדקו לפני המשלוח</li>
                  <li>מתאימים לשימוש לפי ייעודם</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 מגבלות אחריות</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  האחריות אינה חלה על:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700">
                  <li>נזק שנגרם משימוש לא נכון או הזנחה</li>
                  <li>בלאי טבעי כתוצאה משימוש ממושך</li>
                  <li>נזק שנגרם לאחר החזרת המוצר</li>
                  <li>שינויים או תיקונים שבוצעו על ידי צד שלישי</li>
                </ul>
              </section>

              {/* הגבלת אחריות */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. הגבלת אחריות</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  בכפוף לחוק:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700">
                  <li>אנו לא נהיה אחראים לנזקים עקיפים, תוצאתיים או מיוחדים</li>
                  <li>אחריותנו מוגבלת לערך המוצר שנרכש</li>
                  <li>אנו לא אחראים לעיכובים או כשלים הנגרמים מכוח עליון</li>
                </ul>
              </section>

              {/* קניין רוחני */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. קניין רוחני</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  כל התוכן באתר, כולל טקסטים, תמונות, לוגו, עיצוב וקוד, הוא רכושה הבלעדי של YL Sport
                  ומוגן בחוקי זכויות יוצרים וקניין רוחני.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  אסור להעתיק, לשכפל, להפיץ או להשתמש בתוכן האתר ללא אישור בכתב מראש.
                </p>
              </section>

              {/* שינויים בתנאים */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. שינויים בתנאי שימוש</h2>
                <p className="text-gray-700 leading-relaxed">
                  אנו שומרים לעצמנו את הזכות לשנות תנאי שימוש אלה בכל עת.
                  שינויים יכנסו לתוקף מיד עם פרסומם באתר. המשך שימוש באתר לאחר השינויים
                  מהווה הסכמה לתנאים המעודכנים.
                </p>
              </section>

              {/* דין וסמכות שיפוט */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. דין וסמכות שיפוט</h2>
                <p className="text-gray-700 leading-relaxed">
                  תנאי שימוש אלה יפורשו על פי חוקי מדינת ישראל.
                  סמכות השיפוט הבלעדית נתונה לבתי המשפט המוסמכים בישראל.
                </p>
              </section>

              {/* יצירת קשר */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. יצירת קשר</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  לשאלות או הבהרות בנוגע לתנאי שימוש אלה:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>YL Sport</strong>
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>אימייל:</strong>{" "}
                    <a href="mailto:ylsport1@gmail.com" className="text-primary hover:underline">
                      ylsport1@gmail.com
                    </a>
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>טלפון:</strong>{" "}
                    <a href="tel:0508897290" className="text-primary hover:underline">
                      050-889-7290
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <strong>כתובת:</strong> באר שבע, ישראל
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
