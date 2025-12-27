import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface FAQScreenProps {
  onBack?: () => void;
}

export function FAQScreen({ onBack }: FAQScreenProps) {
  return (
    <PlaceholderScreen
      title="FAQ"
      description="Frequently asked questions"
      sections={[
        'Getting started category',
        'Account & profile category',
        'Card & payments category',
        'Transfers & deposits category',
        'Security category',
        'Rewards & benefits category',
        'Expandable FAQ items',
        'Search FAQs',
      ]}
      actions={
        onBack
          ? [{ label: 'Go Back', onPress: onBack }]
          : []
      }
    />
  );
}
