"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Skip auth check on login page
    if (pathname === "/admin/login") {
      setChecking(false);
      return;
    }

    // Check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/session");
        if (response.ok) {
          setAuthenticated(true);
        } else {
          router.push("/admin/login");
        }
      } catch (error) {
        router.push("/admin/login");
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  // Show loading while checking auth
  if (checking && pathname !== "/admin/login") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  // Login page - no layout
  if (pathname === "/admin/login") {
    return children;
  }

  // Admin pages - with navigation
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-primary">YL Sport Admin</h1>
            <nav className="flex gap-4">
              <Link
                href="/admin"
                className={`rounded px-3 py-2 ${pathname === "/admin" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
              >
                הזמנות
              </Link>
              <Link
                href="/admin/discounts"
                className={`rounded px-3 py-2 ${pathname === "/admin/discounts" ? "bg-primary text-white" : "hover:bg-gray-100"}`}
              >
                קודי הנחה
              </Link>
            </nav>
          </div>
          <Button onClick={handleLogout} variant="outline">
            התנתקות
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
