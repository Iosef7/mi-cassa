"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { defaultLocale, Dictionary, dictionaries, Locale } from './dictionaries';
import { useRouter } from 'next/navigation';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ 
  children, 
  initialLocale 
}: { 
  children: React.ReactNode;
  initialLocale: Locale;
}) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    // Set cookie for Server Components
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    // Force a router refresh to re-render server components with the new cookie
    router.refresh();
  };

  const dict = dictionaries[locale] || dictionaries[defaultLocale];
  const dir = locale === 'he' ? 'rtl' : 'ltr';

  useEffect(() => {
    // Sync direction to html element on the client side just in case
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale, dir]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dict, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
