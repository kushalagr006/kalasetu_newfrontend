import { Platform } from 'react-native';

const TOKEN_KEY = 'kalasetu_auth_token';
const USER_KEY = 'kalasetu_auth_user';

let memoryToken: string | null = null;
let memoryUser: any | null = null;

export async function saveAuthSession(token: string, user: any): Promise<void> {
  memoryToken = token;
  memoryUser = user;

  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }
}

export async function getAuthToken(): Promise<string | null> {
  if (memoryToken) return memoryToken;

  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      return window.localStorage.getItem(TOKEN_KEY);
    } catch (e) {
      return null;
    }
  }
  return null;
}

export async function getAuthUser(): Promise<any | null> {
  if (memoryUser) return memoryUser;

  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem(USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      return null;
    }
  }
  return null;
}

export async function clearAuthSession(): Promise<void> {
  memoryToken = null;
  memoryUser = null;

  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.warn('Failed to clear localStorage:', e);
    }
  }
}
