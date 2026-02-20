import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sizeData = [
  {
    size: "S-36",
    waist: "60-65",
    hips: "85-90",
    inseam: "70",
    weight: "45-55",
  },
  {
    size: "M-38",
    waist: "66-71",
    hips: "91-96",
    inseam: "72",
    weight: "56-65",
  },
  {
    size: "L-40",
    waist: "72-77",
    hips: "97-102",
    inseam: "74",
    weight: "66-75",
  },
  {
    size: "XL-42",
    waist: "78-85",
    hips: "103-110",
    inseam: "76",
    weight: "76-85",
  },
];

const fittingTips = [
  {
    icon: "📏",
    title: "איך למדוד נכון?",
    description:
      "מדדי את המותניים והירכיים בעמידה זקופה, בלי למתוח או לדחוס את המדידה.",
  },
  {
    icon: "👕",
    title: "גזרה מחמיאה",
    description:
      "הטייץ בעל גזרת High-Waist שמחטבת את המותניים ומשאירה תחושת ביטחון.",
  },
  {
    icon: "💪",
    title: "בין שתי מידות?",
    description:
      "אם את נמצאת בין שתי מידות, מומלץ לבחור במידה הגדולה יותר לנוחות מקסימלית.",
  },
  {
    icon: "🔄",
    title: "לא בטוחה?",
    description:
      "ניתן להחליף את המידה תוך 14 יום ללא עלות נוספת.",
  },
];

export function SizeGuide() {
  return (
    <section id="size-guide" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold md:text-4xl">
            מדריך <span className="text-primary">מידות</span>
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            בחרי את המידה המושלמת עבורך
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Size Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">טבלת מידות (ס&quot;מ)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-center">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                        מידה
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                        היקף מותניים
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                        היקף ירכיים
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                        אורך פנימי
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-gray-900">
                        משקל מומלץ (ק&quot;ג)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sizeData.map((row) => (
                      <tr key={row.size} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-lg font-bold text-primary">
                          {row.size}
                        </td>
                        <td className="px-4 py-4 text-gray-700">
                          {row.waist}
                        </td>
                        <td className="px-4 py-4 text-gray-700">{row.hips}</td>
                        <td className="px-4 py-4 text-gray-700">
                          {row.inseam}
                        </td>
                        <td className="px-4 py-4 text-gray-700">
                          {row.weight}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile-friendly cards for small screens */}
              <div className="md:hidden mt-6 space-y-4">
                {sizeData.map((row) => (
                  <div
                    key={row.size}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <div className="text-2xl font-bold text-primary mb-3">
                      מידה {row.size}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">היקף מותניים:</span>
                        <span className="font-medium">{row.waist} ס&quot;מ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">היקף ירכיים:</span>
                        <span className="font-medium">{row.hips} ס&quot;מ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">אורך פנימי:</span>
                        <span className="font-medium">{row.inseam} ס&quot;מ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">משקל מומלץ:</span>
                        <span className="font-medium">{row.weight} ק&quot;ג</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fitting Tips */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-center">
              טיפים לבחירת מידה
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fittingTips.map((tip, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{tip.icon}</span>
                      <div>
                        <h4 className="font-semibold mb-2">{tip.title}</h4>
                        <p className="text-sm text-gray-600">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How to Measure Guide */}
          <Card className="bg-primary-light border-primary">
            <CardContent className="p-6">
              <h4 className="font-bold text-lg mb-4">איך למדוד?</h4>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <span className="font-semibold text-primary min-w-[120px]">
                    היקף מותניים:
                  </span>
                  <span className="text-gray-700">
                    מדדי בחלק הצר ביותר של המותניים, מעל הטבור
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold text-primary min-w-[120px]">
                    היקף ירכיים:
                  </span>
                  <span className="text-gray-700">
                    מדדי בחלק הרחב ביותר של הירכיים והישבן
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold text-primary min-w-[120px]">
                    אורך פנימי:
                  </span>
                  <span className="text-gray-700">
                    מדדי מהמפשעה ועד לקרסול
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
