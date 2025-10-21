import { AdminOrderNotificationEmailData } from "@/lib/resend";

/**
 * Admin Order Notification Email Template
 * TODO: Implement proper React Email template in Phase 3
 */
export function AdminOrderNotificationEmail(data: AdminOrderNotificationEmailData) {
  return (
    <div>
      <h1>הזמנה חדשה {data.orderNumber}</h1>
      <p>התקבלה הזמנה חדשה:</p>
      <ul>
        <li>לקוח: {data.customerName}</li>
        <li>אימייל: {data.customerEmail}</li>
        <li>טלפון: {data.customerPhone}</li>
        <li>סכום כולל: ₪{data.total}</li>
      </ul>
      {/* TODO: Full email template implementation in Phase 3 */}
    </div>
  );
}
