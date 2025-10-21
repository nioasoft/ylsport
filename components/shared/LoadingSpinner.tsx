import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-primary border-t-transparent",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="טוען..."
    >
      <span className="sr-only">טוען...</span>
    </div>
  );
}

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "טוען..." }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto" />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "טוען..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-lg bg-white p-8 text-center shadow-lg">
        <LoadingSpinner size="lg" className="mx-auto" />
        <p className="mt-4 text-gray-900">{message}</p>
      </div>
    </div>
  );
}
