import { useState, useEffect } from 'react';

export type LangCode = 'en' | 'hi' | 'bn' | 'bho' | 'mr' | 'gu' | 'raj' | 'kn';

export const ALL_LANGUAGES: { code: LangCode; nativeName: string; englishName: string }[] = [
  { code: 'en', nativeName: 'English', englishName: 'English' },
  { code: 'hi', nativeName: 'हिंदी', englishName: 'Hindi' },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali' },
  { code: 'bho', nativeName: 'भोजपुरी', englishName: 'Bhojpuri' },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi' },
  { code: 'gu', nativeName: 'ગુજરાતી', englishName: 'Gujarati' },
  { code: 'raj', nativeName: 'राजस्थानी', englishName: 'Rajasthani' },
  { code: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada' },
];

function getStoredLang(): LangCode {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem('kalasetu_lang') as LangCode;
      if (saved && ALL_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch (e) {
      // Ignore storage errors
    }
  }
  return 'hi';
}

let currentGlobalLang: LangCode = getStoredLang();
const listeners: Array<(lang: LangCode) => void> = [];

export function getGlobalLang(): LangCode {
  return currentGlobalLang;
}

export function setGlobalLang(lang: LangCode) {
  currentGlobalLang = lang;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem('kalasetu_lang', lang);
    } catch (e) {
      // Ignore
    }
  }
  listeners.forEach((listener) => listener(lang));
}

export function subscribeLang(listener: (lang: LangCode) => void) {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

export function useGlobalLang() {
  const [lang, setLangState] = useState<LangCode>(getGlobalLang());

  useEffect(() => {
    setLangState(getGlobalLang());
    const unsubscribe = subscribeLang((newLang) => {
      setLangState(newLang);
    });
    return unsubscribe;
  }, []);

  const changeLang = (newLang: LangCode) => {
    setGlobalLang(newLang);
  };

  return [lang, changeLang] as const;
}
