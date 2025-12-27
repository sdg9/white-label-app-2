import React from 'react';
import { PlaceholderScreen } from '../lib/PlaceholderScreen';

interface CardDetailsScreenProps {
  onBack?: () => void;
}

export function CardDetailsScreen({ onBack }: CardDetailsScreenProps) {
  return (
    <PlaceholderScreen
      title="Card Details"
      description="View your full card information"
      sections={[
        'Full card number (tap to copy)',
        'Expiration date',
        'CVV (tap to reveal)',
        'Cardholder name',
        'Billing address',
        'Card status',
        'Card network (Mastercard)',
      ]}
      actions={
        onBack
          ? [{ label: 'Go Back', onPress: onBack }]
          : []
      }
    />
  );
}
