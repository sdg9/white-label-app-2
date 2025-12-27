import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface GasMapScreenProps {
  onClose?: () => void;
}

export function GasMapScreen({ onClose }: GasMapScreenProps) {
  return (
    <PlaceholderScreen
      title="Gas Stations"
      description="Find gas stations with Mastercard Easy Savings"
      sections={[
        'Full-screen map view',
        'Current location marker',
        'Gas station pins with cashback %',
        'Search bar for location',
        'Filter by cashback amount',
        'List view toggle',
        'Station details card',
        'Navigate to station button',
      ]}
      actions={
        onClose
          ? [
              {
                label: 'Close Map',
                onPress: onClose,
              },
            ]
          : []
      }
    />
  );
}
