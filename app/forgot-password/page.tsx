"use client";

import { Suspense } from "react";
import { UnifiedAuthComponent } from "@/app/login/page";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))]">
          <Loader2 className="animate-spin text-[hsl(var(--primary))]" size={28} />
        </div>
      }
    >
      <UnifiedAuthComponent initialMode="forgot" />
    </Suspense>
  );
}
