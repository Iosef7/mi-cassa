import es from './locales/es.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import he from './locales/he.json';

export const dictionaries = {
  es,
  en,
  fr,
  he
} as const;

export type Locale = keyof typeof dictionaries;
export type Dictionary = typeof dictionaries['es'];

export const defaultLocale: Locale = 'es';

export const getDictionary = (locale: string | undefined | null): Dictionary => {
  if (!locale) return dictionaries[defaultLocale];
  return dictionaries[locale as Locale] || dictionaries[defaultLocale];
};
