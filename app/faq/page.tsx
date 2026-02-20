"use client";

import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string | JSX.Element;
}

const faqData: { category: string; items: FAQItem[] }[] = [
  {
    category: "מידות והתאמה",
    items: [
      {
        question: "איך אני יודעת איזו מידה להזמין?",
        answer: (
          <>
            <p className="mb-2">
              המידות שלנו הן סטנדרטיות ועוקבות אחר טבלת המידות הבאה:
            </p>
            <ul className="list-disc pr-4 space-y-1">
              <li>S-36: מותניים 60-65 ס&quot;מ, ירכיים 85-90 ס&quot;מ (משקל 45-55 ק&quot;ג)</li>
              <li>M-38: מותניים 66-71 ס&quot;מ, ירכיים 91-96 ס&quot;מ (משקל 56-65 ק&quot;ג)</li>
              <li>L-40: מותניים 72-77 ס&quot;מ, ירכיים 97-102 ס&quot;מ (משקל 66-75 ק&quot;ג)</li>
              <li>XL-42: מותניים 78-85 ס&quot;מ, ירכיים 103-110 ס&quot;מ (משקל 76-85 ק&quot;ג)</li>
            </ul>
            <p className="mt-2">
              מומלץ למדוד את היקף המותניים שלך ולהשוות לטבלה. במקרה של ספק בין שתי מידות, מומלץ להזמין את המידה הגדולה יותר.
            </p>
          </>
        ),
      },
      {
        question: "מה אם המידה לא מתאימה?",
        answer:
          "ניתן להחליף את המוצר במידה אחרת תוך 14 יום מקבלת המשלוח, בתנאי שהמוצר לא נעשה בו שימוש והתוויות המקוריות מחוברות. ההחלפה תתבצע ללא עלות נוספת (בכפוף למדיניות המשלוח).",
      },
      {
        question: "האם הטייץ מתאים לכל סוגי הגוף?",
        answer:
          "כן! הטייץ מעוצב בגזרה נוחה המתאימה למגוון רחב של מבני גוף. החומר האלסטי והגמיש מספק תמיכה ונוחות לכל סוגי הגוף, והגזרת High-Waist מחטבת ומחמיאה לכל אישה.",
      },
    ],
  },
  {
    category: "משלוח ואספקה",
    items: [
      {
        question: "כמה זמן לוקח המשלוח?",
        answer:
          "משלוח רגיל לוקח 3-5 ימי עסקים מרגע אישור ההזמנה. ההזמנה מעובדת תוך 24 שעות, ולאחר מכן נשלחת דרך חברת שילוח. תקבלו הודעת SMS ואימייל עם מספר מעקב ברגע שהחבילה יוצאת למשלוח.",
      },
      {
        question: "כמה עולה המשלוח?",
        answer:
          "עלות המשלוח היא 20₪ לכל רחבי הארץ. בהזמנות מעל 500₪ המשלוח חינם! ניתן גם לבחור באיסוף עצמי חינם מנקודת האיסוף שלנו באר שבע (תוך 24-48 שעות).",
      },
      {
        question: "האם ניתן לעקוב אחר המשלוח?",
        answer:
          "בהחלט! ברגע שההזמנה שלך יוצאת למשלוח, תקבלי הודעת SMS ואימייל עם מספר מעקב וקישור ישיר למעקב בזמן אמת. תוכלי לעקוב אחר המשלוח דרך אתר חברת השילוח בכל רגע.",
      },
      {
        question: "מה קורה אם המשלוח לא הגיע?",
        answer:
          "במקרה נדיר שהמשלוח לא הגיע בזמן, אנא צרי קשר איתנו מיד. נפתח חקירה עם חברת השילוח ונפתור את הבעיה במהירות. אם המשלוח אבד, נשלח מוצר חלופי או נבצע החזר מלא.",
      },
    ],
  },
  {
    category: "תשלום ורכישה",
    items: [
      {
        question: "אילו אמצעי תשלום אתם מקבלים?",
        answer:
          "אנו מקבלים את כל כרטיסי האשראי העיקריים (Visa, Mastercard, American Express, Diners, Isracard) דרך מעבד התשלומים המאובטח Cardcom. כל התשלומים מוצפנים ומאובטחים בתקן PCI-DSS. אנו לא שומרים פרטי כרטיסי אשראי במערכות שלנו.",
      },
      {
        question: "האם בטוח לשלם באתר?",
        answer:
          "בהחלט! התשלומים באתר מתבצעים דרך Cardcom, אחד ממעבדי התשלומים המובילים והמאובטחים בישראל. הדף משתמש בהצפנת SSL, וכל המידע מוצפן ומאובטח. אנו לא רואים ולא שומרים את פרטי כרטיס האשראי שלך.",
      },
      {
        question: "האם אני מקבלת חשבונית?",
        answer:
          "כן, חשבונית מס/קבלה נשלחת אוטומטית לאימייל שלך מיד לאחר אישור התשלום. ניתן גם לבקש חשבונית מס רשמית - פשוט צרי איתנו קשר עם פרטי העסק.",
      },
    ],
  },
  {
    category: "החזרות והחלפות",
    items: [
      {
        question: "מה מדיניות ההחזרה?",
        answer:
          "ניתן להחזיר או להחליף את המוצר תוך 14 יום מיום קבלת המשלוח, בהתאם לחוק הגנת הצרכן. המוצר חייב להיות במצבו המקורי, ללא שימוש, עם התוויות והאריזה המקוריות. לאחר קבלת המוצר ואישורו, החזר כספי יבוצע תוך 7-14 ימי עסקים.",
      },
      {
        question: "מי משלם על עלות ההחזרה?",
        answer:
          "אם המוצר פגום או התקבל מוצר שגוי - אנחנו נשא בעלות המשלוח. אם מדובר בהחלטת לקוחה (למשל, שינוי דעה או מידה שלא התאימה) - הלקוחה תשא בעלות המשלוח חזרה.",
      },
      {
        question: "איך מבצעים החזרה?",
        answer:
          "תהליך ההחזרה פשוט: (1) צרי קשר איתנו באימייל או טלפון, (2) נאשר את ההחזרה ונשלח הוראות משלוח, (3) ארזי את המוצר היטב ושלחי לכתובת שנמסרה, (4) לאחר קבלת המוצר ובדיקתו, נבצע החזר כספי תוך 7-14 ימים.",
      },
    ],
  },
  {
    category: "טיפול במוצר",
    items: [
      {
        question: "איך מכבסים את הטייץ?",
        answer:
          "מומלץ לכבס את הטייץ במכונת כביסה במחזור עדין, בטמפרטורה של עד 30°C. השתמשי בחומר כביסה עדין, ללא מרכך כביסה. אין לייבש במייבש - מומלץ לייבש באוויר. אין לגהץ או להשתמש בכלור.",
      },
      {
        question: "האם הטייץ עמיד לאורך זמן?",
        answer:
          "בהחלט! הטייץ עשוי מחומרים איכותיים (75% פוליאסטר, 25% ספנדקס) ותפרי Flatlock שמבטיחים עמידות גבוהה. עם טיפול נכון, הטייץ ישמור על איכותו, צבעו וגמישותו גם אחרי כביסות רבות.",
      },
      {
        question: "מה עושים אם יש פגם במוצר?",
        answer:
          "אם גילית פגם במוצר, אנא פני אלינו מיד (תוך 48 שעות מקבלת המשלוח). שלחי תמונות של הפגם, ונחליף לך את המוצר או נבצע החזר מלא - לבחירתך. כמובן שנשא בכל עלויות המשלוח.",
      },
    ],
  },
  {
    category: "שאלות נוספות",
    items: [
      {
        question: "האם יש חנות פיזית?",
        answer:
          "כרגע, YL Sport פועלת באופן מקוון בלבד. אבל ניתן לאסוף הזמנות מנקודת האיסוף שלנו באר שבע (בתיאום מראש). אם תרצי לראות את המוצר לפני הרכישה, צרי קשר ונקבע פגישה.",
      },
      {
        question: "מתי אוכל להתקשר לשירות לקוחות?",
        answer:
          "שירות הלקוחות שלנו זמין בימים א׳-ה׳, בשעות 09:00-17:00. ניתן לפנות אלינו בטלפון 050-889-7290 (יפעת) או באימייל ylsport1@gmail.com. אנו מתחייבים לענות לכל פנייה תוך 24 שעות (בימי עסקים).",
      },
      {
        question: "האם יש הנחות או קופונים?",
        answer:
          "אנו מעדכנים מעת לעת על מבצעים והנחות מיוחדות דרך הניוזלטר ורשתות החברתיות שלנו. הירשמי לניוזלטר שלנו כדי להיות הראשונה לדעת על הצעות מיוחדות!",
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              שאלות נפוצות (FAQ)
            </h1>
            <p className="text-gray-600 mb-8">
              מצאי תשובות לשאלות הנפוצות ביותר על המוצרים, המשלוחים וההחזרות שלנו
            </p>

            <div className="space-y-8">
              {faqData.map((category, catIndex) => (
                <div key={catIndex}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-primary">{catIndex + 1}.</span>
                    {category.category}
                  </h2>
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => {
                      const key = `${catIndex}-${itemIndex}`;
                      const isOpen = openItems[key];

                      return (
                        <div
                          key={itemIndex}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => toggleItem(catIndex, itemIndex)}
                            className="w-full px-6 py-4 text-right flex items-center justify-between hover:bg-gray-50 transition-colors"
                            aria-expanded={isOpen}
                          >
                            <span className="font-semibold text-gray-900 text-lg">
                              {item.question}
                            </span>
                            <svg
                              className={`w-5 h-5 text-primary transition-transform flex-shrink-0 mr-4 ${
                                isOpen ? "transform rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                              {typeof item.answer === "string" ? (
                                <p>{item.answer}</p>
                              ) : (
                                item.answer
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* עדיין לא מצאת תשובה? */}
            <div className="mt-12 bg-primary-light border border-primary rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                לא מצאת תשובה לשאלה שלך?
              </h3>
              <p className="text-gray-700 mb-6">
                צוות השירות שלנו כאן כדי לעזור! נשמח לענות על כל שאלה
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:ylsport1@gmail.com"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  שלחי אימייל
                </a>
                <a
                  href="tel:0508897290"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary border-2 border-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  התקשרי: 050-889-7290
                </a>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                שעות פעילות: ימים א׳-ה׳, 09:00-17:00
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
