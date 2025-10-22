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
} from "@react-email/components";
import { OrderStatusUpdateEmailData } from "@/lib/resend";

/**
 * Order Status Update Email Template
 * Shipping notification with tracking number
 */
export function OrderStatusUpdateEmail(data: OrderStatusUpdateEmailData) {
  // Israel Post tracking URL (adjust based on actual shipping provider)
  const trackingUrl = data.trackingNumber
    ? `https://www.israelpost.co.il/itemtrace.nsf/mainsearch?openform&lang=he&itemcode=${data.trackingNumber}`
    : "";

  return (
    <Html dir="rtl" lang="he">
      <Head />
      <Preview>
        ההזמנה שלך נשלחה!
        {data.trackingNumber ? ` מספר מעקב: ${data.trackingNumber}` : ""}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>YL Sport</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h2}>🎉 ההזמנה שלך יצאה למשלוח!</Heading>

            <Text style={text}>שלום {data.customerName},</Text>

            <Text style={text}>
              ההזמנה שלך מספר <strong>{data.orderNumber}</strong> נשלחה ובדרך
              אליך!
            </Text>

            {/* Tracking Number Box */}
            {data.trackingNumber && (
              <Section style={trackingBox}>
                <Text style={trackingLabel}>מספר מעקב:</Text>
                <Text style={trackingNumber}>{data.trackingNumber}</Text>
                {trackingUrl && (
                  <Link href={trackingUrl} style={trackingButton}>
                    עקוב אחר המשלוח
                  </Link>
                )}
              </Section>
            )}

            <Text style={text}>
              המשלוח יגיע תוך 3-5 ימי עסקים (לרוב מהר יותר).
            </Text>

            <Text style={text}>
              אם יש לך שאלות כלשהן, אנחנו כאן כדי לעזור!
            </Text>

            <Hr style={hr} />

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

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#00BFA6",
  padding: "24px",
  textAlign: "center" as const,
};

const h1 = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "0",
  padding: "0",
};

const content = {
  backgroundColor: "#ffffff",
  padding: "32px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

const h2 = {
  color: "#00BFA6",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const trackingBox = {
  backgroundColor: "#E0F7F4",
  border: "2px solid #00BFA6",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const trackingLabel = {
  color: "#00897B",
  fontSize: "14px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  margin: "0 0 8px",
};

const trackingNumber = {
  color: "#00BFA6",
  fontSize: "28px",
  fontWeight: "bold",
  fontFamily: "monospace",
  letterSpacing: "2px",
  margin: "0 0 16px",
};

const trackingButton = {
  backgroundColor: "#00BFA6",
  color: "#ffffff",
  padding: "12px 32px",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
  fontWeight: "600",
  fontSize: "16px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  textAlign: "center" as const,
};

const link = {
  color: "#00BFA6",
  textDecoration: "none",
};
