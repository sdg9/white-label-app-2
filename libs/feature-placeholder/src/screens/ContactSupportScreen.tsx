import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface ContactSupportScreenProps {
  onBack?: () => void;
}

export function ContactSupportScreen({ onBack }: ContactSupportScreenProps) {
  return (
    <PlaceholderScreen
      title="Contact Support"
      description="Get in touch with our support team"
      sections={[
        'Live chat option',
        'Phone support with number',
        'Email support form',
        'Category selection for issue',
        'Description text input',
        'Attach screenshots option',
        'Submit request button',
        'Estimated response time',
      ]}
      actions={
        onBack
          ? [{ label: 'Go Back', onPress: onBack }]
          : []
      }
    />
  );
}
