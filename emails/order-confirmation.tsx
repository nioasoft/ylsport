import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import { OrderConfirmationEmailData } from "@/lib/resend";

/**
 * Order Confirmation Email Template
 * Sent to customers after successful payment
 */
export function OrderConfirmationEmail(data: OrderConfirmationEmailData) {
  const shippingMethodText =
    data.shippingMethod === "SELF_PICKUP" ? "איסוף עצמי" : "משלוח לכתובת";

  return (
    <Html dir="rtl" lang="he">
      <Head />
      <Preview>
        הזמנה {data.orderNumber} התקבלה בהצלחה - YL Sport
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>YL Sport</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            {/* Success Message */}
            <Heading style={h1}>ההזמנה שלך התקבלה בהצלחה!</Heading>

            <Text style={greeting}>שלום {data.customerName},</Text>

            <Text style={text}>
              תודה שהזמנת מ-YL Sport! ההזמנה שלך מספר{" "}
              <strong style={orderNumberStyle}>{data.orderNumber}</strong>{" "}
              התקבלה ואנחנו כבר מתחילים להכין אותה.
            </Text>

            {/* Order Details Box */}
            <Section style={orderBox}>
              <Heading style={h2}>פרטי ההזמנה</Heading>

              {/* Order Items Table */}
              <Section style={itemsSection}>
                {data.items.map((item, index) => (
                  <Row key={index} style={itemRow}>
                    <Column style={itemDetails}>
                      <Text style={itemName}>{item.productName}</Text>
                      <Text style={itemMeta}>
                        מידה: {item.size} | כמות: {item.quantity}
                      </Text>
                    </Column>
                    <Column style={itemPrice}>
                      <Text style={priceText}>
                        {item.totalPrice.toFixed(2)} ש"ח
                      </Text>
                    </Column>
                  </Row>
                ))}
              </Section>

              <Hr style={divider} />

              {/* Price Summary */}
              <Section style={summarySection}>
                <Row style={summaryRow}>
                  <Column>
                    <Text style={summaryLabel}>סכום ביניים:</Text>
                  </Column>
                  <Column style={summaryValue}>
                    <Text style={summaryText}>
                      {data.subtotal.toFixed(2)} ש"ח
                    </Text>
                  </Column>
                </Row>

                <Row style={summaryRow}>
                  <Column>
                    <Text style={summaryLabel}>משלוח ({shippingMethodText}):</Text>
                  </Column>
                  <Column style={summaryValue}>
                    <Text style={summaryText}>
                      {data.shippingCost === 0
                        ? "חינם"
                        : `${data.shippingCost.toFixed(2)} ש"ח`}
                    </Text>
                  </Column>
                </Row>

                {data.discountAmount > 0 && (
                  <Row style={summaryRow}>
                    <Column>
                      <Text style={summaryLabel}>הנחה:</Text>
                    </Column>
                    <Column style={summaryValue}>
                      <Text style={discountText}>
                        -{data.discountAmount.toFixed(2)} ש"ח
                      </Text>
                    </Column>
                  </Row>
                )}

                <Hr style={divider} />

                <Row style={totalRow}>
                  <Column>
                    <Text style={totalLabel}>סה"כ לתשלום:</Text>
                  </Column>
                  <Column style={summaryValue}>
                    <Text style={totalText}>{data.total.toFixed(2)} ש"ח</Text>
                  </Column>
                </Row>
              </Section>
            </Section>

            {/* Shipping Address (only if not self-pickup) */}
            {data.shippingMethod !== "SELF_PICKUP" && data.shippingAddress && (
              <Section style={addressBox}>
                <Heading style={h3}>כתובת למשלוח</Heading>
                <Text style={addressText}>
                  {data.shippingAddress}
                  <br />
                  {data.shippingCity}
                  {data.shippingPostalCode && `, ${data.shippingPostalCode}`}
                </Text>
              </Section>
            )}

            {/* Self Pickup Info */}
            {data.shippingMethod === "SELF_PICKUP" && (
              <Section style={addressBox}>
                <Heading style={h3}>איסוף עצמי</Heading>
                <Text style={addressText}>
                  ניצור איתך קשר כשההזמנה תהיה מוכנה לאיסוף.
                </Text>
              </Section>
            )}

            {/* What's Next */}
            <Section style={nextStepsBox}>
              <Heading style={h3}>מה הלאה?</Heading>
              <Text style={stepText}>
                <strong>1.</strong> אנחנו מכינים את ההזמנה שלך
              </Text>
              <Text style={stepText}>
                <strong>2.</strong> נעדכן אותך ב-SMS כשההזמנה תצא למשלוח
              </Text>
              <Text style={stepText}>
                <strong>3.</strong> תקבל/י מספר מעקב למעקב אחר המשלוח
              </Text>
            </Section>

            <Hr style={hr} />

            {/* Contact Info */}
            <Text style={contactText}>
              יש שאלות? אנחנו כאן לעזור!
              <br />
              <Link href="mailto:info@yl-sport.co.il" style={link}>
                info@yl-sport.co.il
              </Link>
              {" | "}
              <Link href="tel:+972-53-919-7848" style={link}>
                053-9197848
              </Link>
            </Text>

            {/* Footer */}
            <Text style={footer}>
              תודה שבחרת ב-YL Sport!
              <br />
              <Link href="https://www.yl-sport.co.il" style={link}>
                www.yl-sport.co.il
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  direction: "rtl" as const,
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
  direction: "rtl" as const,
};

const header = {
  backgroundColor: "#e87f93",
  padding: "24px",
  textAlign: "center" as const,
  borderRadius: "8px 8px 0 0",
};

const logo = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0",
  padding: "0",
};

