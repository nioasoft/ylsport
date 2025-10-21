import { OrderStatusUpdateEmailData } from "@/lib/resend";

/**
 * Order Status Update Email Template
 * TODO: Implement proper React Email template in Phase 3
 */
export function OrderStatusUpdateEmail(data: OrderStatusUpdateEmailData) {
  return (
    <div>
      <h1>עדכון סטטוס הזמנה {data.orderNumber}</h1>
      <p>שלום {data.customerName},</p>
      <p>סטטוס ההזמנה שלך עודכן: {data.newStatus}</p>
      {/* TODO: Full email template implementation in Phase 3 */}
    </div>
  );
}
