import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface ATMLocatorScreenProps {
  onClose?: () => void;
}

export function ATMLocatorScreen({ onClose }: ATMLocatorScreenProps) {
  return (
    <PlaceholderScreen
      title="ATM Locator"
      description="Find fee-free ATMs near you"
      sections={[
        'Full-screen map view',
        'Current location marker',
        'ATM pins (fee-free highlighted)',
        'Search bar for location',
        'Filter: All ATMs / Fee-free only',
        'List view toggle',
        'ATM details (network, fees)',
        'Navigate to ATM button',
      ]}
      actions={
        onClose
          ? [
              {
                label: 'Close',
                onPress: onClose,
              },
            ]
          : []
      }
    />
  );
}
