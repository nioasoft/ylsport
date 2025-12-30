import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ExchangeForm } from "@/components/exchange/ExchangeForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: {
    token: string;
  };
  searchParams: {
    payment?: string;
  };
}

export default async function ExchangePage({ params, searchParams }: PageProps) {
  const { token } = params;
  const paymentSuccess = searchParams.payment === "success";

  const exchangeRequest = await prisma.exchangeRequest.findUnique({
    where: { token },
    include: { 
      order: {
        include: { items: true }
      } 
    },
  });

  if (!exchangeRequest) {
    notFound();
  }

  // Check if paid
  const isPaid = exchangeRequest.status === "PAID" || exchangeRequest.status === "PROCESSED";

  if (isPaid || paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
               <Image src="/images/logo_vector 3.svg" alt="YL Sport" width={60} height={60} />
            </div>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-2xl text-green-700">הבקשה התקבלה בהצלחה!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              תודה {exchangeRequest.order.customerName},<br/>
              קיבלנו את התשלום ואת פרטי ההחלפה.
            </p>
            
            {(exchangeRequest.returnItem || exchangeRequest.requestedItem) && (
              <div className="bg-gray-100 p-4 rounded-md text-sm text-right space-y-2">
                <p className="font-semibold text-gray-800 border-b pb-1 mb-2">פרטי הבקשה:</p>
                {exchangeRequest.returnItem && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">החזרה:</span>
                    <span className="font-medium">{exchangeRequest.returnItem}</span>
                  </div>
                )}
                {exchangeRequest.requestedItem && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">מבוקש:</span>
                    <span className="font-medium">{exchangeRequest.requestedItem}</span>
                  </div>
                )}
              </div>
            )}
            
            <p className="text-sm text-gray-500 mt-4">
              שליח יצור איתך קשר בימים הקרובים לתיאום ההחלפה.
              <br/>
              מספר הזמנה: {exchangeRequest.order.orderNumber}
            </p>
            <div className="pt-6">
              <Link href="/">
                <Button variant="outline" className="w-full">חזרה לאתר</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Map items
  const items = exchangeRequest.order.items.map(item => ({
    productName: item.productName,
    productSize: item.productSize,
    quantity: item.quantity,
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
           <Image src="/images/logo_vector 3.svg" alt="YL Sport" width={80} height={80} />
        </div>
        
        <ExchangeForm 
          token={token}
          customerName={exchangeRequest.order.customerName}
          orderNumber={exchangeRequest.order.orderNumber}
          items={items}
        />
      </div>
    </div>
  );
}
