# Spec: נראות תשלומים שנכשלו / ננטשו (Failed & Abandoned Payment Visibility)

**תאריך:** 2026-05-29
**מצב:** מאושר לעיצוב, ממתין ל-implementation plan
**ספק תשלומים:** Tranzila (terminal `ofer3001`)

---

## 1. רקע ובעיה

האדמין רוצה לראות בדאשבורד אילו עסקאות נכשלות/ננטשות ומדוע. חקירה של הדאטהבייס וה-API של Tranzila העלתה שלוש עובדות מכריעות:

1. **כשלי סליקה אמיתיים נרשמים** — כאשר Tranzila שולח callback עם `Response != "000"`, ה-handler מסמן את ההזמנה `CANCELLED` + `paymentStatus: FAILED` ושומר סיבה ב-`cancellationReason` (`app/api/payment/tranzila-callback/route.ts:150-161`). זה מה שקרה בהזמנות פברואר (#004–#007).

2. **נטישות לא נרשמות — וגרוע מכך, נמחקות.** כשלקוח פותח דף תשלום ולא משלים (כמו #015/#016 של היום), Tranzila לא שולח callback מוצלח. ההזמנה נתקעת ב-`PENDING_PAYMENT`. בנוסף, `app/api/cron/cleanup-orders/route.ts` רץ כל שעה ו**מוחק לצמיתות** הזמנות `PENDING_PAYMENT` בנות יותר משעתיים. כלומר הנתון שהאדמין רוצה לראות נהרס באופן אקטיבי.

3. **לרוב אין "סיבת דחייה" לשלוף עבור נטישות.** משיכה אמיתית מ-`POST /v1/transactions` (Reports API) הראתה שלעסקאות הננטשות אין כלל רשומה אצל Tranzila — הסליקה מעולם לא בוצעה. לכן אין מקור לסיבה; מדובר בנטישה, לא בדחייה.

**ממצא לוואי:** הדוח חשף 2 עסקאות מוצלחות בסך ₪229 שבוצעו ידנית בטרמינל (`txn_type: FORCE`) ואינן קיימות בדאטהבייס — כסף שנכנס בלי הזמנה, חשבונית, מלאי או מייל.

## 2. מטרות

1. **לשמר** הזמנות ננטשות במקום למחוק אותן.
2. **להציג** באדמין הזמנות שנכשלו ושננטשו, עם הסיבה כאשר קיימת.
3. **להצליב** מול Tranzila ביוזמת האדמין, כדי לחשוף תשלומים שלא שויכו (callback שפוספס + חיובים ידניים).

### Non-Goals (YAGNI)
- אין עדכון אוטומטי של `PENDING_PAYMENT → PAID` מתוך הסנכרון (מפעיל side-effects רגישים: מלאי, חשבונית, מיילים, CAPI). יוצג כהמלצה בלבד.
- אין ניסיון לשלוף "סיבת דחייה" לכל נטישה — הוכח שלרוב אין רשומה ב-Tranzila.
- אין טיהור אוטומטי של ABANDONED. נשמרות לנצח (נפח זניח). אם בעתיד יידרש — job נפרד.

## 3. החלטות עיצוב (מאושרות)

| החלטה | בחירה |
|---|---|
| טריגר הצלבה מול Tranzila | כפתור ידני באדמין (read-only) |
| טיפול בתקועות PENDING_PAYMENT | סטטוס חדש `ABANDONED` + תצוגה |
| חיובים ידניים (FORCE) לא משויכים | להתריע עליהם בדוח ההצלבה |
| מיקום באדמין | פילטר בטבלת ההזמנות הקיימת + כרטיסיית סיכום |
| שימור ABANDONED | לנצח (ללא טיהור) |

## 4. ארכיטקטורה ורכיבים

### 4.1 סכמה — `OrderStatus`
הוספת ערך `ABANDONED` ל-enum `OrderStatus` ב-`prisma/schema.prisma`:
```
ABANDONED  // Order created, never paid, expired (replaces hard-delete)
```
מיגרציית Prisma (`npx prisma migrate dev --name add_abandoned_status`). אין שינוי בעמודות קיימות — תוספת ערך enum בלבד.

### 4.2 Cron — שימור במקום מחיקה
`app/api/cron/cleanup-orders/route.ts`:
- **לפני:** `orderItem.deleteMany` + `order.deleteMany` על `PENDING_PAYMENT` > שעתיים.
- **אחרי:** `order.updateMany({ where: { status: "PENDING_PAYMENT", createdAt: { lt: twoHoursAgo } }, data: { status: "ABANDONED" } })`.
- אין מחיקת `OrderItem` — נשמרים לתיעוד.
- אימות `CRON_SECRET` ומבנה התגובה נשארים. מתעדכן שם הלוג והודעת התגובה (`abandoned` במקום `deleted`).
- חוזה הזמן (שעתיים) נשמר כדי לא לשנות התנהגות שלא לצורך.

### 4.3 Tranzila SDK — `getTransactions`
מתודה חדשה ב-`lib/tranzila.ts` בתוך `TranzilaSDK`:
```ts
async getTransactions(startDate: string, endDate: string): Promise<TranzilaTransactionsResult>
```
- POST ל-`${apiHost}/v1/transactions` עם `generateAuthHeaders()` הקיים (HMAC-SHA256 — אומת בחקירה).
- Body: `{ terminal_name, transaction_start_date, transaction_end_date }` (פורמט `YYYY-MM-DD`).
- מחזיר מערך עסקאות מנורמל. שדות רלוונטיים מהתגובה הגולמית:
  - `index`, `transaction_date`, `transaction_time`, `amount` (באגורות → `/100`), `processor_response_code` (`"000"` = הצלחה), `txn_type` (`FORCE` = ידני), `card_description`.
  - `user_defined_1` = שם, `user_defined_3` = email, `user_defined_5` = phone (פורמט `972…`).
- טיפול שגיאות: סטטוס HTTP לא 200 / JSON לא תקין → `{ success: false, error }` + לוג אנגלית.
- טייפים חדשים: `TranzilaTransaction`, `TranzilaTransactionsResult`.

### 4.4 Endpoint הצלבה — `app/api/admin/reconcile/route.ts` (חדש)
- `POST` (או `GET` עם query) — מאומת ב-`getAdminSession()` כמו שאר ה-admin APIs. החזרת 401 ללא session.
- פרמטרים: `dateFrom`, `dateTo` (ברירת מחדל: 7 הימים האחרונים).
- שלבים:
  1. שליפת עסקאות מ-Tranzila (`getTransactions`).
  2. שליפת הזמנות מה-DB בטווח התאריכים.
  3. הצלבה לפי **מפתח התאמה**: `email (case-insensitive)` + `amount (שווה)` + `חלון תאריך ±1 יום`. (אין `pr_id` בדוח, ולכן הצלבה הוריסטית. חלון התאריך מונע התאמה שגויה של חיוב חדש ללקוח חוזר.)
- פלט — 3 דליים (read-only, ללא כתיבה ל-DB):
  - `matched`: עסקה מוצלחת ↔ הזמנה `PAID`/`PROCESSING`/`SHIPPED`/`DELIVERED`.
  - `paymentFoundNotPaid`: עסקה מוצלחת ↔ הזמנה שאינה משולמת (callback שפוספס) → מועמדת לשחזור ידני. כולל `orderNumber` + פרטי העסקה.
  - `unmatchedCharges`: עסקה מוצלחת ב-Tranzila בלי הזמנה תואמת (חיוב ידני/FORCE) → כסף בלי תיעוד.
- מבנה תגובה לפי `ApiResponse<T>` המקובל בפרויקט.

### 4.5 תצוגה באדמין — `app/admin/page.tsx`
- **דרופדאון סינון:** הוספת `ABANDONED` (וגם `CANCELLED` אם חסר) לאפשרויות. ה-API (`app/api/orders/route.ts`) כבר מסנן לפי `status`, אז אין שינוי שרת.
- **תווית סטטוס:** `getStatusText`/`getStatusColor` ב-`lib/utils.ts` — הוספת `ABANDONED: "ננטש / לא הושלם"` + צבע (אפור/כתום מובחן מ-CANCELLED האדום).
- **סיבה:** הרחבת התנאי בשורות 713-714 ו-1083-1086 כך שיציג `cancellationReason` גם ל-`ABANDONED` (לרוב יהיה ריק → "ננטש לפני תשלום").
- **כפתור סנכרון:** כפתור "סנכרן מול Tranzila" שקורא ל-`/api/admin/reconcile` ומציג את 3 הדליים במודאל/אזור ייעודי, עם מצבי loading/error/empty בעברית.
- **כרטיסיית סיכום:** הרחבת `app/api/admin/stats` להחזיר ספירות לפי סטטוס (הושלמו / ננטשו / בוטלו-נכשלו) והצגתן למעלה.

## 5. זרימת נתונים

```
לקוח ממלא טופס → Order(PENDING_PAYMENT) + pr_id → דף Tranzila
   ├─ שילם → callback(000) → PAID (+ מלאי/חשבונית/מיילים)
   ├─ נדחה → callback(≠000) → CANCELLED/FAILED + cancellationReason
   └─ נטש → אין callback → נשאר PENDING_PAYMENT
                              └─ cron (>2h) → ABANDONED   [שינוי: לא מחיקה]

אדמין לוחץ "סנכרן" → getTransactions(7d) → הצלבה מול DB
   → matched / paymentFoundNotPaid / unmatchedCharges  (דוח read-only)
```

## 6. טיפול בשגיאות
- כל ה-endpoints: try/catch, לוג אנגלית מפורט בצד שרת, הודעת משתמש בעברית.
- כשל קריאה ל-Tranzila: הדוח מציג שגיאה ידידותית ("שליפת הנתונים מ-Tranzila נכשלה, נסה שוב") ולא קורס.
- ה-cron: שומר על מבנה התגובה הקיים; כשל לא מפיל את שאר ה-job.

## 7. בדיקות
- **Unit:** מפתח ההתאמה בהצלבה (email+amount+חלון תאריך) — התאמה נכונה, אי-התאמה ללקוח חוזר עם תאריך שונה, חיוב לא משויך.
- **Unit:** נרמול תגובת `getTransactions` (אגורות→שקלים, זיהוי `000`, זיהוי FORCE).
- **Integration:** ה-cron מסמן ABANDONED ולא מוחק; שומר OrderItem.
- **Integration:** `/api/admin/reconcile` דורש session; מחזיר 3 דליים נכונים על נתוני mock.
- **ידני:** הרצת הסנכרון על הנתונים האמיתיים (#015/#016 → abandoned; 2 חיובי FORCE → unmatchedCharges).

## 8. קבצים מושפעים
| קובץ | שינוי |
|---|---|
| `prisma/schema.prisma` | + `ABANDONED` ל-`OrderStatus` (+ מיגרציה) |
| `app/api/cron/cleanup-orders/route.ts` | מחיקה → סימון ABANDONED |
| `lib/tranzila.ts` | + `getTransactions()` + טייפים |
| `app/api/admin/reconcile/route.ts` | **חדש** — endpoint הצלבה |
| `app/api/admin/stats/route.ts` | + ספירות לפי סטטוס |
| `lib/utils.ts` | + תווית/צבע ל-ABANDONED |
| `app/admin/page.tsx` | פילטר + כפתור סנכרון + תצוגת דוח + סיכום |

## 9. סיכונים
- **שינוי התנהגות cron:** מפסיק למחוק. מכוון ומאושר. תופעת לוואי: ABANDONED יצטברו (זניח).
- **הצלבה הוריסטית:** ללא `pr_id` בדוח, התאמה לפי email+amount+תאריך עלולה לפספס/לטעות בקצוות (אותו לקוח, אותו סכום, אותו יום, פעמיים). מקובל כי הדוח read-only ולא משנה DB.
- **`order_id` בדוח:** אם יתברר ש-`/v1/transactions` כן מחזיר את ה-`order_id` שנשלח ב-`pr/create` (באחד מ-`user_defined`), נשדרג את מפתח ההתאמה למדויק. ייבדק בשלב ה-implementation.
