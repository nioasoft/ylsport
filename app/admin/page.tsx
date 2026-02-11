"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPhoneNumber } from "@/lib/sms-templates";
import { useToast } from "@/hooks/use-toast";

// Types
interface OrderItem {
  productName: string;
  productSize: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingMethod: string;
  status: string;
  paymentStatus: string;
  trackingNumber: string | null;
  cancellationReason: string | null;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  items: OrderItem[];
  discountCode: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"ORDERS" | "EXCHANGES">("ORDERS");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Selected order for details/editing
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Statistics
  const [stats, setStats] = useState<{
    totalOrders: number;
    monthlyOrders: number;
    totalRevenue: number;
    monthlyRevenue: number;
    pendingProcessing: number;
    staleShipped: number;
  } | null>(null);

  // Last refresh time
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Status update
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  // Tracking update
  const [updatingTracking, setUpdatingTracking] = useState(false);
  const [newTrackingNumber, setNewTrackingNumber] = useState("");

  // Exchange Request
  const [creatingExchange, setCreatingExchange] = useState(false);
  const [exchangeLink, setExchangeLink] = useState<string | null>(null);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (statusFilter && statusFilter !== "ALL") {
        params.append("status", statusFilter);
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(`/api/orders?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
        setPagination(data.pagination);
        setLastRefresh(new Date());
      } else {
        throw new Error(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בטעינת ההזמנות");
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch exchanges
  const fetchExchanges = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/exchanges");
      const data = await res.json();
      if (data.success) {
        setExchanges(data.exchanges);
      }
    } catch (err) {
      console.error("Fetch exchanges error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateExchangeStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/exchanges", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchExchanges();
        toast({ title: "הסטטוס עודכן" });
      }
    } catch (err) {
      toast({ title: "שגיאה בעדכון", variant: "destructive" });
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Fetch stats error:", err);
    }
  };

  // Load orders and stats on mount and when filters change
  useEffect(() => {
    fetchOrders();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, statusFilter]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Only refresh if not loading and no modal open
      if (!loading && !showDetailModal) {
        fetchOrders();
        fetchStats();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, showDetailModal]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        fetchOrders();
      } else {
        setPagination({ ...pagination, page: 1 });
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Open order details
  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setNewTrackingNumber(order.trackingNumber || "");
    setShowDetailModal(true);
  };

  // Update order status
  const updateOrderStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      setUpdatingStatus(true);

      const response = await fetch(`/api/orders/${selectedOrder.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      // Refresh orders
      await fetchOrders();

      // Update selected order
      setSelectedOrder({ ...selectedOrder, status: newStatus });

      toast({
        title: "הסטטוס עודכן",
        description: "הסטטוס עודכן בהצלחה",
      });
    } catch (err) {
      toast({
        title: "שגיאה",
        description: err instanceof Error ? err.message : "שגיאה בעדכון הסטטוס",
        variant: "destructive",
      });
      console.error("Update status error:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Update tracking number
  const updateTrackingNumber = async () => {
    if (!selectedOrder || !newTrackingNumber.trim()) {
      toast({
        title: "שגיאה",
        description: "נא להזין מספר מעקב",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdatingTracking(true);

      const response = await fetch(`/api/orders/${selectedOrder.id}/tracking`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber: newTrackingNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update tracking number");
      }

      // Refresh orders
      await fetchOrders();
      await fetchStats();

      // Close modal and show success toast
      setShowDetailModal(false);
      setSelectedOrder(null);

      toast({
        title: "מספר המעקב עודכן",
        description: data.message || "מספר המעקב עודכן והתראות נשלחו ללקוח",
      });
    } catch (err) {
      toast({
        title: "שגיאה",
        description: err instanceof Error ? err.message : "שגיאה בעדכון מספר המעקב",
        variant: "destructive",
      });
      console.error("Update tracking error:", err);
    } finally {
      setUpdatingTracking(false);
    }
  };

  // Create Exchange Request
  const createExchangeRequest = async () => {
    if (!selectedOrder) return;

    setCreatingExchange(true);
    setExchangeLink(null);
    try {
      const res = await fetch("/api/admin/exchanges/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: selectedOrder.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const link = `${window.location.origin}/exchanges/${data.token}`;
      setExchangeLink(link);

      toast({
        title: "בקשת החלפה נוצרה",
        description: "הקישור נוצר בהצלחה",
      });
    } catch (err) {
      toast({
        title: "שגיאה",
        description: "נכשל ביצירת בקשת החלפה",
        variant: "destructive",
      });
    } finally {
      setCreatingExchange(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "הועתק",
      description: "הקישור הועתק ללוח",
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-800";
      case "PAID":
        return "bg-blue-100 text-blue-800";
      case "PROCESSING":
        return "bg-purple-100 text-purple-800";
      case "SHIPPED":
        return "bg-green-100 text-green-800";
      case "DELIVERED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
        return "bg-violet-100 text-violet-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status text in Hebrew
  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return "ממתין לתשלום";
      case "PAID":
        return "שולם";
      case "PROCESSING":
        return "בטיפול";
      case "SHIPPED":
        return "נשלח";
      case "DELIVERED":
        return "נמסר";
      case "CANCELLED":
        return "בוטל";
      case "REFUNDED":
        return "הוחזר";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ניהול הזמנות</h1>
          <p className="text-gray-600 mt-1">
            סה&quot;כ {pagination.total} הזמנות
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            עודכן: {lastRefresh.toLocaleTimeString("he-IL")}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { fetchOrders(); fetchStats(); }}
            disabled={loading}
          >
            {loading ? "מרענן..." : "רענן עכשיו"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-6 py-2 font-medium ${activeTab === "ORDERS" ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
          onClick={() => setActiveTab("ORDERS")}
        >
          הזמנות
        </button>
        <button
          className={`px-6 py-2 font-medium ${activeTab === "EXCHANGES" ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
          onClick={() => {
            setActiveTab("EXCHANGES");
            fetchExchanges();
          }}
        >
          החלפות
        </button>
      </div>

      {activeTab === "ORDERS" ? (
        <>
          {/* Statistics Dashboard */}
          {stats && (
            <div className="space-y-4">
              {/* ... existing stats ... */}
              {(stats.pendingProcessing > 0 || stats.staleShipped > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stats.pendingProcessing > 0 && (
                    <Card className="border-orange-300 bg-orange-50">
                      <CardContent className="p-4">
                        <p className="text-sm text-orange-700 font-medium">ממתינות לטיפול</p>
                        <p className="text-3xl font-bold text-orange-600">{stats.pendingProcessing}</p>
                        <p className="text-xs text-orange-600 mt-1">הזמנות ששולמו וממתינות למשלוח</p>
                      </CardContent>
                    </Card>
                  )}
                  {stats.staleShipped > 0 && (
                    <Card className="border-red-300 bg-red-50">
                      <CardContent className="p-4">
                        <p className="text-sm text-red-700 font-medium">תקועות במשלוח</p>
                        <p className="text-3xl font-bold text-red-600">{stats.staleShipped}</p>
                        <p className="text-xs text-red-600 mt-1">נשלחו לפני יותר מ-10 ימים</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* General Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">סה&quot;כ הזמנות</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">הזמנות החודש</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.monthlyOrders}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">סה&quot;כ הכנסות</p>
                    <p className="text-2xl font-bold text-green-600">₪{stats.totalRevenue.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">הכנסות החודש</p>
                    <p className="text-2xl font-bold text-green-600">₪{stats.monthlyRevenue.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>סינון</CardTitle>
              <CardDescription>סנן והצג הזמנות לפי סטטוס ופרטי לקוח</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status-filter">סטטוס</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status-filter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">הכל</SelectItem>
                      <SelectItem value="PENDING_PAYMENT">ממתין לתשלום</SelectItem>
                      <SelectItem value="PAID">שולם</SelectItem>
                      <SelectItem value="PROCESSING">בטיפול</SelectItem>
                      <SelectItem value="SHIPPED">נשלח</SelectItem>
                      <SelectItem value="DELIVERED">נמסר</SelectItem>
                      <SelectItem value="CANCELLED">בוטל</SelectItem>
                      <SelectItem value="REFUNDED">הוחזר</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="search">חיפוש</Label>
                  <Input
                    id="search"
                    placeholder="מספר הזמנה, שם, אימייל, טלפון..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-gray-600">טוען הזמנות...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center text-red-600">{error}</div>
              ) : orders.length === 0 ? (
                <div className="p-8 text-center text-gray-600">לא נמצאו הזמנות</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">מספר הזמנה</TableHead>
                        <TableHead className="text-right">לקוח</TableHead>
                        <TableHead className="text-right">טלפון</TableHead>
                        <TableHead className="text-right">סכום</TableHead>
                        <TableHead className="text-right">סטטוס</TableHead>
                        <TableHead className="text-right">מעקב</TableHead>
                        <TableHead className="text-right">תאריך</TableHead>
                        <TableHead className="text-right">פעולות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell
                            className="font-medium cursor-pointer text-pink-600 hover:underline"
                            onClick={() => openOrderDetails(order)}
                          >
                            {order.orderNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customerName}</div>
                              <div className="text-sm text-gray-600">
                                {order.customerEmail}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatPhoneNumber(order.customerPhone)}
                          </TableCell>
                          <TableCell className="font-medium">
                            ₪{order.total.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusText(order.status)}
                              </Badge>
                              {order.status === "CANCELLED" && order.cancellationReason && (
                                <p className="text-xs text-red-600 mt-1">{order.cancellationReason}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {order.trackingNumber || "-"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(order.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openOrderDetails(order)}
                            >
                              פרטים
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              >
                הקודם
              </Button>
              <div className="flex items-center px-4">
                עמוד {pagination.page} מתוך {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              >
                הבא
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">טוען החלפות...</div>
            ) : exchanges.length === 0 ? (
              <div className="p-8 text-center">אין בקשות החלפה כרגע</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">הזמנה</TableHead>
                    <TableHead className="text-right">לקוח</TableHead>
                    <TableHead className="text-right">פרטי החלפה</TableHead>
                    <TableHead className="text-right">סטטוס</TableHead>
                    <TableHead className="text-right">תאריך תשלום</TableHead>
                    <TableHead className="text-right">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exchanges.map((ex) => (
                    <TableRow key={ex.id}>
                      <TableCell className="font-medium">{ex.order.orderNumber}</TableCell>
                      <TableCell>
                        {ex.order.customerName}
                        <div className="text-xs text-gray-500">{formatPhoneNumber(ex.order.customerPhone)}</div>
                      </TableCell>
                      <TableCell className="text-sm max-w-[200px]">
                        <div className="font-semibold text-red-600">מחזיר: {ex.returnItem || "טרם מולא"}</div>
                        <div className="font-semibold text-green-600">מבקש: {ex.requestedItem || "טרם מולא"}</div>
                        <div className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">{ex.customerNote}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          ex.status === "PAID" ? "bg-green-100 text-green-800" :
                          ex.status === "PROCESSED" ? "bg-gray-100 text-gray-800" :
                          "bg-yellow-100 text-yellow-800"
                        }>
                          {ex.status === "PAID" ? "שולם - לטיפול" :
                           ex.status === "PROCESSED" ? "טופל" : "ממתין לתשלום"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {ex.paymentDate ? formatDate(ex.paymentDate) : "-"}
                      </TableCell>
                      <TableCell>
                        {ex.status === "PAID" && (
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => updateExchangeStatus(ex.id, "PROCESSED")}
                          >
                            סמן כטופל
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Order Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white shadow-xl border">
          <DialogHeader>
            <DialogTitle>פרטי הזמנה {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              צפייה ועדכון פרטי הזמנה
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-2">פרטי לקוח</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">שם:</span>{" "}
                    {selectedOrder.customerName}
                  </div>
                  <div>
                    <span className="text-gray-600">אימייל:</span>{" "}
                    {selectedOrder.customerEmail}
                  </div>
                  <div>
                    <span className="text-gray-600">טלפון:</span>{" "}
                    {formatPhoneNumber(selectedOrder.customerPhone)}
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div>
                <h3 className="font-semibold mb-2">פרטי משלוח</h3>
                <div className="text-sm">
                  <div>{selectedOrder.shippingAddress}</div>
                  <div>
                    {selectedOrder.shippingCity}, {selectedOrder.shippingPostalCode}
                  </div>
                  <div className="text-gray-600 mt-1">
                    שיטת משלוח: {selectedOrder.shippingMethod}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-2">פריטים בהזמנה</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm border-b pb-2"
                    >
                      <div>
                        {item.productName} - מידה {item.productSize}
                        <span className="text-gray-600"> (x{item.quantity})</span>
                      </div>
                      <div>₪{item.totalPrice.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>סכום ביניים:</span>
                    <span>₪{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>משלוח:</span>
                    <span>₪{selectedOrder.shippingCost.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>הנחה:</span>
                      <span>-₪{selectedOrder.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base border-t pt-2">
                    <span>סה&quot;כ:</span>
                    <span>₪{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Cancellation Reason */}
              {selectedOrder.status === "CANCELLED" && selectedOrder.cancellationReason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                  <span className="font-semibold">סיבת ביטול: </span>
                  {selectedOrder.cancellationReason}
                </div>
              )}

              {/* Status Update */}
              <div>
                <Label htmlFor="status-update">עדכון סטטוס</Label>
                <div className="flex gap-2">
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger id="status-update">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING_PAYMENT">
                        ממתין לתשלום
                      </SelectItem>
                      <SelectItem value="PAID">שולם</SelectItem>
                      <SelectItem value="PROCESSING">בטיפול</SelectItem>
                      <SelectItem value="SHIPPED">נשלח</SelectItem>
                      <SelectItem value="DELIVERED">נמסר</SelectItem>
                      <SelectItem value="CANCELLED">בוטל</SelectItem>
                      <SelectItem value="REFUNDED">הוחזר</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={updateOrderStatus}
                    disabled={updatingStatus || newStatus === selectedOrder.status}
                  >
                    {updatingStatus ? "מעדכן..." : "עדכן"}
                  </Button>
                </div>
              </div>

              {/* Tracking Number Update */}
              <div>
                <Label htmlFor="tracking-update">מספר מעקב</Label>
                <div className="flex gap-2">
                  <Input
                    id="tracking-update"
                    value={newTrackingNumber}
                    onChange={(e) => setNewTrackingNumber(e.target.value)}
                    placeholder="הזן מספר מעקב..."
                  />
                  <Button
                    onClick={updateTrackingNumber}
                    disabled={
                      updatingTracking ||
                      !newTrackingNumber.trim() ||
                      newTrackingNumber === selectedOrder.trackingNumber
                    }
                  >
                    {updatingTracking ? "מעדכן..." : "עדכן"}
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  עדכון מספר המעקב ישלח אוטומטית מייל והודעת SMS ללקוח
                </p>
              </div>

              {/* Exchange Request */}
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">יצירת החלפה / החזרה</h3>
                {!exchangeLink ? (
                  <Button
                    variant="secondary"
                    onClick={createExchangeRequest}
                    disabled={creatingExchange}
                    className="w-full sm:w-auto"
                  >
                    {creatingExchange ? "מייצר קישור..." : "צור קישור להחלפה (29 ₪ משלוח)"}
                  </Button>
                ) : (
                  <div className="bg-green-50 p-3 rounded-md border border-green-200">
                    <Label className="text-green-800">קישור להחלפה נוצר:</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={exchangeLink} readOnly className="bg-white" />
                      <Button onClick={() => copyToClipboard(exchangeLink)} size="icon" variant="outline">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              סגור
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
