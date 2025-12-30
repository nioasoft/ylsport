import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export function FounderStory() {
  return (
    <section id="about" className="bg-gradient-to-b from-white to-primary-light py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Column 1: Product Image & Details */}
          <div className="flex flex-col space-y-6">
            {/* Product Headline */}
            <div className="text-center">
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
                <span className="text-sm text-gray-600 mr-2 flex items-center">(4.9/5 מתוך 2,400+ לקוחות)</span>
              </div>
              <h2 className="text-3xl font-bold md:text-4xl text-primary mb-2 leading-tight">
                נמאס לך מטייץ שמחליק באימון?
              </h2>
              <p className="text-xl md:text-2xl font-semibold text-gray-800">
                הכירי את הטייץ שאוסף, מחטב ונשאר איתך בכל תנועה
              </p>
            </div>
            {/* Product Video - Larger (Increased height by 20%) */}
            <div className="relative h-[600px] lg:h-[720px] w-full overflow-hidden rounded-2xl shadow-2xl bg-black">
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                muted
                loop
                playsInline
                poster="/images/product1.webp"
              >
                <source src="/video/model_video.mp4" type="video/mp4" />
                הדפדפן שלך לא תומך בנגן וידאו.
              </video>
            </div>

            {/* Expanded Product Information */}
            <Card className="border-primary bg-gradient-to-br from-primary-light to-white shadow-lg">
              <CardContent className="p-8">
                <h3 className="mb-6 text-2xl font-bold text-gray-900 text-center">
                  הטייץ שישנה את האימונים שלך
                </h3>

                <div className="space-y-6">
                  {/* Main Description */}
                  <div className="text-center">
                    <p className="text-base text-gray-700 leading-relaxed">
                      טייץ ספורט מהפכני עם טכנולוגיית נאופרן מתקדמת, שתוכנן במיוחד לנשים שרוצות תוצאות אמיתיות.
                      הטייץ משלב בין נוחות מקסימלית לביצועים מקצועיים, ומספק תמיכה מושלמת לכל סוג אימון.
                    </p>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl">
                          🔥
                        </div>
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900 mb-1 text-lg">
                          טכנולוגיית נאופרן מתקדמת
                        </h5>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          שכבת נאופרן ייחודית ששומרת על חום הגוף ומגבירה הזעה באזורים הנכונים - בטן, ירכיים ועכוז.
                          התוצאה? שריפת קלוריות מוגברת ותחושת חימום מיידית שמאפשרת אימון אפקטיבי יותר.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl">
                          ⚡
                        </div>
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900 mb-1 text-lg">
                          עיצוב הגוף מרגע הלבישה
                        </h5>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          תפרים ייחודיים ועיצוב אנטומי שמחטב את הגוף באופן מיידי. את מרגישה יפה וחטובה כבר
                          ברגע הלבישה, מה שמעניק ביטחון עצום ומוטיבציה להתאמן.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl">
                          💪
                        </div>
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900 mb-1 text-lg">
                          נוחות מקסימלית לכל סוג אימון
                        </h5>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          בד נושם ואלסטי במיוחד שמתאים לכל תנועה - יוגה, פילאטיס, ריצה, חיטוב או כושר.
                          לא מחליק, לא לוחץ, ומספק תמיכה מושלמת בכל תנוחה.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white text-xl">
                          ✨
                        </div>
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900 mb-1 text-lg">
                          איכות פרימיום ועמידות לאורך זמן
                        </h5>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          חומרים איכותיים ותפרים חזקים שמבטיחים שהטייץ ישמור על המראה והביצועים שלו גם אחרי
                          עשרות כביסות. השקעה חכמה שמשתלמת לטווח הארוך.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="mt-6 p-4 bg-white rounded-lg border-2 border-primary">
                    <p className="text-center font-semibold text-gray-900">
                      ✓ משלוח מהיר לכל הארץ | ✓ החלפה והחזרה בקלות | ✓ תמיכה אישית
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 2: Yifat's Story - Single Column */}
          <div className="flex flex-col space-y-6">
            {/* Yifat Heading */}
            <div className="text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                פגשו את <span className="text-primary">יפעת לוי</span>
              </h2>
              <p className="mt-4 text-lg text-gray-700">
                המייסדת והכוח המניע מאחורי YL Sport
              </p>
            </div>

            {/* Mission - First */}
            <div>
              <h4 className="mb-3 text-2xl font-bold text-gray-900">המשימה שלנו</h4>
              <p className="text-base text-gray-700 leading-relaxed">
                להעצים כל אישה להרגיש חזקה, יפה ובטוחה בעצמה - בכל אימון, בכל יום. אנחנו מאמינים שביגוד ספורט איכותי הוא לא רק על מראה, אלא על תחושה - תחושה שמאפשרת לך להתמקד במה שחשוב באמת: ההתקדמות שלך.
              </p>
            </div>

            {/* Inspirational Quote - Second */}
            <Card className="border-secondary bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <span className="text-4xl text-primary">&quot;</span>
                  <div>
                    <p className="text-base italic text-gray-700 leading-relaxed">
                      כל אישה מגיעה להרגיש בנוח ויפה באימון. יצרתי את YL כדי לתת לך את הביטחון לכבוש כל אתגר.
                    </p>
                    <p className="mt-3 text-sm font-semibold text-primary">
                      - יפעת לוי
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Yifat's Photo - Vertical */}
            <div className="relative h-[600px] w-full overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/images/yifat_photo.webp"
                alt="יפעת לוי - מייסדת YL Sport"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Story and Credentials - Parallel Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Story Column */}
              <div>
                <h3 className="mb-3 text-2xl font-bold">הסיפור שלי</h3>
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  אחרי יותר מ-10 שנים כמאמנת כושר אישית ומדריכת פילאטיס, ראיתי מאות נשים נאבקות למצוא ביגוד ספורט שבאמת עובד עבורן.
                </p>
                <p className="text-base text-gray-700 leading-relaxed">
                  זה המקום שבו נולד YL Sport - מתוך הרצון לספק פתרון אמיתי לנשים שרוצות להרגיש בטוחות, נוחות, ומוכנות לכל אימון.
                </p>
              </div>

              {/* Credentials Column */}
              <Card className="border-secondary bg-secondary-light">
                <CardContent className="p-4">
                  <h4 className="mb-3 text-lg font-bold text-gray-900">הניסיון המקצועי שלי</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-primary">✓</span>
                      <span className="text-sm text-gray-800">
                        10+ שנות ניסיון כמאמנת כושר אישית מוסמכת
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-primary">✓</span>
                      <span className="text-sm text-gray-800">
                        מדריכת פילאטיס מוסמכת עם התמחות באימוני נשים
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-primary">✓</span>
                      <span className="text-sm text-gray-800">
                        ליווי מאות לקוחות להשגת מטרות הכושר שלהן
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-primary">✓</span>
                      <span className="text-sm text-gray-800">
                        מומחית בפיתוח תוכניות אימונים מותאמות אישית
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Core Values - Sixth */}
            <div>
              <h4 className="mb-4 text-2xl font-bold text-gray-900">הערכים שלנו</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-secondary p-4 shadow-sm">
                  <div className="mb-2 text-2xl">💪</div>
                  <h5 className="text-sm font-semibold text-gray-900">איכות ללא פשרות</h5>
                  <p className="text-xs text-gray-600 mt-1">
                    רק חומרים מהשורה הראשונה ועיצוב מוקפד
                  </p>
                </div>
                <div className="rounded-lg bg-secondary p-4 shadow-sm">
                  <div className="mb-2 text-2xl">❤️</div>
                  <h5 className="text-sm font-semibold text-gray-900">תשומת לב אישית</h5>
                  <p className="text-xs text-gray-600 mt-1">
                    כל לקוחה מקבלת ליווי וייעוץ מקצועי
                  </p>
                </div>
                <div className="rounded-lg bg-secondary p-4 shadow-sm">
                  <div className="mb-2 text-2xl">✨</div>
                  <h5 className="text-sm font-semibold text-gray-900">העצמה נשית</h5>
                  <p className="text-xs text-gray-600 mt-1">
                    מעודדות נשים להרגיש חזקות ובטוחות
                  </p>
                </div>
                <div className="rounded-lg bg-secondary p-4 shadow-sm">
                  <div className="mb-2 text-2xl">🌟</div>
                  <h5 className="text-sm font-semibold text-gray-900">שקיפות ואמינות</h5>
                  <p className="text-xs text-gray-600 mt-1">
                    תמיד כנים לגבי המוצר והתוצאות
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
