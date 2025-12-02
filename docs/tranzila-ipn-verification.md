# תיעוד הטמעת Tranzila API - YL Sport

**תאריך עדכון אחרון:** 2 בדצמבר 2025
**שם הטרמינל:** ofer3001
**שם העסק:** YL Sport

---

## סיכום ההטמעה

הצלחנו לבצע אינטגרציה מלאה עם Tranzila:
- ✅ יצירת דרישות תשלום (Payment Requests)
- ✅ קבלת IPN Callbacks אחרי תשלום
- ✅ יצירת חשבונית מס קבלה אוטומטית

---

## 1. Payment Requests API

### Endpoint
```
POST https://api.tranzila.com/v1/pr/create
```

### אימות (Authentication)
```
Headers:
- X-tranzila-api-app-key: {PUBLIC_KEY}
- X-tranzila-api-request-time: {UNIX_TIMESTAMP}
- X-tranzila-api-nonce: {RANDOM_HEX_STRING}
- X-tranzila-api-access-token: HMAC-SHA256(app_key, secret + timestamp + nonce)
```

### דוגמת Payload
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
  "success_url": "https://www.yl-sport.co.il/order/confirmation?orderNumber=ORDER-12345",
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
      "unit_price": 299,
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
  "payment_label": "YL Sport"
}
```

### תגובה מוצלחת
```json
{
  "error_code": 0,
  "message": "דרישת תשלום נוצרה בהצלחה.",
  "pr_id": "170511",
  "pr_link": "https://pay.tranzila.com/pr/xxxx..."
}
```

**חשוב:** יש לשמור את `pr_id` בהזמנה כדי למצוא אותה ב-callback!

---

## 2. IPN Callback

### מה נשלח
Tranzila שולחת POST ל-`ipn_url` עם הפורמט:
```
Content-Type: application/x-www-form-urlencoded
```

### שדות עיקריים
```
Response=000          // "000" = הצלחה
ConfirmationCode=xxx  // קוד אישור
pr_id=170511          // Payment Request ID - משמש לזיהוי ההזמנה
sum=299               // סכום בש"ח
index=12345           // Transaction index
ccno=1234             // 4 ספרות אחרונות של כרטיס
```

### קודי תגובה
- `000` = תשלום הצליח
- כל קוד אחר = שגיאה (ראה רשימה מלאה בקוד)

---

## 3. Invoices API - יצירת חשבונית מס קבלה

### הממצא החשוב!
הפרמטרים `create_document` ו-`document_type` ב-Payment Request **לא עובדים**.

**הפתרון:** יש API נפרד ליצירת חשבוניות!

### Endpoint
```
POST https://billing5.tranzila.com/api/documents_db/create_document
```

### סוגי מסמכים (document_type)
- `"IR"` = חשבונית מס קבלה (Invoice-Receipt)
- `"RE"` = קבלה בלבד (Receipt)
- `"DI"` = חשבונית מס (Tax Invoice / Debit Invoice)

### דוגמת Payload ליצירת חשבונית מס קבלה
```json
{
  "terminal_name": "ofer3001",
  "document_date": "2025-12-02",
  "document_type": "IR",
  "action": 1,
  "document_language": "heb",
  "document_currency_code": "ILS",
  "vat_percent": 17,
  "response_language": "heb",

  "client_name": "שם הלקוח",
  "client_email": "customer@email.com",
  "client_address_line_1": "רחוב הרצל 1",
  "client_city": "תל אביב",
  "client_country_code": "IL",

  "items": [
    {
      "type": "I",
      "code": "ITEM-001",
      "name": "טייץ ספורט YL",
      "price_type": "G",
      "unit_price": 299,
      "units_number": 1,
      "unit_type": 1,
      "currency_code": "ILS",
      "to_doc_currency_exchange_rate": 1
    }
  ],

  "payments": [
    {
      "payment_method": 1,
      "payment_date": "2025-12-02",
      "amount": 299,
      "currency_code": "ILS",
      "to_doc_currency_exchange_rate": 1,
      "cc_last_4_digits": "1234",
      "cc_credit_term": 1,
      "cc_brand": 1
    }
  ],

  "created_by_system": "YL Sport Website"
}
```

### Payment Methods
- `1` = כרטיס אשראי
- `3` = צ'ק
- `4` = העברה בנקאית
- `5` = מזומן
- `6` = PayPal
- `10` = אחר

### תגובה מוצלחת
```json
{
  "status_code": 0,
  "status_msg": "הצלחה",
  "enquiry_key": "69fe6519",
  "document": {
    "id": "1",
    "number": "30001",
    "total_charge_amount": 299,
    "currency": "ILS",
    "created_at": "2025-12-02 20:29:35",
    "retrieval_key": "xxxxx..."
  }
}
```

### צפייה בחשבונית
```
https://my.tranzila.com/api/get_financial_document/{retrieval_key}
```

---

## 4. תהליך מלא - איך זה עובד

```
1. לקוח ממלא טופס הזמנה
   ↓
2. יוצרים הזמנה בבסיס הנתונים (PENDING_PAYMENT)
   ↓
3. קוראים ל-Tranzila Payment Request API
   ↓
4. שומרים את pr_id בהזמנה (tranzilaPaymentId)
   ↓
5. מפנים לקוח לעמוד תשלום (pr_link)
   ↓
6. לקוח משלם בעמוד Tranzila
   ↓
7. Tranzila שולחת IPN ל-callback endpoint
   ↓
8. מזהים הזמנה לפי pr_id
   ↓
9. מעדכנים סטטוס ל-PAID
   ↓
10. יוצרים חשבונית מס קבלה דרך Invoices API
    ↓
11. שולחים אימייל + SMS ללקוח
```

---

## 5. קודי שגיאה נפוצים

### Payment API
| קוד | משמעות |
|-----|--------|
| 401 | Unauthorized - בדוק מפתחות API |
| 10000 | Terminal name לא תקין |

### Invoices API
| קוד | משמעות |
|-----|--------|
| 10007 | Document base number not found - צריך להגדיר בהגדרות טרמינל |
| 10008 | Items total differs from Payments total |
| 10300 | Failed to create document |
| 10301 | Terminal settings not found |

---

## 6. Environment Variables

```env
TRANZILA_API_HOST=https://api.tranzila.com
TRANZILA_TERMINAL_NAME=ofer3001
TRANZILA_PUBLIC_KEY=xxx
TRANZILA_PRIVATE_KEY=xxx
```

**חשוב:** לוודא שאין רווחים או newlines בסוף הערכים!

---

## 7. קבצים רלוונטיים בפרויקט

- `lib/tranzila.ts` - SDK עם כל הפונקציות
- `app/api/orders/route.ts` - יצירת הזמנה ודרישת תשלום
- `app/api/payment/tranzila-callback/route.ts` - קבלת IPN ויצירת חשבונית
- `scripts/test-tranzila-invoice.ts` - סקריפט בדיקה לדרישות תשלום
- `scripts/test-tranzila-create-invoice.ts` - סקריפט בדיקה ליצירת חשבונית

---

## 8. תמיכה

- **WhatsApp:** +972-73-222-4488
- **Ticket System:** https://my.tranzila.com
- **Documentation:** https://docs.tranzila.com

---

**פרטי קשר שלנו:**
אימייל: ylsport1@gmail.com

צוות YL Sport
