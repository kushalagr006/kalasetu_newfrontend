import { Platform } from 'react-native';
import { fetchFromBackend } from '@/services/apiClient';

const TOKEN_KEY = 'kalasetu_auth_token';
const USER_KEY = 'kalasetu_auth_user';

let memoryToken: string | null = null;
let memoryUser: any | null = null;

let FileSystem: any = null;
try {
  FileSystem = require('expo-file-system');
} catch (e) {
  // FileSystem module fallback
}

const getTokenFilePath = () => (FileSystem && FileSystem.documentDirectory ? `${FileSystem.documentDirectory}kalasetu_token.txt` : null);
const getUserFilePath = () => (FileSystem && FileSystem.documentDirectory ? `${FileSystem.documentDirectory}kalasetu_user.json` : null);

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
  } else if (FileSystem) {
    try {
      const tokenPath = getTokenFilePath();
      const userPath = getUserFilePath();
      if (tokenPath) await FileSystem.writeAsStringAsync(tokenPath, token);
      if (userPath) await FileSystem.writeAsStringAsync(userPath, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to save session to FileSystem:', e);
    }
  }
}

export async function getAuthToken(): Promise<string | null> {
  if (memoryToken) return memoryToken;

  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem(TOKEN_KEY);
      if (stored) {
        memoryToken = stored;
        return stored;
      }
    } catch (e) {
      return null;
    }
  } else if (FileSystem) {
    try {
      const tokenPath = getTokenFilePath();
      if (tokenPath) {
        const info = await FileSystem.getInfoAsync(tokenPath);
        if (info.exists) {
          const content = await FileSystem.readAsStringAsync(tokenPath);
          memoryToken = content;
          return content;
        }
      }
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
        memoryUser = JSON.parse(stored);
        return memoryUser;
      }
    } catch (e) {
      return null;
    }
  } else if (FileSystem) {
    try {
      const userPath = getUserFilePath();
      if (userPath) {
        const info = await FileSystem.getInfoAsync(userPath);
        if (info.exists) {
          const content = await FileSystem.readAsStringAsync(userPath);
          memoryUser = JSON.parse(content);
          return memoryUser;
        }
      }
    } catch (e) {
      return null;
    }
  }
  return null;
}

export async function fetchFreshUserProfile(): Promise<any | null> {
  try {
    const token = await getAuthToken();
    if (!token) return await getAuthUser();
    const res = await fetchFromBackend('/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const user = await res.json();
      await saveAuthSession(token, user);
      return user;
    }
  } catch (e) {
    console.warn('Failed to fetch fresh user profile:', e);
  }
  return await getAuthUser();
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
  } else if (FileSystem) {
    try {
      const tokenPath = getTokenFilePath();
      const userPath = getUserFilePath();
      if (tokenPath) await FileSystem.deleteAsync(tokenPath, { idempotent: true });
      if (userPath) await FileSystem.deleteAsync(userPath, { idempotent: true });
    } catch (e) {
      console.warn('Failed to clear session from FileSystem:', e);
    }
  }
}
