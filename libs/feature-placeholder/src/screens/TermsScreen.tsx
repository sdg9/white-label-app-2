import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface TermsScreenProps {
  onBack?: () => void;
}

export function TermsScreen({ onBack }: TermsScreenProps) {
  return (
    <PlaceholderScreen
      title="Terms of Service"
      description="Last updated: January 2025"
      sections={[
        'Introduction and acceptance',
        'Account eligibility',
        'Account registration',
        'Services description',
        'Fees and charges',
        'User responsibilities',
        'Prohibited activities',
        'Limitation of liability',
        'Dispute resolution',
        'Contact information',
      ]}
      actions={
        onBack
          ? [{ label: 'Go Back', onPress: onBack }]
          : []
      }
    />
  );
}
