"use client";

import { useState, useEffect } from "react";
import CookieConsent from "react-cookie-consent";
import Link from "next/link";

export function CookieBanner() {
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // תמיד מסומן ולא ניתן לשנות
    analytics: false,
    marketing: false,
  });

  // טעינת העדפות מ-localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem("cookiePreferences");
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  // שמירת העדפות ל-localStorage
  const savePreferences = () => {
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    setShowPreferences(false);

    // אם המשתמש אישר Analytics, ניתן להפעיל Google Analytics
    if (preferences.analytics && typeof window !== "undefined") {
      // @ts-ignore
      if (window.gtag) {
        // @ts-ignore
        window.gtag("consent", "update", {
          analytics_storage: "granted",
        });
      }
    }

    // אם המשתמש אישר Marketing, ניתן להפעיל Facebook Pixel וכו'
    if (preferences.marketing && typeof window !== "undefined") {
      // @ts-ignore
      if (window.fbq) {
        // @ts-ignore
        window.fbq("consent", "grant");
      }
    }
  };

  // קבלת כל העוגיות
  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem("cookiePreferences", JSON.stringify(allAccepted));

    // הפעלת כל השירותים
    if (typeof window !== "undefined") {
      // @ts-ignore
      if (window.gtag) {
        // @ts-ignore
        window.gtag("consent", "update", {
          analytics_storage: "granted",
        });
      }
      // @ts-ignore
      if (window.fbq) {
        // @ts-ignore
        window.fbq("consent", "grant");
      }
    }
  };

  // דחיית כל העוגיות (מלבד חיוניות)
  const rejectAll = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(essentialOnly);
    localStorage.setItem("cookiePreferences", JSON.stringify(essentialOnly));
  };

  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="אני מסכים"
        declineButtonText="ניהול העדפות"
        enableDeclineButton
        onAccept={acceptAll}
        onDecline={() => setShowPreferences(true)}
        cookieName="YLSportCookieConsent"
        expires={365}
        overlay={false}
        containerClasses="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-primary shadow-lg"
        contentClasses="container mx-auto px-4 py-4 md:py-6"
        buttonWrapperClasses="flex gap-3 mt-4 md:mt-0"
        buttonClasses="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm md:text-base whitespace-nowrap"
        declineButtonClasses="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm md:text-base whitespace-nowrap border border-gray-300"
        style={{
          background: "white",
          color: "#1f2937",
          padding: "0",
        }}
        buttonStyle={{
          background: "#e87f93",
          color: "white",
          fontSize: "16px",
          borderRadius: "8px",
          padding: "10px 24px",
          margin: "0",
        }}
        declineButtonStyle={{
          background: "#f3f4f6",
          color: "#374151",
          fontSize: "16px",
          borderRadius: "8px",
          padding: "10px 24px",
          margin: "0",
          border: "1px solid #d1d5db",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              🍪 אנו משתמשים בעוגיות
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              אנו משתמשים בעוגיות (Cookies) כדי לשפר את חווית הגלישה שלך, לנתח תנועה באתר
              ולהציג תוכן רלוונטי. על ידי לחיצה על &quot;אני מסכים&quot;, אתה מאשר את השימוש
              בכל העוגיות.{" "}
              <Link href="/privacy" className="text-primary underline hover:no-underline">
                קרא עוד במדיניות הפרטיות
              </Link>
            </p>
          </div>
        </div>
      </CookieConsent>

      {/* מודל לניהול העדפות */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">העדפות עוגיות</h2>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="סגור"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                אנו משתמשים בעוגיות כדי לשפר את חווית הגלישה שלך. אתה יכול לבחור אילו
                סוגי עוגיות לאשר.
              </p>

              <div className="space-y-4">
                {/* עוגיות חיוניות */}
                <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-lg">🔒</span>
                        עוגיות חיוניות
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        עוגיות אלו הכרחיות לתפעול האתר ואינן ניתנות לביטול. הן משמשות
                        לאבטחה, אימות משתמש וניהול העדפות בסיסיות.
                      </p>
                    </div>
                    <div className="mr-4">
                      <input
                        type="checkbox"
                        checked={preferences.essential}
                        disabled
                        className="w-5 h-5 text-primary rounded focus:ring-primary cursor-not-allowed opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* עוגיות אנליטיות */}
                <div className="border border-gray-200 rounded-lg p-5 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-lg">📊</span>
                        עוגיות אנליטיות
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        עוגיות אלו עוזרות לנו להבין כיצד מבקרים משתמשים באתר, כדי שנוכל
                        לשפר את הביצועים וחווית המשתמש. אנו משתמשים ב-Google Analytics.
                      </p>
                    </div>
                    <div className="mr-4">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          setPreferences({ ...preferences, analytics: e.target.checked })
                        }
                        className="w-5 h-5 text-primary rounded focus:ring-primary cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* עוגיות שיווקיות */}
                <div className="border border-gray-200 rounded-lg p-5 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-lg">🎯</span>
                        עוגיות שיווקיות
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        עוגיות אלו משמשות להצגת פרסומות רלוונטיות ומותאמות אישית.
                        הן עוזרות לנו למדוד את יעילות הקמפיינים השיווקיים שלנו.
                      </p>
                    </div>
                    <div className="mr-4">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) =>
                          setPreferences({ ...preferences, marketing: e.target.checked })
                        }
                        className="w-5 h-5 text-primary rounded focus:ring-primary cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* כפתורי פעולה */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  onClick={savePreferences}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  שמור העדפות
                </button>
                <button
                  onClick={() => {
                    acceptAll();
                    setShowPreferences(false);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors border border-gray-300"
                >
                  אשר הכל
                </button>
                <button
                  onClick={() => {
                    rejectAll();
                    setShowPreferences(false);
                  }}
                  className="flex-1 bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-gray-300"
                >
                  דחה הכל
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-6">
                ניתן לשנות את ההעדפות שלך בכל עת דרך{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  מדיניות הפרטיות
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
