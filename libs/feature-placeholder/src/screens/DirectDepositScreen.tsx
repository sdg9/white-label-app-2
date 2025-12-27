import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface DirectDepositScreenProps {
  onBack?: () => void;
}

export function DirectDepositScreen({ onBack }: DirectDepositScreenProps) {
  return (
    <PlaceholderScreen
      title="Direct Deposit"
      description="Set up direct deposit to your card"
      sections={[
        'Account number (tap to copy)',
        'Routing number (tap to copy)',
        'Bank name for deposits',
        'Account type info',
        'Share/email details button',
        'Download PDF form',
        'Setup instructions',
        'Early direct deposit info',
      ]}
      actions={
        onBack
          ? [{ label: 'Go Back', onPress: onBack }]
          : []
      }
    />
  );
}
