<!--
Sync Impact Report - Constitution Update
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Version Change: 1.0.0 → 2.0.0

Modified Principles (Complete Redesign):
- REMOVED: I. Modular Architecture
- REMOVED: II. Test-First Development
- REMOVED: III. API-First Design
- REMOVED: IV. Code Quality & Maintainability
- REMOVED: V. Security & Data Privacy
- NEW: 1. פשטות ומיקוד (Simplicity & Focus)
- NEW: 2. ביצועים ונגישות (Performance & Accessibility)
- NEW: 3. אמינות ומקצועיות (Trust & Professionalism)
- NEW: 4. חוויית משתמש מעולה (Excellent UX)

Added Sections:
- מטרת הפרויקט (Project Purpose)
- סטנדרטים טכניים (Technical Standards)
- חוקי עיצוב (Design Rules)
- תהליכי עבודה (Workflows)
- הגנת פרטיות ואבטחה (Privacy & Security)
- תיעוד (Documentation)
- מדדי הצלחה (Success Metrics)
- עדיפויות בפיתוח (Development Priorities)

Removed Sections:
- E-Commerce Specific Standards (replaced with product-specific standards)
- Development Workflow (replaced with תהליכי עבודה)
- Generic governance (replaced with product-focused governance)

Templates Requiring Updates:
⚠ plan-template.md - Needs complete Constitution Check rewrite for single-product focus
⚠ spec-template.md - May need simplification to match single-product philosophy
⚠ tasks-template.md - Testing approach changed from strict TDD to critical-path testing

Follow-up TODOs: None

Rationale for v2.0.0 (MAJOR):
- BREAKING: Complete philosophical shift from modular e-commerce platform to single-product site
- BREAKING: Removed strict TDD requirement in favor of critical-path testing
- BREAKING: Removed modular architecture requirement in favor of simplicity
- BREAKING: Changed from generic e-commerce to YL Sport Tights specific product
- Project redefined: Generic sports e-commerce → Single product sales site for YL tights
- Primary language changed to Hebrew (customer-facing market in Israel)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-->

# חוקת פרויקט YL Sport Tights

## מטרת הפרויקט

בניית אתר מכירה ממוקד ומקצועי למוצר יחיד - טייץ ספורט מיוחד של YL, המיועד לנשים
המחפשות פתרון איכותי לשריפת קלוריות מוגברת ושיפור מראה הגוף במהלך האימונים.

## עקרונות יסוד

### 1. פשטות ומיקוד (Simplicity & Focus)

**מוצר יחיד, חוויה מושלמת**: כל האתר מתמקד במוצר אחד בלבד.

**חוקים שאינם ניתנים למשא ומתן**:
- אין דיסטרקציות - המוצר היחיד במרכז תמיד
- אין עומס מידע מיותר - רק מה שנדרש להחלטת רכישה
- UI נקי וברור - עיצוב מינימליסטי שמדגיש את המוצר, לא את הטכנולוגיה
- Zero Configuration - תהליך הרכישה MUST להיות אינטואיטיבי וזורם ללא צורך בהחלטות
מורכבות
- אין over-engineering - רק מה שצריך, אין תכנון מוקדם למוצרים עתיdiים

**נימוק**: אתר מוצר יחיד מצליח כאשר הוא מפחית חיכוך לאפס. כל אלמנט מיותר מקטין
המרה. המיקוד הצר מאפשר אופטימיזציה מושלמת של חווית הרכישה למוצר הספציפי הזה.

### 2. ביצועים ונגישות (Performance & Accessibility)

מהירות וזמינות הן פיצ'רים קריטיים, לא nice-to-have.

**חוקים שאינם ניתנים למשא ומתן**:
- זמן טעינה ראשוני MUST להיות מתחת ל-2 שניות
- SEO MUST להיות מובנה מהרגע הראשון (structured data, meta tags, sitemap)
- נגישות MUST לעמוד ב-WCAG 2.1 רמת AA - כל אישה תוכל לרכוש בנוחות
- מובייל קודם MUST - העיצוב והפיתוח מתחילים ממובייל ועולים למסך רחב
- ציון Lighthouse MUST להיות מעל 90 בכל הקטגוריות (Performance, Accessibility, Best
Practices, SEO)
- תאימות MUST ל-95% מהדפדפנים (כולל Safari iOS, Chrome Android)

**נימוק**: רוב הלקוחות גולשות ממובייל בזמן אימון או בדרך. טעינה איטית = נטישה מיידית.
נגישות אינה רק חובה חוקית - היא מרחיבה את קהל היעד ומשפרת UX לכולן.

### 3. אמינות ומקצועיות (Trust & Professionalism)

אמון הוא תנאי הכרחי לרכישה מקוונת. בניית אמון MUST להיות מובנית בכל אלמנט.