const content = {
  backgroundColor: "#ffffff",
  padding: "32px",
  borderRadius: "0 0 8px 8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

const h1 = {
  color: "#e87f93",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const greeting = {
  color: "#374151",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 16px",
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const orderNumberStyle = {
  color: "#e87f93",
  fontWeight: "bold",
};

const orderBox = {
  backgroundColor: "#fdf2f4",
  border: "1px solid #fce7eb",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
};

const h2 = {
  color: "#e87f93",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 16px",
  textAlign: "center" as const,
};

const h3 = {
  color: "#374151",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 12px",
};

const itemsSection = {
  margin: "0 0 16px",
};

const itemRow = {
  margin: "8px 0",
  padding: "8px 0",
  borderBottom: "1px solid #fce7eb",
};

const itemDetails = {
  verticalAlign: "top" as const,
};

const itemName = {
  color: "#374151",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 4px",
};

const itemMeta = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0",
};

const itemPrice = {
  textAlign: "right" as const,
  verticalAlign: "top" as const,
  width: "100px",
};

const priceText = {
  color: "#374151",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0",
};

const divider = {
  borderColor: "#fce7eb",
  margin: "16px 0",
};

const summarySection = {
  margin: "0",
};

const summaryRow = {
  margin: "8px 0",
};

const summaryLabel = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0",
};

const summaryValue = {
  textAlign: "right" as const,
  width: "120px",
};

const summaryText = {
  color: "#374151",
  fontSize: "14px",
  margin: "0",
};

const discountText = {
  color: "#059669",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0",
};

const totalRow = {
  margin: "12px 0 0",
};

const totalLabel = {
  color: "#374151",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0",
};

const totalText = {
  color: "#e87f93",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0",
};

const addressBox = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px",
  margin: "24px 0",
};

const addressText = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
};

const nextStepsBox = {
  backgroundColor: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: "8px",
  padding: "16px",
  margin: "24px 0",
};

const stepText = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "4px 0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const contactText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "22px",
  textAlign: "center" as const,
  margin: "0 0 16px",
};

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  textAlign: "center" as const,
};

const link = {
  color: "#e87f93",
  textDecoration: "none",
};
