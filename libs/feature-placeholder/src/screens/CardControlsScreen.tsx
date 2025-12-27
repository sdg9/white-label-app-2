import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface CardControlsScreenProps {
  onBack?: () => void;
}

export function CardControlsScreen({ onBack }: CardControlsScreenProps) {
  return (
    <PlaceholderScreen
      title="Card Controls"
      description="Manage your card settings and limits"
      sections={[
        'Card lock/unlock toggle',
        'Online transactions toggle',
        'International transactions toggle',
        'ATM withdrawals toggle',
        'Contactless payments toggle',
        'Transaction limits settings',
        'Daily spending limit',
        'ATM withdrawal limit',
        'Merchant category restrictions',
      ]}
      actions={
        onBack
          ? [{ label: 'Go Back', onPress: onBack }]
          : []
      }
    />
  );
}
