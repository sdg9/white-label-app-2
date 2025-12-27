import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface SecuritySettingsScreenProps {
  onChangePin?: () => void;
  onBack?: () => void;
}

export function SecuritySettingsScreen({ onChangePin, onBack }: SecuritySettingsScreenProps) {
  return (
    <PlaceholderScreen
      title="Security"
      description="Manage your security settings"
      sections={[
        'Biometric authentication toggle (Face ID / Touch ID)',
        'Change PIN option',
        'Change password option',
        'Two-factor authentication',
        'Login history',
        'Active sessions',
        'Trusted devices',
      ]}
      actions={[
        ...(onChangePin ? [{ label: 'Change PIN', onPress: onChangePin }] : []),
        ...(onBack ? [{ label: 'Go Back', onPress: onBack }] : []),
      ]}
    />
  );
}
