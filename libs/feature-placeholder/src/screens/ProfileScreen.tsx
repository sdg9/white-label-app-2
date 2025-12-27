import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface ProfileScreenProps {
  onBack?: () => void;
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  return (
    <PlaceholderScreen
      title="Profile"
      description="Manage your personal information"
      sections={[
        'Profile photo',
        'Full name (editable)',
        'Email address (editable)',
        'Phone number (editable)',
        'Date of birth',
        'Address',
        'Save changes button',
      ]}
      actions={
        onBack
          ? [{ label: 'Go Back', onPress: onBack }]
          : []
      }
    />
  );
}
