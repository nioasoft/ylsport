import { Card, CardContent } from "@/components/ui/card";

export function TechnologySection() {
  return (
    <section id="technology" className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold md:text-4xl">
            <span className="text-primary">טכנולוגיית הנאופרן</span> שמשנה הכל
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            המדע מאחורי הביצועים - איך זה עובד באמת
          </p>
        </div>

        {/* Main Explanation */}
        <div className="mb-12 max-w-4xl mx-auto">
          <Card className="border-2 border-primary-light shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">מה זה נאופרן ולמה זה חשוב?</h3>
              <p className="text-base text-gray-800 leading-relaxed mb-4">
                נאופרן הוא בד טכנולוגי מתקדם שפותח במקור לצורכי צלילה, ומאז הפך למהפכה בעולם הספורט. הסוד שלו טמון ביכולת הייחודית שלו לשמר חום גוף ולייצר אפקט תרמוגני - כלומר, להגביר את טמפרטורת הגוף באזורים הספציפיים שבהם הוא נמצא.
              </p>
              <p className="text-base text-gray-800 leading-relaxed mb-4">
                כשאת מתאמנת עם טייץ מנאופרן של YL, הבד שומר על חום הגוף הטבעי שלך ומגביר את ההזעה באזור הבטן, הירכיים והרגליים. זה לא רק מרגיש טוב - זה באמת עובד.
              </p>
              <div className="bg-primary-light/40 rounded-lg p-6 mt-6">
                <p className="text-base font-semibold text-gray-900 mb-2">
                  💡 התוצאה המדעית:
                </p>
                <p className="text-sm text-gray-800 leading-relaxed">
                  שמירת חום + הזעה מוגברת = עלייה בקצב חילוף החומרים באזור, שריפת קלוריות מואצת, והפחתה זמנית בנפיחות ועודפי נוזלים. כל זה תוך כדי עיצוב וחיטוב טבעי של הגוף.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works - 3 Steps */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">איך זה עובד? 3 שלבים פשוטים</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Step 1 */}
            <Card className="border-primary-light">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                    1
                  </div>
                </div>
                <h4 className="mb-3 text-lg font-bold">שמירת חום הגוף</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  הנאופרן יוצר שכבת בידוד תרמי שמחזיקה את חום הגוף הטבעי שלך קרוב לעור, ומעלה את טמפרטורת האזור המכוסה.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-primary-light">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                    2
                  </div>
                </div>
                <h4 className="mb-3 text-lg font-bold">הגברת ההזעה</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  החום הנשמר גורם לגוף להזיע יותר באזורים אלו, מה שמסייע בפינוי רעלים, הפחתת נפיחות והקלה בשריפת קלוריות.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-primary-light">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                    3
                  </div>
                </div>
                <h4 className="mb-3 text-lg font-bold">עיצוב וחיטוב</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  הלחץ המתון והמדויק של הבד משפר את תחושת התמיכה, מעצב את הקווים הטבעיים של הגוף, ומגביר את הביטחון שלך באימון.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">יתרונות נוספים של הבד המתקדם</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="bg-gradient-to-br from-white to-primary-light/20">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">אפקט תרמוגני מיידי</h4>
                    <p className="text-sm text-gray-700">
                      מרגישה את האפקט כבר מהדקות הראשונות - חום נעים שמעורר את הגוף לפעולה
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-primary-light/20">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💧</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">ניקוז והפחתת נפיחות</h4>
                    <p className="text-sm text-gray-700">
                      ההזעה המוגברת מסייעת בפינוי נוזלים עודפים ומפחיתה תחושת נפיחות
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-primary-light/20">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">האצת חילוף החומרים</h4>
                    <p className="text-sm text-gray-700">
                      העלייה בטמפרטורה מעודדת את הגוף לשרוף קלוריות במהירות גבוהה יותר
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-primary-light/20">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">עיצוב מיידי של הגוף</h4>
                    <p className="text-sm text-gray-700">
                      הבד מספק דחיסה אחידה שמשפרת את מראה הגוף באופן מיידי
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Fabric Composition */}
        <div className="mt-12 max-w-3xl mx-auto">
          <Card className="border-primary bg-gradient-to-br from-primary-light/30 to-white">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-center mb-6">הרכב הבד המתקדם</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="text-center">
                  <div className="mb-2 text-3xl font-bold text-primary">75%</div>
                  <p className="text-sm font-semibold text-gray-900">פוליאסטר איכותי</p>
                  <p className="text-xs text-gray-700 mt-1">לעמידות, ייבוש מהיר ושמירה על צורה</p>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-3xl font-bold text-primary">25%</div>
                  <p className="text-sm font-semibold text-gray-900">ספנדקס גמיש</p>
                  <p className="text-xs text-gray-700 mt-1">למתיחה מושלמת ונוחות מקסימלית</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm font-semibold text-gray-900 mb-2">+ שכבת נאופרן פרמיום</p>
                <p className="text-xs text-gray-700">
                  מעניקה את האפקט התרמוגני הייחודי ושומרת על חום הגוף
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
