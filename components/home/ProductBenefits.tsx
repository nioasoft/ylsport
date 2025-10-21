import { Card, CardContent } from "@/components/ui/card";

export function ProductBenefits() {
  const benefits = [
    {
      icon: "🔥",
      title: "אפקט תרמוגני מיידי",
      description: "מרגישה את החום כבר מהדקות הראשונות של האימון",
      detail: "הנאופרן מעלה את טמפרטורת הגוף באזור הבטן והירכיים, מה שמגביר את ההזעה ומזרז את שריפת הקלוריות"
    },
    {
      icon: "✨",
      title: "עיצוב וחיטוב מיידי",
      description: "מראה משופר מרגע הלבישה",
      detail: "הדחיסה האחידה מעצבת את קווי הגוף באופן טבעי ומחמיא, תוך מתן תחושת ביטחון ותמיכה"
    },
    {
      icon: "💪",
      title: "תמיכה מקסימלית",
      description: "מרגישה יציבה ותומכת בכל תנועה",
      detail: "הבד האיכותי מספק דחיסה מתונה שמייצבת את השרירים ומפחיתה רעידות, ומאפשר לך להתמקד באימון"
    },
    {
      icon: "⚡",
      title: "האצת שריפת קלוריות",
      description: "הגוף שלך עובד קשה יותר, שורף יותר",
      detail: "השילוב של חום ודחיסה מעודד את חילוף החומרים, מה שמוביל לשריפת קלוריות מוגברת במהלך האימון ואחריו"
    }
  ];

  const activities = [
    {
      icon: "🧘‍♀️",
      title: "יוגה ופילאטיס",
      description: "גמישות מלאה לכל תנוחה",
      features: ["מתיחה רב-כיוונית", "נוחות בתנועות רצפה", "ללא החלקות"]
    },
    {
      icon: "🏃‍♀️",
      title: "ריצה וקרדיו",
      description: "תמיכה וייצוב במהלך ריצה",
      features: ["ייבוש מהיר של זיעה", "מניעת שפשופים", "נושם ומאוורר"]
    },
    {
      icon: "🏋️‍♀️",
      title: "כוח וחיטוב",
      description: "ביצועים משופרים באימוני משקולות",
      features: ["תמיכה בשרירים", "חום מוגבר לחימום", "עמידות גבוהה"]
    },
    {
      icon: "🚴‍♀️",
      title: "אימוני HIIT וקבוצתיים",
      description: "מוכנה לכל אתגר אינטנסיבי",
      features: ["התאוששות מהירה", "וסת חום", "תחושת ביטחון"]
    }
  ];

  return (
    <section id="benefits" className="bg-gradient-to-b from-primary-light to-white py-16">
      <div className="container mx-auto px-4">
        {/* Main Benefits */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">
              למה <span className="text-primary">YL Sport Tights</span>?
            </h2>
            <p className="mt-4 text-lg text-gray-700">
              4 יתרונות מרכזיים שישנו את האימונים שלך
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-2 border-primary-light hover:border-primary transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-3xl">
                        {benefit.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-base font-semibold text-primary mb-3">
                        {benefit.description}
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {benefit.detail}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommended Activities */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">
              מושלם <span className="text-primary">לכל סוג אימון</span>
            </h2>
            <p className="mt-4 text-lg text-gray-700">
              גמישות וביצועים בכל פעילות שתבחרי
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {activities.map((activity, index) => (
              <Card key={index} className="border-primary-light hover:shadow-xl transition-all bg-white">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 text-5xl">{activity.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {activity.title}
                  </h3>
                  <p className="text-sm font-medium text-primary mb-4">
                    {activity.description}
                  </p>
                  <ul className="space-y-2 text-right">
                    {activity.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Card className="border-2 border-primary bg-gradient-to-br from-primary-light to-white shadow-xl max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                מוכנה להתחיל?
              </h3>
              <p className="text-base text-gray-700 mb-6">
                הצטרפי לאלפי נשים שכבר שדרגו את האימונים שלהן עם YL Sport Tights
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-primary text-lg">✓</span>
                  <span>משלוח מהיר לכל הארץ</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-primary text-lg">✓</span>
                  <span>החזרה חינם עד 14 יום</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-primary text-lg">✓</span>
                  <span>תשלום מאובטח 100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
