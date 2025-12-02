import { createHmac, randomBytes } from 'crypto';
import { TranzilaCallbackData } from './validation';

// ============================================================================
// TYPES
// ============================================================================

export interface TranzilaPaymentRequest {
  amount: number;
  currency_code: string; // 'ILS', 'USD'
  transaction_id?: string; // Internal order ID
  success_url?: string;
  cancel_url?: string;
  notify_url?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_id?: string; // Israeli ID number
  product_name?: string;
  items?: TranzilaItem[];
}

export interface TranzilaItem {
  name: string;
  code?: string;
  unit_price: number;
  units_number: number;
  type?: string; // 'I' for item
}

interface TranzilaResponse {
  success: boolean;
  payment_url?: string;
  transaction_id?: string; // Tranzila's transaction ID
  error?: string;
}

interface TranzilaVerificationResult {
  success: boolean;
  message: string;
  transactionId?: string;
}

export interface TranzilaInvoiceRequest {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCity?: string;
  items: {
    name: string;
    code?: string;
    unitPrice: number;
    quantity: number;
  }[];
  paymentMethod: 'credit_card' | 'cash' | 'bank_transfer';
  amount: number;
  ccLastDigits?: string;
  transactionIndex?: number;
}

interface TranzilaInvoiceResponse {
  success: boolean;
  documentId?: string;
  documentNumber?: string;
  retrievalKey?: string;
  error?: string;
}

// ============================================================================
// RESPONSE CODES
// ============================================================================

/**
 * Tranzila response codes
 * 000 = Success
 * All other codes indicate various failures
 */
const TRANZILA_RESPONSE_CODES: Record<string, string> = {
  '000': 'תשלום אושר בהצלחה',
  '001': 'כרטיס חסום - יש להחרים',
  '002': 'כרטיס גנוב - יש להחרים',
  '003': 'יש לפנות לחברת האשראי',
  '004': 'סירוב',
  '005': 'מזויף',
  '006': 'CVV שגוי',
  '007': 'יש להחרים את הכרטיס',
  '008': 'תקלה בבניית מספר רשומה',
  '009': 'תקלה בשליחת נתונים',
  '010': 'תקלה בקליטת נתונים',
  '011': 'עסקה בעייתית - לבדוק',
  '012': 'עסקה נדחתה',
  '013': 'קוד מנפיק לא תקין',
  '014': 'עסקה לא מאושרת למסוף',
  '015': 'מספר כרטיס לא תקין',
  '017': 'סכום לחיוב שגוי',
  '018': 'תקשורת לחברה - נסה שוב',
  '019': 'שגיאה בהעברת נתונים',
  '020': 'לא ניתן לבצע עסקה לא קיימת',
  '021': 'קוד ישות שגוי',
  '022': 'רמת אבטחה לא מספיקה',
  '023': 'לא הוזן מספר כרטיס',
  '024': 'מספר תשלומים לא תקין',
  '025': 'לא הוזן מספר ת.ז.',
  '026': 'סך הכל חלקי שגוי',
  '027': 'לא ניתן לבצע עסקת VOID',
  '029': 'לא הוזן CVV',
  '030': 'פרמטרים לא מספקים',
  '033': 'כרטיס לא בתוקף',
  '034': 'כרטיס לא קיים',
  '035': 'כרטיס מוגבל לשימוש',
  '036': 'פג תוקף',
  '039': 'CVV שגוי',
  '057': 'מספר עסקים לא תקין',
  '059': 'לא ניתן לעבד עסקה',
  '060': 'שגיאת מערכת',
  '061': 'תקלה בהעברת עסקה',
  '062': 'עסקה הופסקה',
  '063': 'עסקה נדחתה',
  '064': 'קוד אישור לא תקין',
  '065': 'מטבע לא חוקי',
};

/**
 * Get Hebrew error message for Tranzila response code
 */
