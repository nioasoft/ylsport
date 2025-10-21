import { PaymentStatus } from "@prisma/client";

// ============================================================================
// PAYMENT TYPES
// ============================================================================

/**
 * Payment information
 */
export interface PaymentInfo {
  status: PaymentStatus;
  transactionId?: string | null;
  amount: number;
  currency: string;
  method: "CARDCOM";
  timestamp?: Date;
}

/**
 * Payment creation request
 */
export interface CreatePaymentRequest {
  orderNumber: string;
  amount: number;
  currency: string;
  customerEmail: string;
  productName: string;
  quantity: number;
  returnUrl: string;
  notifyUrl: string;
}

/**
 * Payment creation response
 */
export interface CreatePaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
}

/**
 * Payment callback payload (from Cardcom)
 */
export interface PaymentCallbackPayload {
  orderNumber: string;
  amount: string;
  currency: string;
  transactionId: string;
  responseCode: string;
  description?: string;
  internalDealNumber?: string;
}

/**
 * Payment verification result
 */
export interface PaymentVerificationResult {
  verified: boolean;
  message: string;
  transactionId?: string;
  error?: string;
}

/**
 * Payment update input
 */
export interface UpdatePaymentInput {
  status: PaymentStatus;
  transactionId?: string;
}

/**
 * Payment status option
 */
export interface PaymentStatusOption {
  value: PaymentStatus;
  label: string;
  description: string;
  color: string; // Tailwind color class
}

// ============================================================================
// REFUND TYPES
// ============================================================================

/**
 * Refund request
 */
export interface RefundRequest {
  orderNumber: string;
  transactionId: string;
  amount: number;
  reason: string;
}

/**
 * Refund result
 */
export interface RefundResult {
  success: boolean;
  refundId?: string;
  message: string;
  error?: string;
}

// ============================================================================
// PAYMENT STATISTICS
// ============================================================================

/**
 * Payment statistics (for admin dashboard)
 */
export interface PaymentStatistics {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  refundedPayments: number;
  totalRevenue: number;
  averageTransactionValue: number;
  successRate: number; // Percentage
}

/**
 * Payment method statistics
 */
export interface PaymentMethodStatistics {
  method: string;
  count: number;
  totalAmount: number;
  averageAmount: number;
}

// ============================================================================
// PAYMENT SECURITY TYPES
// ============================================================================

/**
 * IP verification result
 */
export interface IpVerificationResult {
  allowed: boolean;
  ip: string;
  message?: string;
}

/**
 * Payment security context
 */
export interface PaymentSecurityContext {
  clientIp: string | null;
  userAgent: string | null;
  timestamp: Date;
  orderNumber: string;
}

/**
 * Payment fraud check result
 */
export interface PaymentFraudCheckResult {
  safe: boolean;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  flags: string[];
  message: string;
}
