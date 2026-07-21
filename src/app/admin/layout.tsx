import React from "react";
import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";
import { getSectionSettings, getSiteLogo } from "@/actions/settings";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { headers } from "next/headers";

import ClearCookiesAndRedirect from "@/components/ClearCookiesAndRedirect";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [settings, siteLogo] = await Promise.all([
    getSectionSettings(),
    getSiteLogo()
  ]);

  let session = null;
  let userRole = undefined;
  
  try {
    session = await auth();
    console.log("[DEBUG-LAYOUT] session inside AdminLayout:", session);
    userRole = session?.user?.role || undefined;
  } catch (error) {
    console.error("[DEBUG-LAYOUT] Error authenticating session. Corrupt JWT token detected:", error);
    // If the token is corrupt or decryption fails, we must clear the client cookies
    return <ClearCookiesAndRedirect />;
  }

  // We rely entirely on the middleware.ts to enforce the redirect.
  // We no longer call redirect("/login") here, avoiding the Server Action / RSC cache bug.

  return (
    <AdminLayoutWrapper settings={settings} userRole={userRole} siteLogo={siteLogo}>
      {children}
    </AdminLayoutWrapper>
  );
}
