import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface HelpSupportScreenProps {
  onContactSupport?: () => void;
  onFAQ?: () => void;
  onBack?: () => void;
}

export function HelpSupportScreen({ onContactSupport, onFAQ, onBack }: HelpSupportScreenProps) {
  return (
    <PlaceholderScreen
      title="Help & Support"
      description="Get help with your account"
      sections={[
        'Search help articles',
        'FAQ categories',
        'Contact support options',
        'Live chat button',
        'Call support number',
        'Email support',
        'Report a problem',
        'Submit feedback',
      ]}
      actions={[
        ...(onFAQ ? [{ label: 'View FAQ', onPress: onFAQ }] : []),
        ...(onContactSupport ? [{ label: 'Contact Support', onPress: onContactSupport }] : []),
        ...(onBack ? [{ label: 'Go Back', onPress: onBack }] : []),
      ]}
    />
  );
}
