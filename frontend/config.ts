import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const getApiBaseUrl = (): string => {
  if (Platform.OS === 'web') {
    return 'http://localhost:5000';
  }

  // 1. Detect Expo host LAN IP for physical device connection over Wi-Fi
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest?.debuggerHost ||
    (Constants as any).manifest2?.extra?.expoGo?.developer?.tool ||
    (Constants as any).experienceUrl;

  if (hostUri && typeof hostUri === 'string') {
    const cleanHost = hostUri.replace('exp://', '').replace('http://', '');
    const ip = cleanHost.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:5000`;
    }
  }

  // 2. Default LAN IP for physical devices (matching Metro bundler on 172.23.24.194)
  const DEV_LAN_IP = '172.23.24.194';

  // Fallback: Use developer LAN IP for physical device, 10.0.2.2 for emulator
  return Platform.OS === 'android' ? `http://${DEV_LAN_IP}:5000` : 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();
