import React from "react";
import AdminLayoutWrapper from "@/components/AdminLayoutWrapper";
import { getSectionSettings, getSiteLogo } from "@/actions/settings";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [settings, session, siteLogo] = await Promise.all([
    getSectionSettings(),
    auth(),
    getSiteLogo()
  ]);

  if (!session) {
    redirect("/login");
  }

  return (
    <AdminLayoutWrapper settings={settings} userRole={session?.user?.role} siteLogo={siteLogo}>
      {children}
    </AdminLayoutWrapper>
  );
}
