import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface NotificationPreferencesScreenProps {
  onBack?: () => void;
}

export function NotificationPreferencesScreen({ onBack }: NotificationPreferencesScreenProps) {
  return (
    <PlaceholderScreen
      title="Notifications"
      description="Manage your notification preferences"
      sections={[
        'Push notifications toggle',
        'Email notifications toggle',
        'SMS notifications toggle',
        'Transaction alerts',
        'Marketing communications',
        'Security alerts',
        'Low balance alerts',
        'Rewards updates',
      ]}
      actions={
        onBack
          ? [{ label: 'Go Back', onPress: onBack }]
          : []
      }
    />
  );
}
