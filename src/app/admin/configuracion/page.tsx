import { getSectionSettings } from "@/actions/settings";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ClientConfig from "./ClientConfig";

export default async function ConfiguracionPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin");
  }

  const settings = await getSectionSettings();

  return <ClientConfig initialSettings={settings} />;
}
