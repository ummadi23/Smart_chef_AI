import React from 'react';
import ScannerScreen from './ScannerScreen';

interface ScanYourFridgeLandingScreenProps {
  onStartScan: () => void;
}

export default function ScanYourFridgeLandingScreen({
  onStartScan
}: ScanYourFridgeLandingScreenProps) {
  return <ScannerScreen onBack={onStartScan} />;
}
