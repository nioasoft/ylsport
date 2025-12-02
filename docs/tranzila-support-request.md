# בקשת תמיכה טכנית - Tranzila API

**תאריך:** 1 בדצמבר 2025
**שם הטרמינל:** ofer3001
**שם העסק:** YL Sport

---

## תיאור הבעיה

אנו מנסים לבצע אינטגרציה עם Tranzila API ליצירת בקשות תשלום (Payment Requests) עבור אתר האיקומרס שלנו.

בעת ניסיון ליצור בקשת תשלום דרך ה-API, אנו מקבלים שגיאת **401 Unauthorized**.

---

## פרטים טכניים

### Endpoint שנוסה:
```
POST https://api.tranzila.com/v1/pr/create
```

### Headers ששלחנו:
```
Content-Type: application/json
X-tranzila-api-app-key: HMy2ONBMYcaAVl7YJvLLTFkYFWijIoDosF7rWiVVcpjy2PFsuSiR7rIuYSx4Pw3uQahnQlvwrfv
Authorization: Bearer H9yBdhfjMl
```

### Request Body:
```json
{
  "terminal_name": "ofer3001",
  "amount": 1,
  "currency": "ILS",
  "success_url": "https://example.com/success",
  "fail_url": "https://example.com/fail",
  "notify_url": "https://example.com/api/callback",
  "customer_name": "Test Customer",
  "email": "test@test.com",
  "phone": "0501234567",
  "order_id": "TEST-123",
  "product_description": "Test Payment"
}
```

### התשובה שהתקבלה:
```json
{
  "code": 401,
  "message": "Unauthorized",
  "user": "diego4"
}
```

---

## שיטות אימות שנוסו

ניסינו מספר שיטות אימות שונות, כולן החזירו את אותה שגיאה:

1. **Bearer Token** - `Authorization: Bearer {private_key}`
2. **Basic Auth** - `Authorization: Basic {base64(terminal:private_key)}`
3. **Private Key כ-App Key** - `X-tranzila-api-app-key: {private_key}`
4. **שני המפתחות** - `X-tranzila-api-app-key` + `X-tranzila-api-secret-key`

---

## שאלות לתמיכה

1. **האם הטרמינל `ofer3001` מופעל לשימוש ב-API?**
   האם נדרשת הפעלה מיוחדת לשימוש ב-Payment Requests API?

2. **האם המפתחות שברשותנו תקינים?**
   - Public Key: `HMy2ONBMYcaAVl7YJvLL...` (מקוצר)
   - Private Key: `H9yBdhfjMl`

   האם אלו המפתחות הנכונים לטרמינל זה?

3. **מהי שיטת האימות הנכונה?**
   איזה header בדיוק צריך לשלוח? האם יש דוגמת קוד או curl command שעובד?

4. **מיהו "diego4"?**
   בתשובת השגיאה מופיע `"user": "diego4"` - האם זה אומר משהו על מקור הבעיה?

5. **האם יש endpoint אחר?**
   ניסינו גם `/v1/payment_requests` (החזיר 404) וגם `/v1/pr/create` (החזיר 401).

---

## מידע נוסף

- **סביבה:** Production
- **שפת תכנות:** TypeScript / Node.js
- **מסגרת:** Next.js 14

---

## בקשה

נודה לקבל:
1. אישור שהטרמינל מופעל ל-API
2. דוגמת קוד/curl עובדת ליצירת Payment Request
3. אם יש בעיה עם המפתחות - מפתחות חדשים

---

**פרטי קשר:**
אימייל: ylsport1@gmail.com

תודה רבה,
צוות YL Sport
