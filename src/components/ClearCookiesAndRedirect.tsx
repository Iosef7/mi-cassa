"use client";

import { useEffect } from "react";

export default function ClearCookiesAndRedirect() {
  useEffect(() => {
    // Clear known NextAuth cookies
    document.cookie = "authjs.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "__Secure-authjs.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "authjs.csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "__Host-authjs.csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Fallback to legacy next-auth names just in case
    document.cookie = "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "__Secure-next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Clear local storage and session storage
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login
    window.location.href = "/login?cleared=true";
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background flex-col gap-4">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      <p className="text-muted-foreground text-sm font-medium">Limpiando sesión corrupta...</p>
    </div>
  );
}