**חוקים שאינם ניתנים למשא ומתן**:
- שקיפות מלאה MUST - מחיר סופי ברור, תנאי משלוח מפורשים, מדיניות החזרות נגישה
- אבטחת מידע MUST - טיפול מאובטח בנתוני לקוחות ובפרטי תשלום (HTTPS בלבד, PCI
compliance)
- אין אחסון פרטי כרטיס MUST - כל התשלומים דרך Cardcom (מעבד תשלומים מאושר)
- המלצות לקוחות MUST להיראות אותנטיות ומהימנות (תמונות אמיתיות, שמות, עיר)
- ייצוג ישיר MUST - המוצר מוצג על ידי המאמנת שיצרה אותו (יפעת לוי)
- תמונות מוצר MUST להיות איכותיות ומייצגות (6 תמונות מינימום, זוויות שונות)
- מידע קשר MUST להיות גלוי ונגיש (טלפון, אימייל, רשתות חברתיות)

**נימוק**: לקוחות קונות מאנשים, לא מאתרים. המוצר נמכר על ידי מאמנת אמיתית לקהל שלה.
אמינות נבנית דרך שקיפות, הוכחה חברתית, ונגישות אישית. כל אלמנט שמעלה ספק מפחית
המרה.

### 4. חוויית משתמש מעולה (Excellent UX)

UX מושלם אינו מקרי - הוא תוצר של תכנון מדוקדק ומשוב מתמיד.

**חוקים שאינם ניתנים למשא ומתן**:
- סיפור מרתק MUST - האתר מספר מסע: בעיה → פיתרון → המלצות → קריאה לפעולה
- תמונות איכותיות MUST - 6 תמונות מינימום, רזולוציה גבוהה, אופטימיזציה לווב
- קריאה לפעולה MUST להיות בולטת וזמינה תמיד (כפתור "הוסף לעגלה" sticky)
- משוב מיידי MUST - כל פעולה מקבלת משוב ויזואלי ברור תוך 100ms
- טפסים MUST להיות פשוטים (מינימום שדות, validation בזמן אמת, הודעות שגיאה ברורות)
- תהליך רכישה MUST להסתיים תוך 3 דקות ממוצע
- אישור הזמנה MUST להישלח תוך דקה (אימייל + SMS אם זמין)

**נימוק**: UX טוב הוא ההבדל בין "חשבתי על זה" ל"קניתי". כל חיכוך, כל שאלה לא
נענית, כל המתנה - מזמנים הזדמנות לנטישה. חוויה מושלמת = המרה גבוהה.

## סטנדרטים טכניים

### קוד נקי וקריא (Clean Code)

- שמות משתנים MUST להיות תיאוריים (עברית או אנגלית עקבית לאורך הפרויקט)
- פונקציות MUST להיות קצרות עם אחריות יחידה (Single Responsibility Principle)
- הערות רק כשהקוד לא מדבר בעצמו MUST
- עקביות בסגנון הקוד MUST (Prettier/ESLint configured and enforced)
- Dead code MUST להימחק מיידית
- קוד MUST לעבור linting ללא warnings לפני commit

### ארכיטקטורה פשוטה (Simple Architecture)

- מבנה תיקיות MUST להיות אינטואיטיבי וסטנדרטי (Next.js App Router convention)
- הפרדה ברורה MUST: UI components, business logic, data/API layer
- רכיבים MUST להיות קטנים וניתנים לשימוש חוזר
- אין over-engineering MUST - רק מה שצריך עכשיו, לא "אולי נצטרך"
- תלויות חיצוניות MUST להיות מינימום (shadcn/ui מועדף על ספריות כבדות)
- כל abstraction MUST להיות מוצדקת בשימוש ממשי

### בדיקות (Testing)

**הערה**: בניגוד לפרויקטים מורכבים, כאן נדרש testing ממוקד, לא TDD מלא.

- בדיקות קריטיות MUST: תהליך רכישה מלא (checkout flow end-to-end)
- בדיקות טפסים MUST: validation, error handling, submission
- בדיקות אינטגרציה MUST: Cardcom payment flow (sandbox mode)
- בדיקות responsive MUST: כל המכשירים הנפוצים (iPhone, Android, Desktop)
- בדיקות ידניות MUST לפני כל deploy לפרודקשן
- Smoke tests אוטומטיים SHOULD רוץ ב-CI/CD

**אין צורך ב**:
- Unit tests לכל פונקציה (רק לlogic קריטי)
- 100% code coverage (רק critical paths)
- TDD strict (tests can follow implementation for simple components)

### ניהול תלויות (Dependencies)

