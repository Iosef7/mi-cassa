import React from "react";
import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";
import { getSectionSettings, getSiteLogo } from "@/actions/settings";
import { auth } from "@/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [settings, session, siteLogo] = await Promise.all([
    getSectionSettings(),
    auth(),
    getSiteLogo()
  ]);

  return (
    <AdminLayoutWrapper settings={settings} userRole={session?.user?.role} siteLogo={siteLogo}>
      {children}
    </AdminLayoutWrapper>
  );
}
