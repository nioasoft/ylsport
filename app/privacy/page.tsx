import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export const metadata = {
  title: "מדיניות פרטיות | YL Sport",
  description: "מדיניות הפרטיות של YL Sport - כיצד אנו אוספים, משתמשים ומגנים על המידע האישי שלך",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <article className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              מדיניות פרטיות
            </h1>

            <p className="text-gray-600 mb-8">
              עודכן לאחרונה: {new Date().toLocaleDateString("he-IL")}
            </p>

            <div className="prose prose-lg max-w-none">
              {/* הקדמה */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">הקדמה</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ב-YL Sport, אנו מחויבים להגן על פרטיותך ולכבד את זכויותיך המשפטיות.
                  מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע האישי שלך
                  בעת שימוש באתר האינטרנט שלנו www.yl-sport.co.il.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  מדיניות זו עומדת בדרישות חוק הגנת הפרטיות, התשמ&quot;א-1981 ותקנותיו,
                  כולל תיקון 13 לחוק הגנת הפרטיות.
                </p>
              </section>

              {/* איסוף מידע */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. איזה מידע אנו אוספים</h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">מידע שאתה מספק לנו</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  כאשר אתה מבצע הזמנה או יוצר קשר איתנו, אנו עשויים לאסוף:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-4">
                  <li>שם מלא</li>
                  <li>כתובת דואר אלקטרוני</li>
                  <li>מספר טלפון</li>
                  <li>כתובת למשלוח</li>
                  <li>פרטי תשלום (באמצעות ספק תשלום מאובטח - Cardcom)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">מידע שנאסף אוטומטית</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  בעת גלישה באתר, אנו עשויים לאסוף:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700">
                  <li>כתובת IP</li>
                  <li>סוג דפדפן ומכשיר</li>
                  <li>דפים שביקרת בהם</li>
                  <li>זמן ומשך הגלישה</li>
                  <li>מידע דרך עוגיות (Cookies) - ראה סעיף 6</li>
                </ul>
              </section>

              {/* שימוש במידע */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. כיצד אנו משתמשים במידע</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  אנו משתמשים במידע שלך למטרות הבאות:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700">
                  <li><strong>עיבוד הזמנות:</strong> לעבד ולבצע את ההזמנה שלך, כולל משלוח ותמיכה</li>
                  <li><strong>שירות לקוחות:</strong> להגיב לפניות ולספק תמיכה טכנית</li>
                  <li><strong>שיפור השירות:</strong> לשפר את חווית המשתמש באתר ואת המוצרים שלנו</li>
                  <li><strong>תקשורת שיווקית:</strong> לשלוח עדכונים והצעות (רק בהסכמתך מפורשת)</li>
                  <li><strong>מניעת הונאות:</strong> לזהות ולמנוע פעילות חשודה או הונאה</li>
                  <li><strong>עמידה בחוק:</strong> לקיים חובות משפטיות ותקנות</li>
                </ul>
              </section>

              {/* שיתוף מידע */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. שיתוף מידע עם צדדים שלישיים</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  אנו עשויים לשתף את המידע שלך עם:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700">
                  <li><strong>ספקי תשלום:</strong> Cardcom לעיבוד תשלומים מאובטח</li>
                  <li><strong>חברות משלוחים:</strong> להעברת המוצר אליך</li>
                  <li><strong>ספקי שירות:</strong> אחסון, ניתוח נתונים, שיווק באימייל</li>
                  <li><strong>רשויות משפטיות:</strong> כאשר נדרש על פי חוק</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  <strong>אנו לא מוכרים את המידע האישי שלך לצדדים שלישיים.</strong>
                </p>
              </section>

              {/* אבטחת מידע */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. אבטחת מידע</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  אנו נוקטים באמצעי אבטחה טכניים וארגוניים כדי להגן על המידע שלך:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700">
                  <li>הצפנת SSL/TLS לכל העברות הנתונים</li>
                  <li>אחסון מאובטח בשרתים מוגנים</li>
                  <li>גישה מוגבלת למידע רק לעובדים מורשים</li>
                  <li>אנו לא שומרים פרטי כרטיסי אשראי - כל התשלומים מעובדים דרך Cardcom</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  למרות מאמצינו, אין שיטת העברה או אחסון באינטרנט מאובטחת ב-100%.
                  אנו ממליצים לשמור על סיסמאות חזקות ולא לשתף את פרטי ההתחברות שלך.
                </p>
              </section>

              {/* זכויות המשתמש */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. הזכויות שלך</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  על פי חוק הגנת הפרטיות, יש לך את הזכויות הבאות:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700">
                  <li><strong>זכות עיון:</strong> לצפות במידע האישי שאנו שומרים עליך</li>
                  <li><strong>זכות תיקון:</strong> לבקש תיקון מידע שגוי או לא מדויק</li>
                  <li><strong>זכות מחיקה:</strong> לבקש מחיקת המידע שלך (בכפוף לחובות חוקיות)</li>
                  <li><strong>זכות התנגדות:</strong> להתנגד לשימוש במידע למטרות שיווק</li>
                  <li><strong>זכות להסרה מרשימות תפוצה:</strong> להפסיק לקבל תקשורת שיווקית</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  לממש את זכויותיך, צור קשר עימנו בכתובת:
                  <a href="mailto:ylsport1@gmail.com" className="text-primary hover:underline mr-1">
                    ylsport1@gmail.com
                  </a>
                </p>
              </section>

              {/* עוגיות (Cookies) */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. עוגיות (Cookies)</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  אנו משתמשים בעוגיות (Cookies) לשיפור חווית הגלישה ולאיסוף מידע סטטיסטי.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">סוגי עוגיות:</h3>
                <ul className="list-disc pr-6 space-y-2 text-gray-700">
                  <li><strong>עוגיות הכרחיות:</strong> נדרשות לתפעול תקין של האתר</li>
                  <li><strong>עוגיות אנליטיות:</strong> עוזרות לנו להבין כיצד המשתמשים מתקשרים עם האתר</li>
                  <li><strong>עוגיות שיווקיות:</strong> משמשות להצגת פרסומות רלוונטיות</li>
                </ul>

                <p className="text-gray-700 leading-relaxed mt-4">
                  אתה יכול לנהל את העדפות העוגיות שלך בכל עת דרך הגדרות הדפדפן או באמצעות באנר העוגיות באתר.
                  שים לב שחסימת עוגיות מסוימות עלולה להשפיע על חוויית השימוש באתר.
                </p>
              </section>

              {/* שמירת מידע */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. משך שמירת המידע</h2>
                <p className="text-gray-700 leading-relaxed">
                  אנו שומרים את המידע האישי שלך כל עוד הוא נדרש למטרות שתוארו במדיניות זו,
                  או כפי שנדרש על פי חוק. מידע על הזמנות יישמר למשך 7 שנים בהתאם לדרישות המס.
                </p>
              </section>

              {/* קטינים */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. פרטיות קטינים</h2>
                <p className="text-gray-700 leading-relaxed">
                  האתר שלנו אינו מיועד לקטינים מתחת לגיל 18. אנו לא אוספים במכוון מידע אישי מקטינים.
                  אם אתה הורה או אפוטרופוס וגילית שילדך סיפק לנו מידע אישי, אנא צור קשר עימנו.
                </p>
              </section>

              {/* שינויים במדיניות */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. שינויים במדיניות פרטיות</h2>
                <p className="text-gray-700 leading-relaxed">
                  אנו עשויים לעדכן מדיניות פרטיות זו מעת לעת. כל שינוי מהותי יפורסם באתר
                  ויכלול את תאריך העדכון. המשך שימוש באתר לאחר השינויים מהווה הסכמה למדיניות המעודכנת.
                </p>
              </section>

              {/* יצירת קשר */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. יצירת קשר</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  לשאלות, הערות או בקשות בנוגע למדיניות פרטיות זו, אנא צור קשר:
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
                    <a href="tel:0539197848" className="text-primary hover:underline">
                      053-9197848
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
