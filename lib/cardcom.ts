/**
 * Cardcom Payment Gateway SDK Wrapper
 *
 * Official Cardcom API Documentation:
 * https://support.cardcom.solutions/
 *
 * Security: IP Whitelist + Amount Verification
 */

import { isIpWhitelisted } from "./utils";

// ============================================================================
// TYPES
// ============================================================================

export interface CardcomConfig {
  terminalNumber: string;
  apiKey: string;
  returnUrl: string;
  notifyUrl: string;
  ipWhitelist: string; // Comma-separated IPs
}

export interface CardcomPaymentRequest {
  terminalNumber: string;
  returnUrl: string;
  notifyUrl: string;
  sum: number; // Total amount in ILS
  currency: string; // "ILS"
  orderNumber: string; // Unique order identifier
  productName: string;
  quantity: number;
  description?: string;
  email?: string;
  language: string; // "he" for Hebrew
}

export interface CardcomPaymentResponse {
  url: string; // Redirect URL for payment
  lowProfileCode: string; // Transaction identifier
}

export interface CardcomCallbackPayload {
  Order: string; // Our order number
  Amount: string; // Payment amount
  Currency: string; // "ILS"
  ConfirmationCode: string; // Cardcom transaction ID
  ResponseCode: string; // "0" = success, others = failure
  Description?: string;
  InternalDealNumber?: string;
}

export interface CardcomVerificationResult {
  success: boolean;
  message: string;
  transactionId?: string;
}

// ============================================================================
// CARDCOM SDK CLASS
// ============================================================================

export class CardcomSDK {
  private config: CardcomConfig;
  private baseUrl = "https://secure.cardcom.solutions/api/v11";

  constructor(config: CardcomConfig) {
    this.config = config;
  }

  /**
   * Create a payment transaction and get redirect URL
   */
  async createPayment(request: CardcomPaymentRequest): Promise<CardcomPaymentResponse> {
    const payload = {
      TerminalNumber: request.terminalNumber,
      ApiName: this.config.apiKey,
      ReturnValue: request.returnUrl,
      NotifyUrl: request.notifyUrl,
      Sum: request.sum,
      Currency: request.currency,
      UniqueID: request.orderNumber,
      ProductName: request.productName,
      Quantity: request.quantity,
      Description: request.description || "",
      EmailAddress: request.email || "",
      Language: request.language,
      MaxNumOfPayments: 1, // Single payment only (no installments)
    };

    try {
      const response = await fetch(`${this.baseUrl}/LowProfile/Create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Cardcom API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Cardcom returns different response structures based on success/failure
      if (data.ResponseCode !== "0") {
        throw new Error(data.Description || "Failed to create Cardcom payment");
      }

      return {
        url: data.url || `https://secure.cardcom.solutions/Interface/LowProfile.aspx?lpid=${data.LowProfileId}`,
        lowProfileCode: data.LowProfileCode || data.LowProfileId,
      };
    } catch (error) {
      console.error("Cardcom payment creation error:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "שגיאה ביצירת תשלום. אנא נסה שוב מאוחר יותר."
      );
    }
  }

  /**
   * Verify payment callback from Cardcom
   * Security: IP Whitelist + Amount Verification
   */
  verifyCallback(
    payload: CardcomCallbackPayload,
    expectedAmount: number,
    clientIp: string | null
  ): CardcomVerificationResult {
    // Step 1: Verify IP is whitelisted
    if (!clientIp || !isIpWhitelisted(clientIp, this.config.ipWhitelist)) {
      console.error("Cardcom callback from non-whitelisted IP:", clientIp);
      return {
        success: false,
        message: "Unauthorized IP address",
      };
    }

    // Step 2: Verify response code (0 = success)
    if (payload.ResponseCode !== "0") {
      return {
        success: false,
        message: payload.Description || "Payment failed at Cardcom",
      };
    }

    // Step 3: Verify amount matches expected value
    const paidAmount = parseFloat(payload.Amount);
    if (Math.abs(paidAmount - expectedAmount) > 0.01) {
      // Allow 1 cent tolerance for rounding
      console.error(
        `Amount mismatch: expected ${expectedAmount}, got ${paidAmount}`
      );
      return {
        success: false,
        message: "Payment amount mismatch",
      };
    }

    // Step 4: Verify currency is ILS
    if (payload.Currency !== "ILS") {
      console.error(`Invalid currency: ${payload.Currency}`);
      return {
        success: false,
        message: "Invalid currency",
      };
    }

    // All checks passed
    return {
      success: true,
      message: "Payment verified successfully",
      transactionId: payload.ConfirmationCode,
    };
  }

  /**
   * Create refund for a transaction
   * Note: Requires additional Cardcom API permissions
   */
  async createRefund(
    transactionId: string,
    amount: number,
    reason: string
  ): Promise<{ success: boolean; message: string }> {
    const payload = {
      TerminalNumber: this.config.terminalNumber,
      ApiName: this.config.apiKey,
      InternalDealNumber: transactionId,
      Amount: amount,
      Reason: reason,
    };

    try {
      const response = await fetch(`${this.baseUrl}/Refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Cardcom API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.ResponseCode !== "0") {
        throw new Error(data.Description || "Failed to process refund");
      }

      return {
        success: true,
        message: "Refund processed successfully",
      };
    } catch (error) {
      console.error("Cardcom refund error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "שגיאה בביצוע החזר. אנא נסה שוב מאוחר יותר.",
      };
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let cardcomInstance: CardcomSDK | null = null;

export function getCardcomSDK(): CardcomSDK {
  if (!cardcomInstance) {
    const config: CardcomConfig = {
      terminalNumber: process.env.CARDCOM_TERMINAL_NUMBER || "",
      apiKey: process.env.CARDCOM_API_KEY || "",
      returnUrl: process.env.CARDCOM_RETURN_URL || "",
      notifyUrl: process.env.CARDCOM_NOTIFY_URL || "",
      ipWhitelist: process.env.CARDCOM_IP_WHITELIST || "",
    };

    // Validate required config
    if (!config.terminalNumber || !config.apiKey) {
      throw new Error(
        "Missing required Cardcom configuration. Please set CARDCOM_TERMINAL_NUMBER and CARDCOM_API_KEY."
      );
    }

    cardcomInstance = new CardcomSDK(config);
  }

  return cardcomInstance;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate payment description in Hebrew
 */
export function generatePaymentDescription(
  productName: string,
  quantity: number,
  sizes: string[]
): string {
  const sizesText = sizes.join(", ");
  return `${productName} - ${quantity} יחידות (${sizesText})`;
}

/**
 * Parse Cardcom response code to Hebrew message
 */
export function getCardcomErrorMessage(responseCode: string): string {
  const errorMessages: Record<string, string> = {
    "0": "תשלום אושר בהצלחה",
    "1": "כרטיס חסום או לא תקין",
    "2": "גבול אשראי חריגה",
    "3": "כרטיס לא תקף",
    "4": "תוקף כרטיס פג",
    "5": "CVV שגוי",
    "6": "תשלום נדחה על ידי כרטיס האשראי",
    "33": "כרטיס גנוב",
    "34": "כרטיס גנוב / אבד",
    "36": "כרטיס מוגבל",
  };

  return (
    errorMessages[responseCode] ||
    "תשלום נכשל. אנא בדוק את פרטי הכרטיס ונסה שוב."
  );
}
