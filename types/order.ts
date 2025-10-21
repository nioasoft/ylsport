import { Order, OrderItem, OrderStatus, PaymentStatus, ShippingMethod } from "@prisma/client";

// ============================================================================
// ORDER TYPES
// ============================================================================

/**
 * Full order with all relationships
 */
export type OrderWithItems = Order & {
  items: OrderItem[];
  discountCode?: {
    id: string;
    code: string;
    type: string;
    value: number;
  } | null;
};

/**
 * Order creation input (from checkout form)
 */
export interface CreateOrderInput {
  // Customer Information
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Shipping Information
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingMethod: ShippingMethod;

  // Order Items
  items: {
    productSize: string;
    quantity: number;
  }[];

  // Pricing
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;

  // Optional Discount Code
  discountCode?: string;
}

/**
 * Order update input (for admin)
 */
export interface UpdateOrderInput {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  trackingNumber?: string | null;
}

/**
 * Order summary for display
 */
export interface OrderSummary {
  orderNumber: string;
  customerName: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
}

/**
 * Order filter options (for admin dashboard)
 */
export interface OrderFilterOptions {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string; // Search by order number, customer name, or email
}

/**
 * Order statistics (for admin dashboard)
 */
export interface OrderStatistics {
  totalOrders: number;
  pendingPayment: number;
  paid: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
  averageOrderValue: number;
}

// ============================================================================
// ORDER ITEM TYPES
// ============================================================================

/**
 * Order item creation input
 */
export interface CreateOrderItemInput {
  productName: string;
  productSize: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

/**
 * Order item summary for display
 */
export interface OrderItemSummary {
  productName: string;
  productSize: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

// ============================================================================
// SHIPPING TYPES
// ============================================================================

/**
 * Shipping information
 */
export interface ShippingInfo {
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingMethod: ShippingMethod;
  shippingCost: number;
  trackingNumber?: string | null;
}

/**
 * Shipping method option
 */
export interface ShippingMethodOption {
  value: ShippingMethod;
  label: string;
  cost: number;
  description: string;
}

// ============================================================================
// ORDER STATUS TYPES
// ============================================================================

/**
 * Order status transition
 */
export interface OrderStatusTransition {
  from: OrderStatus;
  to: OrderStatus;
  timestamp: Date;
  note?: string;
}

/**
 * Order status option
 */
export interface OrderStatusOption {
  value: OrderStatus;
  label: string;
  description: string;
  color: string; // Tailwind color class
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

/**
 * Paginated orders response
 */
export interface PaginatedOrders {
  orders: OrderWithItems[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}
