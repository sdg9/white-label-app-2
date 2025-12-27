import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface PrivacyPolicyScreenProps {
  onBack?: () => void;
}

export function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
  return (
    <PlaceholderScreen
      title="Privacy Policy"
      description="Last updated: January 2025"
      sections={[
        'Information we collect',
        'How we use your information',
        'Information sharing',
        'Data security',
        'Your rights and choices',
        'Cookies and tracking',
        'Third-party services',
        'Children\'s privacy',
        'Policy updates',
        'Contact us',
      ]}
      actions={
        onBack
          ? [{ label: 'Go Back', onPress: onBack }]
          : []
      }
    />
  );
}
