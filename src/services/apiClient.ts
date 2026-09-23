import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getExpoHostIp = (): string | null => {
  const candidateHostUris = [
    Constants.expoConfig?.hostUri,
    (Constants as any).developer?.manifest?.debuggerHost,
    Constants.manifest2?.extra?.expoGo?.developer?.manifest?.debuggerHost,
    (Constants as any).manifest?.debuggerHost,
    (Constants as any).manifest?.hostUri,
    (Constants as any).experienceUrl,
    (Constants as any).linkingUri,
  ];

  for (const rawUri of candidateHostUris) {
    if (typeof rawUri === 'string' && rawUri) {
      const cleaned = rawUri.replace(/^exp:\/\//, '').replace(/^http:\/\//, '').replace(/^https:\/\//, '');
      const ip = cleaned.split(':')[0].split('/')[0];
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1' && ip !== '0.0.0.0') {
        return ip;
      }
    }
  }
  return null;
};

const hostIp = getExpoHostIp();

const CANDIDATE_BASE_URLS: string[] = [];

if (hostIp) {
  CANDIDATE_BASE_URLS.push(`http://${hostIp}:8000/api/v1`);
}

// Machine local LAN IPs for physical device connections over Wi-Fi
CANDIDATE_BASE_URLS.push('http://192.168.29.242:8000/api/v1');
CANDIDATE_BASE_URLS.push('http://10.54.178.243:8000/api/v1');

if (Platform.OS === 'web') {
  CANDIDATE_BASE_URLS.push('http://localhost:8000/api/v1');
  CANDIDATE_BASE_URLS.push('http://127.0.0.1:8000/api/v1');
}

if (Platform.OS === 'android') {
  CANDIDATE_BASE_URLS.push('http://10.0.2.2:8000/api/v1');
}

CANDIDATE_BASE_URLS.push('http://localhost:8000/api/v1');
CANDIDATE_BASE_URLS.push('http://127.0.0.1:8000/api/v1');

const UNIQUE_BASE_URLS = Array.from(new Set(CANDIDATE_BASE_URLS));

let activeBaseUrl = UNIQUE_BASE_URLS[0];

export const API_BASE_URL = activeBaseUrl;
export const SERVER_HOST = activeBaseUrl.replace('/api/v1', '');

export async function enhanceCameraPhotoBase64(rawUri: string): Promise<string | null> {
  let base64Payload = rawUri;

  // If running in browser and URI is a blob or local asset URL, convert it to base64 data URL
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (rawUri.startsWith('blob:') || (rawUri.startsWith('http') && !rawUri.includes(':8000'))) {
      try {
        const response = await fetch(rawUri);
        const blob = await response.blob();
        base64Payload = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.warn('Blob to base64 conversion warning:', err);
      }
    }
  }

  const hostCandidates = UNIQUE_BASE_URLS.map((u) => u.replace('/api/v1', ''));

  for (const host of hostCandidates) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const res = await fetch(`${host}/api/enhance-camera-photo-base64`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'bypass-tunnel-reminder': 'true',
          'Bypass-Tunnel-Reminder': 'true',
        },
        body: JSON.stringify({ image_base64: base64Payload }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.enhanced_base64) {
          return data.enhanced_base64;
        }
      }
    } catch (e) {
      // Try next host
    }
  }
  return null;
}

export async function fetchFromBackend(path: string, options?: RequestInit & { timeoutMs?: number }): Promise<Response> {
  const hostCandidates = UNIQUE_BASE_URLS.map((u) => u.replace('/api/v1', ''));
  let lastError: any = null;
  const timeoutMs = options?.timeoutMs || (path.includes('speech-to-text') || path.includes('pricing') || path.includes('enhance') ? 60000 : 30000);

  for (const host of hostCandidates) {
    try {
      const url = `${host}${path.startsWith('/') ? path : '/' + path}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const fetchOptions = { ...options };
      delete (fetchOptions as any).timeoutMs;

      const res = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'bypass-tunnel-reminder': 'true',
          'Bypass-Tunnel-Reminder': 'true',
          ...(options?.headers || {}),
        },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        return res;
      } else {
        // Server responded with HTTP error status (4xx / 5xx) -> stop looping and return response
        return res;
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error(`Failed to connect to backend server for ${path}`);
}

export async function checkPhoneRegistered(phone: string): Promise<{ is_registered: boolean; user_id?: string; full_name?: string }> {
  const res = await fetchFromBackend('/api/v1/auth/check-phone', {
    method: 'POST',
    body: JSON.stringify({ phone_number: phone }),
  });
  return await res.json();
}

export async function requestLoginOtp(phone: string): Promise<{ message: string; phone_number: string; demo_otp?: string }> {
  const hostCandidates = UNIQUE_BASE_URLS.map((u) => u.replace('/api/v1', ''));
  let lastError: any = null;

  for (const host of hostCandidates) {
    try {
      const url = `${host}/api/v1/auth/request-otp`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to request OTP');
      }
      return data;
    } catch (err: any) {
      lastError = err;
      // If server returned a business logic error (e.g. 404 Unregistered or 400), throw immediately
      if (err.message && !err.name?.includes('AbortError') && !err.message.includes('canceled') && !err.message.includes('failed to fetch')) {
        throw err;
      }
    }
  }
  if (lastError && (lastError.name?.includes('AbortError') || lastError.message?.includes('canceled'))) {
    throw new Error('Backend connection timed out. Please check if backend server is running on http://localhost:8000');
  }
  throw lastError || new Error('Failed to request OTP');
}

export async function verifyLoginOtp(phone: string, otpCode: string): Promise<any> {
  const hostCandidates = UNIQUE_BASE_URLS.map((u) => u.replace('/api/v1', ''));
  let lastError: any = null;

  for (const host of hostCandidates) {
    try {
      const url = `${host}/api/v1/auth/verify-otp-login`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone, otp_code: otpCode }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Invalid OTP. Please try again.');
      }
      return data;
    } catch (err: any) {
      lastError = err;
      if (err.message && !err.name?.includes('AbortError') && !err.message.includes('canceled') && !err.message.includes('failed to fetch')) {
        throw err;
      }
    }
  }
  if (lastError && (lastError.name?.includes('AbortError') || lastError.message?.includes('canceled'))) {
    throw new Error('Backend connection timed out. Please check if backend server is running on http://localhost:8000');
  }
  throw lastError || new Error('Failed to verify OTP');
}

export async function registerArtisan(payload: any): Promise<any> {
  const hostCandidates = UNIQUE_BASE_URLS.map((u) => u.replace('/api/v1', ''));
  let lastError: any = null;

  for (const host of hostCandidates) {
    try {
      const url = `${host}/api/v1/auth/signup/artisan/register`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Registration failed');
      }
      return data;
    } catch (err: any) {
      lastError = err;
      if (err.message && !err.name?.includes('AbortError') && !err.message.includes('canceled') && !err.message.includes('failed to fetch')) {
        throw err;
      }
    }
  }
  if (lastError && (lastError.name?.includes('AbortError') || lastError.message?.includes('canceled'))) {
    throw new Error('Backend connection timed out. Please check if backend server is running on http://localhost:8000');
  }
  throw lastError || new Error('Registration failed');
}


