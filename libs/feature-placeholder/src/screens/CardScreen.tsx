import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface CardScreenProps {
  onCardControlsPress?: () => void;
}

export function CardScreen({ onCardControlsPress }: CardScreenProps) {
  return (
    <PlaceholderScreen
      title="Card"
      description="Your virtual Uber Pro Card"
      sections={[
        'Full virtual card display',
        'Card number (tap to copy)',
        'Expiry date',
        'CVV (tap to reveal)',
        'Add to Apple/Google Wallet button',
        'Card freeze toggle',
        'Card controls section',
        'Order physical card option',
      ]}
      actions={[
        {
          label: 'Card Controls',
          onPress: () => onCardControlsPress?.(),
        },
      ]}
    />
  );
}
