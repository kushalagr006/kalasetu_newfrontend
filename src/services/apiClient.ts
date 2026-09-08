import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getExpoHostIp = (): string | null => {
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.developer?.manifest?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return ip;
    }
  }
  return null;
};

const hostIp = getExpoHostIp();

const CANDIDATE_BASE_URLS: string[] = [
  'https://prints-numerous-gulf-swim.trycloudflare.com/api/v1',
  'http://192.168.29.242:8000/api/v1',
];
if (hostIp) {
  CANDIDATE_BASE_URLS.push(`http://${hostIp}:8000/api/v1`);
}
if (Platform.OS === 'android') {
  CANDIDATE_BASE_URLS.push('http://10.0.2.2:8000/api/v1');
}
CANDIDATE_BASE_URLS.push('http://localhost:8000/api/v1');

const UNIQUE_BASE_URLS = Array.from(new Set(CANDIDATE_BASE_URLS));

let activeBaseUrl = UNIQUE_BASE_URLS[0];

export const API_BASE_URL = activeBaseUrl;
export const SERVER_HOST = activeBaseUrl.replace('/api/v1', '');

export async function enhanceCameraPhotoBase64(base64Uri: string): Promise<string | null> {
  const hostCandidates = UNIQUE_BASE_URLS.map((u) => u.replace('/api/v1', ''));

  for (const host of hostCandidates) {
    try {
      const res = await fetch(`${host}/api/enhance-camera-photo-base64`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'bypass-tunnel-reminder': 'true',
          'Bypass-Tunnel-Reminder': 'true',
        },
        body: JSON.stringify({ image_base64: base64Uri }),
      });
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
