import { useState, useEffect } from 'react';

export type LangCode = 'hi' | 'en';

let currentGlobalLang: LangCode = typeof window !== 'undefined' ? 'en' : 'hi';
const listeners: Array<(lang: LangCode) => void> = [];

// Website is strictly English
if (typeof window !== 'undefined') {
  currentGlobalLang = 'en';
}

export function getGlobalLang(): LangCode {
  if (typeof window !== 'undefined') return 'en';
  return currentGlobalLang;
}

export function setGlobalLang(lang: LangCode) {
  currentGlobalLang = lang;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem('kalasetu_lang', lang);
    } catch (e) {
      // Ignore storage restrictions
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
