import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface SettingsScreenProps {
  onLogout: () => void;
}

export function SettingsScreen({ onLogout }: SettingsScreenProps) {
  return (
    <PlaceholderScreen
      title="Settings"
      description="Account settings and preferences"
      sections={[
        'Profile section (name, email, phone)',
        'Notification preferences',
        'Security settings',
        'Linked bank accounts',
        'Help & Support',
        'Legal (Terms, Privacy)',
        'App version',
        'Sign out button',
      ]}
      actions={[
        {
          label: 'Sign Out',
          onPress: onLogout,
        },
      ]}
    />
  );
}
