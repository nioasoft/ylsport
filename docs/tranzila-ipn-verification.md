# בקשת אימות הגדרות IPN וקבלות - Tranzila API

**תאריך:** 2 בדצמבר 2025
**שם הטרמינל:** ofer3001
**שם העסק:** YL Sport
**Ticket קודם:** #566492793

---

## רקע

תודה על העזרה הקודמת! הצלחנו להתחבר ל-API וליצור דרישות תשלום בהצלחה.

כעת אנחנו רוצים לוודא שההגדרות הבאות פועלות כראוי:

---

## 1. הגדרת IPN (Webhook Callback)

אנחנו שולחים בבקשת יצירת תשלום את השדה:
```json
{
  "ipn_url": "https://www.yl-sport.co.il/api/payment/tranzila-callback",
  "order_id": "ORDER-12345"
}
```

**שאלות:**
1. האם `ipn_url` הוא השדה הנכון לקבלת callback אחרי תשלום?
2. מה הפורמט של ה-POST שנשלח ל-IPN URL? (אילו שדות?)
3. האם ה-`order_id` שאנחנו שולחים יחזור ב-callback?
4. האם ה-callback נשלח גם בהצלחה וגם בכישלון?

---

## 2. הגדרת קבלה אוטומטית

אנחנו שולחים:
```json
{
  "create_document": true,
  "document_type": "receipt"
}
```

**שאלות:**
1. האם זה יוצר קבלה אוטומטית אחרי תשלום מוצלח?
2. האם הקבלה נשלחת אוטומטית למייל הלקוח?
3. האם יש שדות נוספים שצריך להגדיר (כמו פרטי עוסק)?

---

## 3. דוגמת הבקשה המלאה שאנחנו שולחים

```json
{
  "terminal_name": "ofer3001",
  "action_type": 2,
  "response_language": "hebrew",
  "request_currency": "ILS",
  "request_vat": 17,
  "payments_number": 1,
  "created_by_user": "website",
  "payment_plans": [1],
  "payment_methods": [1],
  "ipn_url": "https://www.yl-sport.co.il/api/payment/tranzila-callback",
  "order_id": "ORDER-12345",
  "success_url": "https://www.yl-sport.co.il/order/confirmation",
  "fail_url": "https://www.yl-sport.co.il/checkout?payment=failed",
  "client": {
    "name": "שם הלקוח",
    "contact_person": "שם הלקוח",
    "email": "customer@email.com",
    "phone_country_code": "972",
    "phone_area_code": "50",
    "phone_number": "1234567",
    "id": "000000000"
  },
  "items": [
    {
      "id": 1,
      "code": "ITEM-001",
      "name": "טייץ ספורט YL",
      "unit_price": 149,
      "type": "I",
      "units_number": 1,
      "unit_type": 1,
      "price_type": "G",
      "currency_code": "ILS"
    }
  ],
  "send_email": {
    "sender_name": "YL Sport",
    "sender_email": "noreply@yl-sport.co.il"
  },
  "create_document": true,
  "document_type": "receipt"
}
```

---

## 4. מה אנחנו מצפים לקבל ב-Callback

האם זה נכון שנקבל משהו כזה?
```json
{
  "Response": "000",
  "ConfirmationCode": "1234567",
  "order_id": "ORDER-12345",
  "sum": 149,
  "currency": "1",
  "index": "170190"
}
```

---

## 5. בעיה בהפקת חשבונית מס קבלה

אנחנו שולחים בבקשה:
```json
{
  "create_document": true,
  "document_type": 3
}
```

אבל **הלקוח לא מקבל חשבונית מס קבלה** אחרי תשלום מוצלח.

**שאלות:**
1. האם הטרמינל `ofer3001` מופעל להפקת חשבוניות אוטומטית?
2. האם צריך להפעיל את זה בהגדרות הטרמינל בממשק הניהול של Tranzila?
3. מה הפרמטרים הנכונים להפקת חשבונית מס קבלה אוטומטית?

---

## סיכום הבקשה

נודה לקבל:
1. אישור שה-IPN עובד עם השדות ששלחנו
2. דוגמה מדויקת של ה-callback שנשלח
3. **הפעלת הפקת חשבונית מס קבלה אוטומטית לטרמינל `ofer3001`**
4. אם יש שדות חסרים או שגויים - מה צריך לתקן

---

**פרטי קשר:**
אימייל: ylsport1@gmail.com

תודה רבה על העזרה!
צוות YL Sport
