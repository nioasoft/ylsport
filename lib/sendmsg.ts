/**
 * SendMsg SMS Service SDK
 *
 * Israeli SMS provider "שלח מסר" integration
 * API Documentation: https://sendmsgapi.docs.apiary.io/
 *
 * Required Environment Variables:
 * - SENDMSG_SITE_ID: Account ID (מספר חשבון)
 * - SENDMSG_API_PASSWORD: API password
 * - SENDMSG_SENDER_NAME: Sender name (max 11 chars, English only)
 */

// ============================================================================
// TYPES
// ============================================================================

export interface SendMsgConfig {
  siteId: string;
  apiPassword: string;
  senderName: string;
}

export interface SendSMSRequest {
  to: string; // Phone number (Israeli format: 05X-XXXXXXX)
  message: string;
}

export interface SendSMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  errorCode?: string;
}

interface TokenResponse {
  token?: string;
  Token?: string;
  ResultCode?: number;
  ResultMessage?: string;
}

interface SMSApiResponse {
  success?: boolean;
  res?: boolean;
  result?: {
    ResultID?: number;
    ResultMessage?: string;
  };
  data?: {
    users?: number[];
    message?: number;
  };
  error?: string;
  // Legacy fields
  ResultCode?: number;
  ResultMessage?: string;
}

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get authentication token from SendMsg API
 * Token is valid for 12 hours, we refresh every 11 hours to be safe
 */
async function getToken(): Promise<string | null> {
  const config = getConfig();

  // Return cached token if still valid (with 1 hour buffer)
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  try {
    const response = await fetch(
      "https://gconvertrest.sendmsg.co.il/api/sendMsg/token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SiteID: parseInt(config.siteId),
          Password: config.apiPassword,
        }),
      }
    );

    const data: TokenResponse = await response.json();
    console.log("SendMsg token response:", JSON.stringify(data));

    // Check for success (200 or 10000)
    if (data.ResultCode === 200 || data.ResultCode === 10000 || response.ok) {
      const token = data.token || data.Token;
      if (token) {
        cachedToken = token;
        // Token valid for 12 hours, refresh after 11
        tokenExpiry = Date.now() + 11 * 60 * 60 * 1000;
        console.log("SendMsg token obtained successfully");
        return token;
      }
    }

    console.error("Failed to get SendMsg token:", data.ResultMessage || "Unknown error");
    return null;
  } catch (error) {
    console.error("SendMsg token error:", error);
    return null;
  }
}

// ============================================================================
// CONFIGURATION
// ============================================================================

function getConfig(): SendMsgConfig {
  const siteId = process.env.SENDMSG_SITE_ID || "";
  const apiPassword = process.env.SENDMSG_API_PASSWORD || "";
  const senderName = process.env.SENDMSG_SENDER_NAME || "YLSport";

  return { siteId, apiPassword, senderName };
}

// ============================================================================
// PHONE NUMBER FORMATTING
// ============================================================================

/**
 * Format Israeli phone number
 * Keeps format as 05XXXXXXXX (local Israeli format)
 */
export function formatPhoneForSMS(phone: string): string {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, "");

  // If international format (9725...), convert to local
  if (digitsOnly.startsWith("972") && digitsOnly.length === 12) {
    return "0" + digitsOnly.substring(3);
  }

  // If already local format (05...)
  if (digitsOnly.startsWith("05") && digitsOnly.length === 10) {
    return digitsOnly;
  }

  // Return as-is if format unknown
  return digitsOnly;
}

/**
 * Validate phone number format
 */
export function isValidPhoneForSMS(phone: string): boolean {
  const formatted = formatPhoneForSMS(phone);
  // Israeli mobile: 10 digits starting with 05
  return /^05\d{8}$/.test(formatted);
}

// ============================================================================
// SMS SENDING
// ============================================================================

/**
 * Send SMS via SendMsg API
 *
 * Uses "Add Users And Send SMS" endpoint
 * Docs: https://sendmsgapi.docs.apiary.io/#reference/0/add-users-and-send-sms
 */