- מינימום תלויות MUST - שאל "האם באמת צריך?" לפני הוספה
- shadcn/ui MUST לקומפוננטות UI (copy-paste, לא dependency כבדה)
- עדכון תלויות MUST באופן קבוע (monthly security updates)
- תיעוד גרסאות MUST להיות ברור (package.json lockfile committed)
- כל dependency MUST להיבדק לפני הוספה (bundle size, maintenance, alternatives)

## חוקי עיצוב

### צבעים (Colors)

**פלטת צבעים מחייבת**:
- **צבע ראשי**: `#F7D2D9` (ורוד עדין) וגווניו
- **צבע משני**: שחור `#000000` / אפור כהה `#1a1a1a` לטקסט
- **אקסנט**: ורוד/אדום לכפתורי CTA (contrast ratio > 4.5:1 לנגישות)
- **רקע**: לבן `#FFFFFF` / אפור בהיר מאוד `#F9F9F9`

### טיפוגרפיה (Typography)

- **פונט ראשי MUST**: עברית ברורה וקריאה (Assistant או Rubik)
- **היררכיה MUST**: כותרות בולטות (32px+), טקסט גוף קריא (16px מינימום)
- **ריווח MUST**: מספיק אוויר בין אלמנטים (16px grid system)
- **Line height MUST**: 1.5 לטקסט גוף, 1.2 לכותרות
- **RTL MUST**: כיווניות עברית מלאה (text-align: right, direction: rtl)

### אלמנטים ויזואליים

- **תמונות MUST**: רזולוציה גבוהה, אופטימיזציה לווב (WebP + fallback)
- **אייקונים MUST**: פשוטים ועקביים (heroicons או lucide-react)
- **כפתורים MUST**: גדולים מספיק (min 44x44px), hover states ברורים
- **טפסים MUST**: labels ברורים, validation בזמן אמת, הודעות שגיאה מועילות

## תהליכי עבודה

### Git Workflow

- **main branch MUST**: רק קוד מוכן לפרודקשן, תמיד deployable
- **feature branches MUST**: `feature/[feature-name]` (e.g., `feature/coupon-system`)
- **commit messages MUST**: תיאוריים וברורים (עברית או אנגלית עקבית)
  - דוגמאות טובות: `feat: add coupon validation`, `fix: cart total calculation`,
`docs: update README`
- **pull requests MUST**: תיאור מפורט של השינויים, screenshots ל-UI changes
- **code review SHOULD**: לפחות review אחד לפני merge (אם יש צוות)

### פיתוח

**תהליך פיתוח מחייב**:
1. קריאת spec ברורה של הפיצ'ר
2. תכנון מבנה קומפוננטות (sketch או wireframe אם UI חדש)
3. פיתוח בסביבת dev (localhost)
4. בדיקה עצמית בכל הדפדפנים העיקריים (Chrome, Safari, Firefox)
5. Deploy ל-preview environment (Vercel preview) לבדיקה
6. Deployment לפרודקשן רק אחרי אישור ובדיקה

### Deployment

- **CI/CD אוטומטי MUST**: דרך Vercel (או פלטפורמה דומה)
- **בדיקות אוטומטיות MUST**: לפני deploy (build success, smoke tests)
- **rollback מהיר MUST**: יכולת לחזור לגרסה קודמת תוך 5 דקות
- **ניטור errors MUST**: ב-production (Sentry או כלי דומה)
- **zero-downtime deployments MUST**: users לא יראו errors במהלך deploy

## הגנת פרטיות ואבטחה

### נתוני לקוחות

- **אחסון מינימלי MUST**: רק מה שנדרש לצורך ההזמנה והמשלוח
- **הצפנה MUST**: כל נתון רגיש מוצפן (passwords, sensitive PII)
- **גישה מוגבלת MUST**: רק למנהל המערכת (role-based access control)
- **GDPR compliance MUST**: אם נדרש בעתיד (right to deletion, data export)
- **data retention policy MUST**: מחיקת נתונים לא נחוצים אחרי 7 שנים

### תשלומים

- **אין אחסון פרטי כרטיס MUST**: כל התשלומים דרך Cardcom (PCI compliance
outsourced)
- **HTTPS בלבד MUST**: אין אפשרות לגלוש ב-HTTP (redirect 301)
- **PCI compliance MUST**: עמידה בתקני אבטחה (via Cardcom)
- **fraud detection SHOULD**: ניטור עסקאות חשודות
- **secure session management MUST**: tokens, CSRF protection

## תיעוד

### תיעוד קוד

- **README.md MUST**: מפורט עם הוראות הרצה, installation, environment variables
- **API endpoints MUST**: תיעוד של כל endpoint (request/response examples)
- **קומפוננטות מורכבות MUST**: תיעוד props, usage examples
- **changelog MUST**: מעודכן לכל release (version, changes, date)
- **inline comments SHOULD**: רק למקומות לא ברורים, לא לקוד self-explanatory

### תיעוד משתמש

