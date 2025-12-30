"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  productName: string;
  productSize: string;
  quantity: number;
}

interface ExchangeFormProps {
  token: string;
  customerName: string;
  orderNumber: string;
  items: OrderItem[];
}

export function ExchangeForm({ token, customerName, orderNumber, items }: ExchangeFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Form State
  const [selectedItemIndex, setSelectedItemIndex] = useState<string>("");
  const [returnReason, setReturnReason] = useState("size_mismatch");
  const [requestedSize, setRequestedSize] = useState("");
  const [note, setNote] = useState("");

  const selectedItem = selectedItemIndex !== "" ? items[parseInt(selectedItemIndex)] : null;

  const handleSubmit = async () => {
    if (!selectedItem || !requestedSize) {
      toast({
        title: "חסרים פרטים",
        description: "נא לבחור פריט להחזרה ומידה מבוקשת",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/exchanges/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          returnItem: `${selectedItem.productName} - מידה ${selectedItem.productSize}`,
          requestedItem: `מידה ${requestedSize}`, // User input
          returnReason,
          note,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "שגיאה ביצירת תשלום");
      }

      // Redirect to Cardcom
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה ביצירת התשלום. נסה שוב.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl text-center">בקשת החלפה / החזרה</CardTitle>
          <div className="text-center text-gray-600 text-sm">
            שלום {customerName}, עבור הזמנה #{orderNumber}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Select Item */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">איזה פריט תרצי להחליף?</Label>
            <RadioGroup value={selectedItemIndex} onValueChange={setSelectedItemIndex}>
              {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 space-x-reverse border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value={index.toString()} id={`item-${index}`} />
                  <Label htmlFor={`item-${index}`} className="flex-1 cursor-pointer">
                    <span className="font-medium">{item.productName}</span>
                    <span className="block text-sm text-gray-500">מידה: {item.productSize}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {selectedItem && (
            <>
              {/* Step 2: Reason */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">סיבת ההחלפה</Label>
                <RadioGroup value={returnReason} onValueChange={setReturnReason}>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="size_mismatch" id="r-size" />
                    <Label htmlFor="r-size">המידה לא מתאימה</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="defect" id="r-defect" />
                    <Label htmlFor="r-defect">פגם במוצר</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="other" id="r-other" />
                    <Label htmlFor="r-other">אחר</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Step 3: Requested Item */}
              <div className="space-y-3">
                <Label htmlFor="requested-size" className="text-base font-semibold">איזו מידה תרצי במקום?</Label>
                <Input
                  id="requested-size"
                  placeholder="לדוגמה: מידה L, או צבע אחר..."
                  value={requestedSize}
                  onChange={(e) => setRequestedSize(e.target.value)}
                />
              </div>

              {/* Step 4: Notes */}
              <div className="space-y-3">
                <Label htmlFor="note" className="text-base font-semibold">הערות נוספות (אופציונלי)</Label>
                <Textarea
                  id="note"
                  placeholder="פרטים נוספים שיעזרו לנו..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {/* Cost Info */}
              <div className="bg-gray-50 p-4 rounded-lg border text-sm space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>עלות משלוח להחלפה:</span>
                  <span>₪29.00</span>
                </div>
                <p className="text-gray-500 text-xs">
                  * זמן הטיפול בהחלפה הוא עד 10 ימי עסקים מרגע קבלת הבקשה.
                  <br />
                  * שליח יגיע לאסוף את הפריט הישן ולמסור את החדש.
                </p>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full text-lg py-6" 
            onClick={handleSubmit} 
            disabled={loading || !selectedItem || !requestedSize}
          >
            {loading ? "מעבד נתונים..." : "לתשלום ₪29 ואישור"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
