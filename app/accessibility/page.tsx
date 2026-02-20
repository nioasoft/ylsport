import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export const metadata = {
  title: "הצהרת נגישות | YL Sport",
  description: "הצהרת הנגישות של YL Sport - התאמה לתקן ישראלי 5568",
};

export default function AccessibilityPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <article className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              הצהרת נגישות
            </h1>

            <p className="text-gray-600 mb-8">
              עודכן לאחרונה: {new Date().toLocaleDateString("he-IL")}
            </p>

            <div className="prose prose-lg max-w-none">
              {/* הקדמה */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">הקדמה</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  YL Sport מחויבת להנגשת האתר www.yl-sport.co.il לכלל האוכלוסייה,
                  לרבות אנשים עם מוגבלויות. אנו פועלים ליישום עקרונות הנגישות ולשיפור
                  מתמיד של חוויית המשתמש עבור כולם.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  הצהרת נגישות זו מתארת את התאמת האתר לתקנות שוויון זכויות לאנשים עם מוגבלויות
                  (התאמות נגישות לשירות), התשע&quot;ג-2013, ולתקן הישראלי (ת&quot;י 5568) לנגישות
                  תכנים באינטרנט ברמת AA.
                </p>
              </section>

              {/* התאמות נגישות */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. התאמות נגישות באתר
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  האתר תוכנן ופותח תוך הקפדה על עקרונות נגישות והתאמה לתקן WCAG 2.0 ברמת AA.
                  ההתאמות כוללות:
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
                  1.1 ניווט במקלדת
                </h3>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-4">
                  <li>ניתן לנווט בכל האתר באמצעות מקלדת בלבד (מקש Tab, Enter, חצים)</li>
                  <li>סדר המעבר בין רכיבי הדף הוא לוגי ועקבי</li>
                  <li>אזורי המיקוד (Focus) מסומנים בצורה ברורה ונראית</li>
                  <li>ניתן לדלג לתוכן הראשי באמצעות קישור &quot;דלג לתוכן&quot;</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  1.2 תמיכה בקוראי מסך
                </h3>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-4">
                  <li>כל התמונות כוללות תיאור חלופי (Alt Text) מפורט ומדויק</li>
                  <li>השימוש ב-ARIA landmarks לזיהוי אזורים באתר (header, main, footer, nav)</li>
                  <li>טפסים וכפתורים מסומנים עם תוויות (Labels) ברורות</li>
                  <li>הודעות שגיאה והצלחה מוקראות לקורא מסך</li>
                  <li>טבלאות ורשימות מעוצבות בצורה סמנטית נכונה</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  1.3 ניגודיות צבעים
                </h3>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-4">
                  <li>יחס ניגודיות של לפחות 4.5:1 בין טקסט לרקע</li>
                  <li>יחס ניגודיות של לפחות 3:1 עבור רכיבים גרפיים וממשק משתמש</li>
                  <li>הצבעים אינם משמשים כאמצעי היחיד להעברת מידע</li>
                  <li>כפתורים וקישורים מובחנים גם בלי תלות בצבע</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  1.4 גודל טקסט ומרווחים
                </h3>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-4">
                  <li>הטקסט באתר ניתן להגדלה עד 200% ללא אובדן תוכן או פונקציונליות</li>
                  <li>שימוש ביחידות יחסיות (rem, em) לגמישות</li>
                  <li>מרווחים נאותים בין שורות, פסקאות וכותרות לקריאות טובה יותר</li>
                  <li>גופנים קריאים וברורים</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  1.5 עיצוב רספונסיבי
                </h3>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-4">
                  <li>האתר מותאם לצפייה בכל המכשירים (מחשב, טאבלט, סמארטפון)</li>
                  <li>התוכן מסתדר אוטומטית בהתאם לגודל המסך</li>
                  <li>כפתורים ואלמנטים אינטראקטיביים גדולים מספיק למגע</li>
                  <li>ניתן להפעיל את האתר גם בתצוגה אנכית או אופקית</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  1.6 שפה וכיוון
                </h3>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-4">
                  <li>האתר מוגדר כאתר בעברית (lang=&quot;he&quot;)</li>
                  <li>כיוון הטקסט הוא מימין לשמאל (dir=&quot;rtl&quot;)</li>
                  <li>שפה ברורה ופשוטה להבנה</li>
                  <li>מונחי מפתח מוסברים במקום הצורך</li>
                </ul>
              </section>

              {/* דפדפנים וטכנולוגיות מסייעות */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. דפדפנים וטכנולוגיות נתמכים
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  האתר נבדק ונמצא נגיש בדפדפנים הבאים:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-4">
                  <li><strong>Google Chrome</strong> (גרסה 90 ומעלה)</li>
                  <li><strong>Mozilla Firefox</strong> (גרסה 88 ומעלה)</li>
                  <li><strong>Safari</strong> (גרסה 14 ומעלה)</li>
                  <li><strong>Microsoft Edge</strong> (גרסה 90 ומעלה)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
                  קוראי מסך נתמכים:
                </h3>
                <ul className="list-disc pr-6 space-y-2 text-gray-700">
                  <li><strong>NVDA</strong> (Windows)</li>
                  <li><strong>JAWS</strong> (Windows)</li>
                  <li><strong>VoiceOver</strong> (Mac, iOS)</li>
                  <li><strong>TalkBack</strong> (Android)</li>
                </ul>
              </section>

              {/* פעולות נוספות */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. פעולות נוספות לשיפור הנגישות
                </h2>
                <ul className="list-disc pr-6 space-y-2 text-gray-700">
                  <li>ביצוע בדיקות נגישות אוטומטיות ויזואליות באופן קבוע</li>
                  <li>הדרכת צוות הפיתוח בנושאי נגישות</li>
                  <li>שיפור מתמיד בהתאם למשוב מהמשתמשים</li>
                  <li>עדכון האתר בהתאם לשינויים בתקנים ובטכנולוגיות</li>
                </ul>
              </section>

              {/* מגבלות נגישות */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. מגבלות נגישות ידועות
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  למרות מאמצינו להנגיש את כל האתר, ייתכן ועדיין קיימים חלקים שטרם הונגשו במלואם:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700 mb-4">
                  <li>תמונות ישנות שהועלו לפני תחילת תהליך הנגישות עשויות להיות ללא תיאור חלופי מלא</li>
                  <li>מסמכים חיצוניים (PDF) עשויים להיות לא נגישים במלואם</li>
                  <li>שירותי צד שלישי (כמו מעבד תשלומים) עשויים להיות בשליטה חלקית שלנו</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  אנו פועלים באופן מתמיד לשיפור ולתיקון נקודות אלו.
                </p>
              </section>

              {/* משוב ובקשות */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. משוב ופניות בנושא נגישות
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  אם נתקלת בבעיית נגישות באתר, או אם יש לך הצעות לשיפור, נשמח לשמוע ממך.
                  אנו מתחייבים לטפל בכל פניה בנושא נגישות תוך זמן סביר.
                </p>

                <div className="bg-primary-light border border-primary rounded-lg p-6 mb-6">
                  <p className="text-lg font-semibold text-gray-900 mb-4">
                    רכזת הנגישות
                  </p>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>שם:</strong> YL Sport - צוות נגישות</p>
                    <p>
                      <strong>אימייל:</strong>{" "}
                      <a
                        href="mailto:ylsport1@gmail.com"
                        className="text-primary hover:underline"
                      >
                        ylsport1@gmail.com
                      </a>
                    </p>
                    <p>
                      <strong>טלפון:</strong>{" "}
                      <a href="tel:0508897290" className="text-primary hover:underline">
                        050-889-7290
                      </a>
                    </p>
                    <p><strong>שעות פעילות:</strong> ימים א׳-ה׳, 09:00-17:00</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">כיצד לפנות?</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  בפנייתך, אנא צרף את המידע הבא:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700">
                  <li>תיאור הבעיה או המכשול בנגישות שנתקלת בו</li>
                  <li>הדף או הדפים באתר בהם נתקלת בבעיה (כתובת URL)</li>
                  <li>הדפדפן והמכשיר שבו השתמשת</li>
                  <li>הטכנולוגיה המסייעת בה השתמשת (אם רלוונטי)</li>
                </ul>
              </section>

              {/* תהליך טיפול בפניות */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. תהליך טיפול בפניות נגישות
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">קבלת הפנייה</p>
                      <p className="text-gray-700 text-sm">
                        תקבל מאיתנו אישור קבלה תוך 2 ימי עסקים
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">בדיקה וניתוח</p>
                      <p className="text-gray-700 text-sm">
                        צוות הנגישות שלנו יבדוק את הבעיה וינתח אותה
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">פתרון ויישום</p>
                      <p className="text-gray-700 text-sm">
                        נפעל לתיקון הבעיה בהקדם האפשרי (עד 30 יום)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">עדכון ומעקב</p>
                      <p className="text-gray-700 text-sm">
                        נעדכן אותך על התקדמות התיקון ונוודא את שביעות רצונך
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* רישוי והתאמות */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. תקנים והתאמה
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  האתר הותאם לדרישות החוק והתקנים הבאים:
                </p>
                <ul className="list-disc pr-6 space-y-2 text-gray-700">
                  <li>
                    <strong>תקנות שוויון זכויות לאנשים עם מוגבלויות (התאמות נגישות לשירות), התשע&quot;ג-2013</strong>
                  </li>
                  <li>
                    <strong>תקן ישראלי (ת&quot;י 5568)</strong> - התאמה לרמת AA של WCAG 2.0
                  </li>
                  <li>
                    <strong>Web Content Accessibility Guidelines (WCAG) 2.0</strong> - ברמת AA
                  </li>
                </ul>
              </section>

              {/* תאריך עדכון */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. תאריך בדיקה ועדכון
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  הצהרת נגישות זו עודכנה לאחרונה ב-{new Date().toLocaleDateString("he-IL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}.
                  הבדיקה האחרונה של נגישות האתר בוצעה ב-{new Date().toLocaleDateString("he-IL", {
                    year: "numeric",
                    month: "long",
                  })}.
                </p>
              </section>

              {/* מחויבות */}
              <section className="mb-8">
                <div className="bg-gray-50 p-6 rounded-lg border-r-4 border-primary">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    המחויבות שלנו
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    ב-YL Sport אנו מאמינים בשוויון ובנגישות לכולם. אנו מחויבים להמשיך ולשפר
                    את נגישות האתר ולספק חווית קנייה נעימה ונוחה לכל לקוחותינו, ללא יוצא מן הכלל.
                    נגישות היא תהליך מתמיד, ואנו נמשיך לעבוד על שיפורים ועדכונים כדי להבטיח
                    את הנגישות המקסימלית האפשרית.
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
