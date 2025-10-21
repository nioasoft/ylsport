import { OrderConfirmationEmailData } from "@/lib/resend";

/**
 * Order Confirmation Email Template
 * TODO: Implement proper React Email template in Phase 3
 */
export function OrderConfirmationEmail(data: OrderConfirmationEmailData) {
  return (
    <div>
      <h1>אישור הזמנה {data.orderNumber}</h1>
      <p>שלום {data.customerName},</p>
      <p>הזמנתך התקבלה בהצלחה!</p>
      {/* TODO: Full email template implementation in Phase 3 */}
    </div>
  );
}