export async function sendSMS(request: SendSMSRequest): Promise<SendSMSResponse> {
  const config = getConfig();

  // Check if SMS is disabled (for development/testing)
  if (process.env.SKIP_SMS_SEND === "true") {
    console.log("=".repeat(60));
    console.log("SMS SKIP MODE - Would send SMS:");
    console.log(`To: ${request.to}`);
    console.log(`Message: ${request.message}`);
    console.log("=".repeat(60));
    return {
      success: true,
      messageId: `skip-${Date.now()}`,
    };
  }

  // Validate configuration
  if (!config.siteId || !config.apiPassword) {
    console.error("SendMsg configuration missing: SITE_ID or API_PASSWORD not found");
    return {
      success: false,
      error: "SMS service not configured",
      errorCode: "CONFIG_ERROR",
    };
  }

  // Validate phone number
  if (!isValidPhoneForSMS(request.to)) {
    console.error("Invalid phone number:", request.to);
    return {
      success: false,
      error: "Invalid phone number format",
      errorCode: "INVALID_PHONE",
    };
  }

  // Get authentication token
  const token = await getToken();
  if (!token) {
    return {
      success: false,
      error: "Failed to authenticate with SMS service",
      errorCode: "AUTH_ERROR",
    };
  }

  // Format phone number
  const formattedPhone = formatPhoneForSMS(request.to);

  // Sender phone - verified numeric sender
  const senderPhone = "0559377896";

  try {
    console.log("Sending SMS via SendMsg...");
    console.log(`To: ${formattedPhone}`);

    // Build request body according to API docs
    const requestBody = {
      users: [
        {
          Cellphone: formattedPhone,
        },
      ],
      Message: {
        MessageContent: request.message,
        SenderPhone: senderPhone,
        MessageInnerName: `SMS_${Date.now()}`,
        MessageSubject: "",
        MessageType: 1,
        TypeSms: 1, // Always use short SMS (70 chars for Hebrew) - long SMS requires separate credit
      },
    };

    const response = await fetch(
      "https://gconvertrest.sendmsg.co.il/api/sendMsg/addUsersAndSendSms",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      }
    );

    const responseText = await response.text();
    console.log("SendMsg SMS response:", responseText);

    let data: SMSApiResponse;
    try {
      data = JSON.parse(responseText);
    } catch {
      // If not JSON, check HTTP status
      if (response.ok) {
        return {
          success: true,
          messageId: `sendmsg-${Date.now()}`,
        };
      }
      return {
        success: false,
        error: responseText || "Unknown error",
        errorCode: "PARSE_ERROR",
      };
    }

    // Check for success - new API format
    if (data.success === true || data.res === true) {
      const messageId = data.data?.message?.toString() || `sendmsg-${Date.now()}`;
      return {
        success: true,
        messageId,
      };
    }

    // Check for success codes (legacy format - 200 or 10000, or 200-299 range)
    const resultCode = data.ResultCode || data.result?.ResultID || 0;
    if (
      resultCode === 200 ||
      resultCode === 10000 ||
      (resultCode > 200 && resultCode < 300)
    ) {
      return {
        success: true,
        messageId: `sendmsg-${Date.now()}`,
      };
    }

    // Handle specific error codes
    const errorMessage = data.result?.ResultMessage || data.ResultMessage || data.error || "SMS sending failed";
    return {
      success: false,
      error: errorMessage,
      errorCode: resultCode.toString(),
    };
  } catch (error) {
    console.error("SendMsg API error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
      errorCode: "NETWORK_ERROR",
    };
  }
}

// ============================================================================
// BATCH SENDING
// ============================================================================

/**
 * Send SMS to multiple recipients
 */
export async function sendBulkSMS(
  recipients: string[],
  message: string
): Promise<{
  success: boolean;
  sent: number;
  failed: number;
  results: SendSMSResponse[];
}> {
  const results: SendSMSResponse[] = [];
  let sent = 0;
  let failed = 0;

  for (const phone of recipients) {
    const result = await sendSMS({ to: phone, message });
    results.push(result);

    if (result.success) {
      sent++;
    } else {
      failed++;
    }

    // Small delay between messages to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return {
    success: failed === 0,
    sent,
    failed,
    results,
  };
}

// ============================================================================
// ERROR CODES
// ============================================================================

export const SMS_ERROR_MESSAGES: Record<string, string> = {
  CONFIG_ERROR: "שירות ה-SMS לא מוגדר",
  AUTH_ERROR: "שגיאה באימות מול שירות ה-SMS",
  INVALID_PHONE: "מספר טלפון לא תקין",
  INVALID_MESSAGE: "תוכן ההודעה לא תקין",
  NETWORK_ERROR: "שגיאת תקשורת, נסה שוב",
  PARSE_ERROR: "שגיאה בקליטת תשובה מהשרת",
  "410": "לא נמצא מה שחיפשת",
  "500": "אירעה שגיאה",
  "530": "נסה שוב מאוחר יותר",
  "531": "נשמר בהצלחה אך שליחת ההודעה נכשלה",
  "550": "שגיאה בחילוץ נתונים, נסה שוב מאוחר יותר",
};

/**
 * Get Hebrew error message for SMS error code
 */
export function getSMSErrorMessage(errorCode: string): string {
  return SMS_ERROR_MESSAGES[errorCode] || "שגיאה בשליחת SMS";
}
