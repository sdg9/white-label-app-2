import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface ChangePinScreenProps {
  onBack?: () => void;
}

export function ChangePinScreen({ onBack }: ChangePinScreenProps) {
  return (
    <PlaceholderScreen
      title="Change PIN"
      description="Update your card PIN"
      sections={[
        'Enter current PIN',
        'Enter new PIN',
        'Confirm new PIN',
        'PIN requirements info',
        'Submit button',
      ]}
      actions={
        onBack
          ? [{ label: 'Cancel', onPress: onBack }]
          : []
      }
    />
  );
}
