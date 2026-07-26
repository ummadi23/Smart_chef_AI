// frontend/fridgeVision.ts
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { getApiBaseUrl } from './config';

export interface DetectedItem {
    name: string;
    confidence?: number | string;
}

/**
 * Opens the camera, takes a photo, converts it to base64, 
 * and sends it to the Node.js Express backend server.
 */
export async function runFridgeScan(): Promise<DetectedItem[]> {
    try {
        // 1. Request camera permissions
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission Denied", "We need camera access to analyze ingredients!");
            return [];
        }

        // 2. Open camera viewfinder overlay
        const cameraResult = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 0.85, // Cap compression at 85% JPEG quality
            base64: true,  // Extract base64 image payload string
        });

        if (cameraResult.canceled || !cameraResult.assets?.[0]?.base64) {
            return [];
        }

        // 3. POST raw stream directly to backend Express route
        const backendUrl = `${getApiBaseUrl()}/api/recipes/scan-fridge`;
        const base64Image = `data:image/jpeg;base64,${cameraResult.assets[0].base64}`;

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64Image }),
        });

        const data = await response.json();

        if (data.status === 'success' && data.detectedIngredients) {
            return data.detectedIngredients.map((name: string) => ({ name, confidence: 'high' }));
        } else if (data.success && data.items) {
            return data.items;
        } else {
            Alert.alert("Scan Error", data.error || data.message || "Could not analyze images.");
            return [];
        }
    } catch (error: any) {
        console.error("AI Gateway Connection Error:", error);
        Alert.alert("Connection Failed", "Cannot connect to Node.js backend server.");
        return [];
    }
}
