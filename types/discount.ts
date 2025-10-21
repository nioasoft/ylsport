import { DiscountCode, DiscountType } from "@prisma/client";

// ============================================================================
// DISCOUNT CODE TYPES
// ============================================================================

/**
 * Discount code creation input (for admin)
 */
export interface CreateDiscountCodeInput {
  code: string;
  type: DiscountType;
  value: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit?: number | null;
  minimumOrderValue?: number | null;
  isActive: boolean;
}

/**
 * Discount code update input (for admin)
 */
export interface UpdateDiscountCodeInput {
  type?: DiscountType;
  value?: number;
  validFrom?: Date;
  validUntil?: Date;
  usageLimit?: number | null;
  minimumOrderValue?: number | null;
  isActive?: boolean;
}

/**
 * Discount code validation result
 */
export interface DiscountCodeValidation {
  valid: boolean;
  message: string;
  discountCode?: DiscountCode;
  discountAmount?: number;
}

/**
 * Discount code application result
 */
export interface DiscountCodeApplication {
  code: string;
  type: DiscountType;
  value: number;
  discountAmount: number;
  newTotal: number;
}

/**
 * Discount code summary (for admin dashboard)
 */
export interface DiscountCodeSummary {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  usageCount: number;
  usageLimit: number | null;
  validUntil: Date;
  isActive: boolean;
  isExpired: boolean;
  isMaxedOut: boolean;
}

/**
 * Discount type option
 */
export interface DiscountTypeOption {
  value: DiscountType;
  label: string;
  description: string;
  format: (value: number) => string; // Formatting function
}

/**
 * Discount code statistics (for admin)
 */
export interface DiscountCodeStatistics {
  totalCodes: number;
  activeCodes: number;
  expiredCodes: number;
  totalUsage: number;
  totalDiscountGiven: number;
  averageDiscountPerOrder: number;
}

// ============================================================================
// DISCOUNT VALIDATION TYPES
// ============================================================================

/**
 * Discount code validation rules
 */
export interface DiscountValidationRules {
  code: string;
  subtotal: number;
  currentDate: Date;
}

/**
 * Discount validation error
 */
export interface DiscountValidationError {
  code: "INVALID_CODE" | "EXPIRED" | "NOT_YET_VALID" | "MAX_USAGE_REACHED" | "MINIMUM_NOT_MET" | "INACTIVE";
  message: string;
}

// ============================================================================
// DISCOUNT CALCULATION TYPES
// ============================================================================

/**
 * Discount calculation input
 */
export interface DiscountCalculationInput {
  subtotal: number;
  type: DiscountType;
  value: number;
}

/**
 * Discount calculation result
 */
export interface DiscountCalculationResult {
  discountAmount: number;
  finalAmount: number;
  discountPercentage: number; // Calculated percentage for display
}
