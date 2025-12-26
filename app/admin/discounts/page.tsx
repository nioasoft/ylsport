"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";

type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

interface DiscountCode {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  validFrom: Date;
  validUntil: Date | null;
  usageLimit: number | null;
  usageCount: number;
  minimumOrderValue: number | null;
  isActive: boolean;
  createdAt: Date;
  ordersCount?: number;
}

interface Statistics {
  totalCodes: number;
  totalUsage: number;
}

export default function DiscountCodesPage() {
  const { toast } = useToast();
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalCodes: 0,
    totalUsage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("all");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<DiscountCode | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    type: "PERCENTAGE" as DiscountType,
    value: 10,
    validFrom: new Date().toISOString().split("T")[0],
    validUntil: "2099-12-31",
    usageLimit: null as number | null,
    minimumOrderValue: null as number | null,
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDiscountCodes = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (isActiveFilter !== "all") {
        params.append("isActive", isActiveFilter === "true" ? "true" : "false");
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(`/api/discounts?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch discount codes");
      }

      const data = await response.json();

      if (data.success) {
        setDiscountCodes(data.discountCodes);
        setStatistics(data.statistics);
      } else {
        throw new Error(data.message || "Failed to fetch discount codes");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בטעינת קודי הנחה");
      console.error("Fetch discount codes error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscountCodes();
  }, [isActiveFilter, searchQuery]);

  const handleCreate = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          value: parseFloat(formData.value.toString()),
          validFrom: new Date(formData.validFrom),
          validUntil: new Date(formData.validUntil),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create discount code");
      }

      toast({
        title: "קוד הנחה נוצר",
        description: "קוד הנחה חדש נוצר בהצלחה",
      });

      setShowCreateModal(false);
      resetForm();
      fetchDiscountCodes();
    } catch (err) {
      toast({
        title: "שגיאה",
        description: err instanceof Error ? err.message : "שגיאה ביצירת קוד ההנחה",
        variant: "destructive",
      });
      console.error("Create discount code error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedCode) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/discounts/${selectedCode.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          value: parseFloat(formData.value.toString()),
          validFrom: new Date(formData.validFrom),
          validUntil: new Date(formData.validUntil),
          usageLimit: formData.usageLimit,
          minimumOrderValue: formData.minimumOrderValue,
          isActive: formData.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update discount code");
      }

      toast({
        title: "קוד הנחה עודכן",
        description: "קוד ההנחה עודכן בהצלחה",
      });

      setShowEditModal(false);
      resetForm();
      fetchDiscountCodes();
    } catch (err) {
      toast({
        title: "שגיאה",
        description: err instanceof Error ? err.message : "שגיאה בעדכון קוד ההנחה",
        variant: "destructive",
      });
      console.error("Update discount code error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCode) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/discounts/${selectedCode.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete discount code");
      }

      toast({
        title: "קוד הנחה נמחק",
        description: "קוד ההנחה נמחק בהצלחה",
      });

      setShowDeleteModal(false);
      setSelectedCode(null);
      fetchDiscountCodes();
    } catch (err) {
      toast({
        title: "שגיאה",
        description: err instanceof Error ? err.message : "שגיאה במחיקת קוד ההנחה",
        variant: "destructive",
      });
      console.error("Delete discount code error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (code: DiscountCode) => {
    setSelectedCode(code);
    setFormData({
      code: code.code,
      type: code.type,
      value: code.value,
      validFrom: new Date(code.validFrom).toISOString().split("T")[0],
      validUntil: code.validUntil
        ? new Date(code.validUntil).toISOString().split("T")[0]
        : "2099-12-31",
      usageLimit: code.usageLimit,
      minimumOrderValue: code.minimumOrderValue,
      isActive: code.isActive,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      code: "",
      type: "PERCENTAGE",
      value: 10,
      validFrom: new Date().toISOString().split("T")[0],
      validUntil: "2099-12-31",
      usageLimit: null,
      minimumOrderValue: null,
      isActive: true,
    });
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getTypeText = (type: DiscountType) => {
    return type === "PERCENTAGE" ? "אחוז" : "סכום קבוע";
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800">פעיל</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">לא פעיל</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">קודי הנחה</h1>
          <p className="mt-1 text-gray-600">ניהול קודי הנחה ומעקב אחר שימוש</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
        >
          צור קוד חדש
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>סטטיסטיקות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-gray-600">סה&quot;כ קודים</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalCodes}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">סה&quot;כ שימושים</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalUsage}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="search">חיפוש</Label>
              <Input
                id="search"
                placeholder="חפש קוד הנחה..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status">סטטוס</Label>
              <Select value={isActiveFilter} onValueChange={setIsActiveFilter}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">הכל</SelectItem>
                  <SelectItem value="true">פעיל</SelectItem>
                  <SelectItem value="false">לא פעיל</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">טוען קודי הנחה...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : discountCodes.length === 0 ? (
            <div className="p-8 text-center text-gray-600">לא נמצאו קודי הנחה</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-right text-sm font-semibold">קוד</th>
                    <th className="pb-3 text-right text-sm font-semibold">סוג</th>
                    <th className="pb-3 text-right text-sm font-semibold">ערך</th>
                    <th className="pb-3 text-right text-sm font-semibold">שימוש</th>
                    <th className="pb-3 text-right text-sm font-semibold">תוקף</th>
                    <th className="pb-3 text-right text-sm font-semibold">סטטוס</th>
                    <th className="pb-3 text-right text-sm font-semibold">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {discountCodes.map((code) => (
                    <tr key={code.id} className="border-b">
                      <td className="py-4">
                        <div className="font-medium">{code.code}</div>
                        <div className="text-sm text-gray-600">
                          נוצר ב-{formatDate(code.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 text-sm">{getTypeText(code.type)}</td>
                      <td className="py-4 text-sm">
                        {code.type === "PERCENTAGE" ? `${code.value}%` : `₪${code.value}`}
                      </td>
                      <td className="py-4 text-sm">
                        {code.usageCount}
                        {code.usageLimit && ` / ${code.usageLimit}`}
                      </td>
                      <td className="py-4 text-sm">
                        {code.validUntil ? formatDate(code.validUntil) : "ללא תפוגה"}
                      </td>
                      <td className="py-4">{getStatusBadge(code.isActive)}</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditModal(code)}>
                            ערוך
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedCode(code);
                              setShowDeleteModal(true);
                            }}
                          >
                            מחק
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>צור קוד הנחה חדש</DialogTitle>
            <DialogDescription>מלא את הפרטים ליצירת קוד הנחה חדש</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="code">קוד הנחה *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="למשל: SUMMER10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">סוג הנחה *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: DiscountType) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">אחוז (%)</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">סכום קבוע (₪)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="value">ערך הנחה *</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                  placeholder={formData.type === "PERCENTAGE" ? "10" : "50"}
                  min="0"
                  max={formData.type === "PERCENTAGE" ? "100" : undefined}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validFrom">תוקף מתחיל *</Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="validUntil">תוקף עד *</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="usageLimit">הגבלת שימוש</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usageLimit || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usageLimit: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  placeholder="השאר ריק ללא הגבלה"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="minimumOrderValue">סכום מינימלי</Label>
                <Input
                  id="minimumOrderValue"
                  type="number"
                  value={formData.minimumOrderValue || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minimumOrderValue: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  placeholder="השאר ריק ללא מינימום"
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                פעיל
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              disabled={isSubmitting}
            >
              ביטול
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? "יוצר..." : "צור"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ערוך קוד הנחה</DialogTitle>
            <DialogDescription>עדכן את פרטי קוד ההנחה</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-code">קוד הנחה</Label>
              <Input id="edit-code" value={formData.code} disabled />
              <p className="mt-1 text-xs text-gray-600">לא ניתן לשנות את הקוד</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-type">סוג הנחה</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: DiscountType) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">אחוז (%)</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">סכום קבוע (₪)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-value">ערך הנחה</Label>
                <Input
                  id="edit-value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                  min="0"
                  max={formData.type === "PERCENTAGE" ? "100" : undefined}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-validFrom">תוקף מתחיל</Label>
                <Input
                  id="edit-validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-validUntil">תוקף עד</Label>
                <Input
                  id="edit-validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-usageLimit">הגבלת שימוש</Label>
                <Input
                  id="edit-usageLimit"
                  type="number"
                  value={formData.usageLimit || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usageLimit: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  placeholder="השאר ריק ללא הגבלה"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="edit-minimumOrderValue">סכום מינימלי</Label>
                <Input
                  id="edit-minimumOrderValue"
                  type="number"
                  value={formData.minimumOrderValue || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minimumOrderValue: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  placeholder="השאר ריק ללא מינימום"
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="edit-isActive" className="cursor-pointer">
                פעיל
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              disabled={isSubmitting}
            >
              ביטול
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? "מעדכן..." : "שמור שינויים"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>מחק קוד הנחה</DialogTitle>
            <DialogDescription>
              האם את/ה בטוח/ה שאת/ה רוצה למחוק את קוד ההנחה <strong>{selectedCode?.code}</strong>?
              {selectedCode?.ordersCount && selectedCode.ordersCount > 0 && (
                <div className="mt-2 text-red-600">
                  קוד זה קושר ל-{selectedCode.ordersCount} הזמנות ולא ניתן למחוק אותו.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isSubmitting}
            >
              ביטול
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting || (selectedCode?.ordersCount || 0) > 0}
            >
              {isSubmitting ? "מוחק..." : "מחק"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