export function getTranzilaErrorMessage(responseCode: string): string {
  return TRANZILA_RESPONSE_CODES[responseCode] ||
    'תשלום נכשל. אנא בדוק את פרטי הכרטיס ונסה שוב.';
}

// ============================================================================
// TRANZILA SDK CLASS
// ============================================================================

/**
 * Tranzila SDK for payment processing
 * Uses HMAC-SHA256 authentication as per Tranzila API docs
 */
export class TranzilaSDK {
  private apiHost: string;
  private terminalName: string;
  private appKey: string;
  private secret: string;

  constructor() {
    this.apiHost = (process.env.TRANZILA_API_HOST || 'https://api.tranzila.com').trim();
    this.terminalName = (process.env.TRANZILA_TERMINAL_NAME || '').trim();
    this.appKey = (process.env.TRANZILA_PUBLIC_KEY || '').trim();
    this.secret = (process.env.TRANZILA_PRIVATE_KEY || '').trim();

    if (!this.terminalName || !this.secret || !this.appKey) {
      console.error('Tranzila configuration missing: TERMINAL_NAME, PUBLIC_KEY or PRIVATE_KEY not found');
    }
  }

  /**
   * Generate authentication headers for Tranzila API
   * Uses HMAC-SHA256: access_key = HMAC-SHA256(app_key, secret + timestamp + nonce)
   */
  private generateAuthHeaders(): Record<string, string> {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = randomBytes(40).toString('hex');

    // Generate access key: HMAC-SHA256(app_key, secret + timestamp + nonce)
    const accessKey = createHmac('sha256', this.secret + timestamp + nonce)
      .update(this.appKey)
      .digest('hex');

    return {
      'Content-Type': 'application/json',
      'X-tranzila-api-app-key': this.appKey,
      'X-tranzila-api-request-time': timestamp.toString(),
      'X-tranzila-api-nonce': nonce,
      'X-tranzila-api-access-token': accessKey,
    };
  }