- **מדריך לפאנל ניהול MUST**: screenshots, step-by-step
- **FAQ ללקוחות MUST**: שאלות נפוצות ותשובות
- **הוראות משלוח ומעקב MUST**: ברורות ונגישות
- **מדיניות החזרות MUST**: מפורשת וברורה (תנאים, תהליך, זמנים)

## מדדי הצלחה

### טכניים (Technical Metrics)

- ✅ זמן טעינה < 2 שניות (First Contentful Paint)
- ✅ ציון Lighthouse > 90 בכל הקטגוריות
- ✅ 0 errors קריטיים ב-console
- ✅ תאימות ל-95% מהדפדפנים
- ✅ Uptime > 99.9%
- ✅ Time to Interactive < 3 שניות

### עסקיים (Business Metrics)

- ✅ Conversion rate ברור וניתן למעקב (Google Analytics + custom tracking)
- ✅ זמן ממוצע להשלמת רכישה < 3 דקות
- ✅ Bounce rate < 60%
- ✅ מעקב אנליטיקס פעיל (pageviews, sessions, conversions)
- ✅ Cart abandonment rate < 70%

### חוויית משתמש (UX Metrics)

- ✅ טפסים פשוטים למילוי (< 5 שדות לרכישה)
- ✅ אישורי הזמנה מגיעים תוך דקה (email confirmation)
- ✅ מעקב משלוח זמין בקלות (tracking link in email)
- ✅ תמיכה זמינה ונגישה (email response < 24h)

## עדיפויות בפיתוח

### חובה (Must Have) - P0

1. ✅ דף בית עם תיאור מוצר מלא (hero, features, benefits, testimonials)
2. ✅ מערכת הזמנה מלאה עם Cardcom (cart, checkout, payment)
3. ✅ פאנל ניהול הזמנות (admin dashboard)
4. ✅ שליחת מיילים אוטומטית (Resend - order confirmation, shipping updates)
5. ✅ מערכת קופונים (discount codes, validation)
6. ✅ SEO בסיסי (meta tags, structured data, sitemap)

### רצוי (Should Have) - P1

1. 📋 שליחת SMS אוטומטית (order confirmation, shipping updates)
2. 📋 דשבורד אנליטיקס (sales, traffic, conversion rates)
3. 📋 חלון צ'אט תמיכה (live chat or WhatsApp integration)
4. 📋 עמוד המלצות מורחב (dedicated testimonials page with filters)

### אפשרי בעתיד (Could Have) - P2

1. 💡 תמיכה באנגלית (i18n for international customers)
2. 💡 תכנית שיווק שותפים (affiliate program)
3. 💡 מוצרים נוספים (product catalog expansion)
4. 💡 חבילות מוצרים (bundle deals, subscriptions)

## ממשל (Governance)

החוקה הזו מנחה כל החלטה בפרויקט. כשיש ספק - נחזור לעקרונות.

**עקרונות מנחים במקרה של ספק**:
- **פשוט עדיף על מורכב** - אם יש שתי דרכים, בחר בפשוטה
- **המשתמש במרכז** - כל החלטה מתחילה ב"מה טוב ללקוחה?"
- **איכות על פני כמות** - עדיף פחות פיצ'רים מושלמים מהרבה באגים
- **ביצועים הם פיצ'ר** - מהירות היא חלק מה-UX, לא nice-to-have

**תהליך תיקונים (Amendment Process)**:
1. תיקונים MUST להיות מוצעים בכתב עם נימוק
2. שינויים מוצעים MUST לכלול ניתוח השפעה על קוד קיים
3. תיקונים דורשים אישור (מנהל טכני או בעלים)
4. תיקונים מאושרים MUST לכלול תוכנית migration לקוד קיים
5. כל התבניות והתיעוד MUST להתעדכן תוך sprint אחד

**אכיפה (Enforcement)**:
- כל Pull Request MUST לעמוד בחוקה
- Code reviewers MUST לדחות שינויים שלא עומדים בסטנדרטים
- הפרות שהתגלו MUST להתוקן תוך sprint אחד
- הפרות חוזרות מחייבות סקירת תהליך

**גרסאות (Versioning)**:
- MAJOR: שינויים בלתי תואמים לאחור בעקרונות/ממשל
- MINOR: עקרון חדש או הרחבה משמעותית
- PATCH: הבהרות, תיקוני טקסט, שיפורים לא-סמנטיים

**מסמך חי (Living Document)**:
- החוקה MUST להיבדק כל רבעון לרלוונטיות
- עקרונות לא רלוונטיים MUST להתוקן או להימחק
- עקרונות חדשים יכולים להתווסף על בסיס לקחים

**Version**: 2.0.0 | **Ratified**: 2025-10-21 | **Last Amended**: 2025-10-21
