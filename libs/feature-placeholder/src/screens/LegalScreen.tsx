import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface LegalScreenProps {
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
  onBack?: () => void;
}

export function LegalScreen({ onTermsPress, onPrivacyPress, onBack }: LegalScreenProps) {
  return (
    <PlaceholderScreen
      title="Legal"
      description="Terms, policies, and legal information"
      sections={[
        'Terms of Service',
        'Privacy Policy',
        'Cardholder Agreement',
        'E-Sign Consent',
        'Fee Schedule',
        'Licenses and disclosures',
      ]}
      actions={[
        ...(onTermsPress ? [{ label: 'View Terms of Service', onPress: onTermsPress }] : []),
        ...(onPrivacyPress ? [{ label: 'View Privacy Policy', onPress: onPrivacyPress }] : []),
        ...(onBack ? [{ label: 'Go Back', onPress: onBack }] : []),
      ]}
    />
  );
}