  /**
   * Create a new payment request (generate payment link)
   * Endpoint: https://api.tranzila.com/v1/pr/create
   */
  async createPayment(request: TranzilaPaymentRequest): Promise<TranzilaResponse> {
    const endpoint = `${this.apiHost}/v1/pr/create`;

    // Parse phone number for Tranzila format
    const phone = request.customer_phone?.replace(/\D/g, '') || '';
    const phoneAreaCode = phone.substring(0, 3); // e.g., "050"
    const phoneNumber = phone.substring(3); // e.g., "7778080"

    // Build items array
    const items = request.items || [
      {
        name: request.product_name || 'מוצר',
        code: request.transaction_id || '1',
        unit_price: request.amount,
        units_number: 1,
        type: 'I',
        unit_type: 1,
        price_type: 'G',
        currency_code: request.currency_code,
      }
    ];

    // Build the IPN URL for payment callbacks
    // Always use production URL for IPN - Tranzila can't reach localhost
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yl-sport.co.il';
    const ipnUrl = siteUrl.includes('localhost')
      ? 'https://www.yl-sport.co.il/api/payment/tranzila-callback'
      : `${siteUrl}/api/payment/tranzila-callback`;

    // Prepare payload according to Tranzila API format
    const payload: Record<string, unknown> = {
      terminal_name: this.terminalName,
      action_type: 2, // Payment request
      response_language: 'hebrew',
      request_currency: request.currency_code,
      request_vat: 17, // Israeli VAT
      payments_number: 1,
      created_by_user: 'website',
      payment_plans: [1], // Regular payment
      payment_methods: [1], // Credit card
      // IPN callback URL - Tranzila will POST here after payment
      ipn_url: ipnUrl,
      // Pass our order ID so we can identify it in callback
      order_id: request.transaction_id,
      // Success/fail redirect URLs
      success_url: request.success_url || `${siteUrl}/order/confirmation`,
      fail_url: request.cancel_url || `${siteUrl}/checkout?payment=failed`,
      client: {
        name: request.customer_name || '',
        contact_person: request.customer_name || '',
        email: request.customer_email || '',
        phone_country_code: '972',
        phone_area_code: phoneAreaCode.replace(/^0/, ''), // Remove leading 0
        phone_number: phoneNumber,
        // ID must be 5-9 alphanumeric chars, use placeholder if not provided
        id: request.customer_id || '000000000',
      },
      items: items.map((item, index) => ({
        id: index + 1,
        code: item.code || `item-${index + 1}`,
        name: item.name,
        unit_price: item.unit_price,
        type: item.type || 'I',
        units_number: item.units_number,
        unit_type: 1,
        price_type: 'G',
        currency_code: request.currency_code,
      })),
      // Notification settings - email to customer (REQUIRED for PR)
      send_email: request.customer_email ? {
        sender_name: 'YL Sport',
        sender_email: 'noreply@yl-sport.co.il',
      } : undefined,
      // Document/Receipt settings - automatic invoice generation
      // document_type: 1 = קבלה, 2 = חשבונית מס, 3 = חשבונית מס קבלה
      create_document: true,
      document_type: 3, // חשבונית מס קבלה
      // Payment label - this is the merchant name shown on the payment page
      payment_label: 'YL Sport',
    };

    const headers = this.generateAuthHeaders();

    try {
      console.log('Sending Tranzila request to:', endpoint);
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log('Tranzila raw response:', responseText);

      let responseData: any;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        return {
          success: false,
          error: `Invalid response: ${responseText.substring(0, 200)}`,
        };
      }

      console.log('Tranzila response:', JSON.stringify(responseData, null, 2));

      // Check for error response
      if (responseData.code && responseData.code !== 200) {
        return {
          success: false,
          error: responseData.message || `API Error: ${responseData.code}`,
        };
      }

      // Check for successful response (error_code 0 means success)
      if (responseData.error_code === 0) {
        // Use pr_link if available, otherwise construct from pr_id
        const paymentUrl = responseData.pr_link ||
                           responseData.payment_url ||
                           responseData.url ||
                           (responseData.pr_id ? `https://direct.tranzila.com/${this.terminalName}/paymentrequest.php?pr_id=${responseData.pr_id}` : null);

        if (paymentUrl) {
          return {
            success: true,
            payment_url: paymentUrl,
            transaction_id: responseData.pr_id?.toString() || responseData.request_id || responseData.id,
          };
        }
      }

      // Check for payment URL in other response formats
      const paymentUrl = responseData.payment_url ||
                         responseData.url ||
                         responseData.payment_link ||
                         responseData.pr_link ||
                         responseData.link;

      if (paymentUrl) {
        return {
          success: true,
          payment_url: paymentUrl,
          transaction_id: responseData.request_id || responseData.id || responseData.pr_id,
        };
      }

      // If we got an ID, construct the payment URL
      if (responseData.id || responseData.pr_id) {
        const prId = responseData.id || responseData.pr_id;
        return {
          success: true,
          payment_url: `https://direct.tranzila.com/${this.terminalName}/paymentrequest.php?pr_id=${prId}`,
          transaction_id: prId.toString(),
        };
      }

      return {
        success: false,
        error: 'No payment URL returned. Response: ' + JSON.stringify(responseData),
      };

    } catch (error) {
      console.error('Tranzila createPayment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Verify callback from Tranzila
   * Checks response code and amount
   */
  verifyCallback(
    callbackData: TranzilaCallbackData,
    expectedAmount: number
  ): TranzilaVerificationResult {
    // Step 1: Verify response code (000 = success)
    if (callbackData.Response !== '000') {
      const errorMessage = getTranzilaErrorMessage(callbackData.Response);
      console.error(`Tranzila payment failed. Code: ${callbackData.Response}, Message: ${errorMessage}`);

      return {
        success: false,
        message: errorMessage,
      };
    }

    // Step 2: Verify amount matches expected value
    const paidAmount = callbackData.sum;
    if (Math.abs(paidAmount - expectedAmount) > 0.01) {
      // Allow 1 agora tolerance for rounding
      console.error(
        `Amount mismatch: expected ${expectedAmount}, got ${paidAmount}`
      );
      return {
        success: false,
        message: 'סכום התשלום אינו תואם',
      };
    }

    // All checks passed
    return {
      success: true,
      message: 'תשלום אומת בהצלחה',
      transactionId: callbackData.ConfirmationCode || callbackData.index,
    };
  }

  /**
   * Create invoice/receipt document after successful payment
   * Endpoint: https://billing5.tranzila.com/api/documents_db/create_document
   * document_type: "IR" = חשבונית מס קבלה (Invoice-Receipt)
   */
  async createInvoice(request: TranzilaInvoiceRequest): Promise<TranzilaInvoiceResponse> {
    const endpoint = 'https://billing5.tranzila.com/api/documents_db/create_document';

    // Map payment method to Tranzila code
    const paymentMethodMap: Record<string, number> = {
      'credit_card': 1,
      'cash': 5,
      'bank_transfer': 4,
    };

    const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd format

    const payload = {
      terminal_name: this.terminalName,
      document_date: today,
      document_type: 'IR', // Invoice-Receipt = חשבונית מס קבלה
      action: 1, // 1 = Debit (חיוב)
      document_language: 'heb',
      document_currency_code: 'ILS',
      // vat_percent - not set, will use terminal default settings
      response_language: 'heb',

      // Client details
      client_name: request.customerName,
      client_email: request.customerEmail,
      client_address_line_1: request.customerAddress || '',
      client_city: request.customerCity || '',
      client_country_code: 'IL',

      // Items
      items: request.items.map((item, index) => ({
        type: 'I',
        code: item.code || `ITEM-${index + 1}`,
        name: item.name,
        price_type: 'G', // Gross (כולל מע"מ)
        unit_price: item.unitPrice,
        units_number: item.quantity,
        unit_type: 1,
        currency_code: 'ILS',
        to_doc_currency_exchange_rate: 1,
      })),

      // Payments
      payments: [
        {
          payment_method: paymentMethodMap[request.paymentMethod] || 1,
          payment_date: today,
          amount: request.amount,
          currency_code: 'ILS',
          to_doc_currency_exchange_rate: 1,
          ...(request.paymentMethod === 'credit_card' && request.ccLastDigits && {
            cc_last_4_digits: request.ccLastDigits,
            cc_credit_term: 1, // Regular payment
            cc_brand: 1, // Default brand
          }),
        },
      ],

      // Transaction index for correlation (optional)
      ...(request.transactionIndex && { txnindex: request.transactionIndex }),

      created_by_system: 'YL Sport Website',

      // Send document to client via email
      send_document_to_client: true,
    };

    const headers = this.generateAuthHeaders();

    try {
      console.log('Creating Tranzila invoice:', endpoint);
      console.log('Invoice payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log('Tranzila invoice raw response:', responseText);

      let responseData: any;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        return {
          success: false,
          error: `Invalid response: ${responseText.substring(0, 200)}`,
        };
      }

      console.log('Tranzila invoice response:', JSON.stringify(responseData, null, 2));

      // Check for success (status_code 0)
      if (responseData.status_code === 0) {
        return {
          success: true,
          documentId: responseData.document?.id,
          documentNumber: responseData.document?.number,
          retrievalKey: responseData.document?.retrieval_key,
        };
      }

      return {
        success: false,
        error: responseData.status_msg || `Error code: ${responseData.status_code}`,
      };

    } catch (error) {
      console.error('Tranzila createInvoice error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let tranzilaInstance: TranzilaSDK | null = null;

export function getTranzilaSDK(): TranzilaSDK {
  if (!tranzilaInstance) {
    tranzilaInstance = new TranzilaSDK();
  }
  return tranzilaInstance;
}
