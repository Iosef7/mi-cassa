"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Locale } from "@/lib/i18n/dictionaries";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { locale, setLocale, dir } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value as Locale);
  };

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Globe className="w-4 h-4" />
      <select
        value={locale}
        onChange={handleLanguageChange}
        className="bg-transparent border-none outline-none cursor-pointer hover:text-foreground transition-colors"
        dir={dir}
      >
        <option value="es">Español</option>
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="he">עברית</option>
      </select>
    </div>
  );
}
